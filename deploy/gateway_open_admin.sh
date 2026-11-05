#!/usr/bin/env bash
# Opens the admin dashboard login to every device (phones on mobile data, home Wi-Fi, ...).
# Run ON THE GATEWAY (192.168.1.192) with sudo - and ONLY AFTER the admin password has been changed
# (deploy/set_admin_password.sh on the VM). It removes the "office network only" rule from the AVM site file.
#   scp deploy/gateway_open_admin.sh <gateway-user>@192.168.1.192:/tmp/ && ssh <gateway-user>@192.168.1.192 sudo bash /tmp/gateway_open_admin.sh
# The VM still protects the login with a rate limit (about 12 tries a minute per visitor) and fail2ban.
set -euo pipefail
[ "$(id -u)" = 0 ] || { echo "run with sudo"; exit 1; }
F=/etc/nginx/sites-available/avm
[ -f "$F" ] || { echo "missing $F"; exit 1; }
cp "$F" /root/avm.conf.before-open-admin.bak

python3 - "$F" <<'PYEOF'
import re, sys
p = sys.argv[1]
s = open(p).read()
n = s.count("location /backend/api/admin/")
# drop each `location /backend/api/admin/ { ... }` block (it contains no nested braces)
s = re.sub(r"(\n[ \t]*#[^\n]*)+(?=\n[ \t]*location /backend/api/admin/ \{)", "", s)   # and the comment lines above each block
s = re.sub(r"\n[ \t]*location /backend/api/admin/ \{.*?\n[ \t]*\}\n", "\n", s, flags=re.S)
open(p, "w").write(s)
print(f"removed {n} office-only rule block(s)")
PYEOF

if nginx -t; then systemctl reload nginx; echo "nginx reloaded - admin login is open to all devices"
else cp /root/avm.conf.before-open-admin.bak "$F"; nginx -t && systemctl reload nginx; echo "nginx test FAILED - previous file restored"; exit 1; fi
curl -s -o /dev/null -w "login endpoint reachable (401 = reachable, 403 = still blocked): %{http_code}\n" \
  --resolve avm.pixelatenest.com:443:127.0.0.1 -k -X POST -H 'Content-Type: application/json' -d '{"username":"x","password":"x"}' https://avm.pixelatenest.com/backend/api/admin/login.php
echo "to undo: sudo cp /root/avm.conf.before-open-admin.bak $F && sudo nginx -t && sudo systemctl reload nginx"
