#!/usr/bin/env bash
# Production hardening for the AVM VM. Run ON THE VM as root:   sudo bash harden_vm.sh
# Safe to re-run (idempotent). Every nginx change is tested first and rolled back automatically if the test fails.
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive
SITE=/etc/nginx/sites-available/avm
PHPV=$(ls /etc/php | sort -V | tail -1)
section() { echo; echo "== $*"; }

section "1. Disk - use the whole disk"
VG=ubuntu-vg; LV=/dev/ubuntu-vg/ubuntu-lv
FREE_MB=$(vgs --noheadings --nosuffix --units m -o vg_free "$VG" 2>/dev/null | tr -d ' ' | cut -d. -f1 || echo 0)
if [ "${FREE_MB:-0}" -gt 1024 ]; then lvextend -r -l +100%FREE "$LV" | tail -2; else echo "volume group has no spare space"; fi
df -h / | tail -1

section "2. Security updates, automatic updates, brute-force protection"
apt-get update -qq
apt-get -o Dpkg::Options::=--force-confdef -o Dpkg::Options::=--force-confold upgrade -y -qq >/dev/null
apt-get install -y -qq fail2ban unattended-upgrades logrotate >/dev/null
cat > /etc/apt/apt.conf.d/20auto-upgrades <<'EOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
EOF
cat > /etc/fail2ban/jail.d/avm.local <<'EOF'
[DEFAULT]
# the office network is never banned (so nobody gets locked out); everything else is
ignoreip = 127.0.0.1/8 ::1 192.168.0.0/16
bantime = 1h
findtime = 10m
maxretry = 5
[sshd]
enabled = true
EOF
systemctl enable --now fail2ban >/dev/null 2>&1; systemctl restart fail2ban
echo "fail2ban: $(systemctl is-active fail2ban)  jails: $(fail2ban-client status 2>/dev/null | grep 'Jail list' | sed 's/.*://' | xargs)"

section "3. PHP production settings"
cat > /etc/php/$PHPV/fpm/conf.d/99-avm.ini <<'EOF'
upload_max_filesize = 50M
post_max_size = 55M
memory_limit = 256M
expose_php = Off
display_errors = Off
log_errors = On
date.timezone = Asia/Kolkata
session.use_strict_mode = 1
session.cookie_httponly = 1
session.cookie_samesite = Lax
EOF
systemctl restart php${PHPV}-fpm; echo "php-fpm: $(systemctl is-active php${PHPV}-fpm)"

section "4. nginx: hide version, security headers, login rate limit"
cp "$SITE" /root/avm.nginx.pre-hardening.bak
cp /etc/nginx/nginx.conf /root/nginx.conf.pre-hardening.bak
sed -i -E 's/^([[:space:]]*)#?[[:space:]]*server_tokens[[:space:]]+[a-z]+;.*/\1server_tokens off;/' /etc/nginx/nginx.conf
grep -q "server_tokens off" /etc/nginx/nginx.conf || sed -i '0,/http {/s//http {\n\tserver_tokens off;/' /etc/nginx/nginx.conf
cat > /etc/nginx/conf.d/avm-hardening.conf <<'EOF'
# login brute-force limit: ~12 attempts a minute per visitor, small burst allowed
limit_req_zone $binary_remote_addr zone=avm_login:10m rate=12r/m;
limit_req_status 429;
EOF
cat > /etc/nginx/snippets/avm-security-headers.conf <<'EOF'
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
EOF
python3 - "$SITE" <<'PYEOF'
import re, sys
p = sys.argv[1]; s = open(p).read()
INC = "include /etc/nginx/snippets/avm-security-headers.conf;"
sock = re.search(r"fastcgi_pass (unix:[^;]+);", s).group(1)
if "avm-security-headers" not in s:
    # every location that sets its own add_header must repeat the headers (nginx does not inherit them otherwise)
    s = re.sub(r'(add_header Cache-Control "[^"]*";)', r'\1\n        ' + INC, s)
    # one include per server block, right after server_name
    s = re.sub(r'(\n\s*server_name [^;]+;)', r'\1\n    ' + INC, s)
if "avm_login" not in s:
    login = ("    location = /backend/api/admin/login.php {\n        limit_req zone=avm_login burst=6 nodelay;\n"
             "        root /var/www/avm;\n        include snippets/fastcgi-php.conf;\n        fastcgi_pass " + sock + ";\n"
             "        fastcgi_read_timeout 120s;\n    }\n")
    s = s.replace("    location ~ ^/backend/.*\\.php$ {", login + "    location ~ ^/backend/.*\\.php$ {")
open(p, "w").write(s)
PYEOF
if nginx -t 2>&1; then systemctl reload nginx; echo "nginx reloaded"; else
  cp /root/avm.nginx.pre-hardening.bak "$SITE"; cp /root/nginx.conf.pre-hardening.bak /etc/nginx/nginx.conf
  rm -f /etc/nginx/conf.d/avm-hardening.conf; nginx -t && systemctl reload nginx
  echo "nginx test FAILED - everything restored to the previous state"; exit 1
fi

section "5. Backups (nightly database, weekly uploads, kept 14 / 28 days)"
install -d -m 750 /var/backups/avm
cat > /usr/local/bin/avm-backup <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
D=/var/backups/avm; TS=$(date +%Y%m%d_%H%M)
mysqldump --single-transaction --default-character-set=utf8mb4 avm_website | gzip -9 > "$D/db_$TS.sql.gz"
if [ "$(date +%u)" = 7 ] || [ "${1:-}" = "--with-uploads" ]; then tar -C /var/www/avm/backend -czf "$D/uploads_$TS.tar.gz" uploads; fi
find "$D" -name 'db_*.sql.gz' -mtime +14 -delete
find "$D" -name 'uploads_*.tar.gz' -mtime +28 -delete
echo "$(date -Is) backup ok: $(ls -1 "$D" | wc -l) files, $(du -sh "$D" | cut -f1)" >> /var/log/avm-backup.log
EOF
chmod 750 /usr/local/bin/avm-backup
echo '30 2 * * * root /usr/local/bin/avm-backup' > /etc/cron.d/avm-backup
/usr/local/bin/avm-backup --with-uploads && tail -1 /var/log/avm-backup.log

section "6. Health check every 5 minutes (restarts a stopped service, logs problems)"
cat > /usr/local/bin/avm-healthcheck <<EOF
#!/usr/bin/env bash
LOG=/var/log/avm-health.log; bad=0
for p in / /backend/api/public/settings.php /backend/api/public/gallery.php "/backend/api/public/pages.php?slug=about-us"; do
  c=\$(curl -s -o /dev/null -m 10 -w '%{http_code}' -H 'Host: avm.pixelatenest.com' "http://127.0.0.1\$p")
  [ "\$c" = 200 ] || { echo "\$(date -Is) FAIL \$p -> \$c" >> \$LOG; bad=1; }
done
if [ \$bad = 1 ]; then
  for s in mysql php${PHPV}-fpm nginx; do systemctl is-active --quiet \$s || { systemctl restart \$s; echo "\$(date -Is) restarted \$s" >> \$LOG; }; done
fi
u=\$(df --output=pcent / | tail -1 | tr -dc 0-9); [ "\$u" -lt 90 ] || echo "\$(date -Is) WARN disk \${u}% full" >> \$LOG
EOF
chmod 750 /usr/local/bin/avm-healthcheck
echo '*/5 * * * * root /usr/local/bin/avm-healthcheck' > /etc/cron.d/avm-healthcheck
cat > /etc/logrotate.d/avm <<'EOF'
/var/log/avm-backup.log /var/log/avm-health.log {
    weekly
    rotate 8
    compress
    missingok
    notifempty
}
EOF
/usr/local/bin/avm-healthcheck && echo "health check ran: $( [ -s /var/log/avm-health.log ] && tail -1 /var/log/avm-health.log || echo 'no problems logged')"

section "summary"
echo "disk:      $(df -h / | tail -1 | awk '{print $4" free of "$2}')"
echo "services:  nginx=$(systemctl is-active nginx) mysql=$(systemctl is-active mysql) php=$(systemctl is-active php${PHPV}-fpm) fail2ban=$(systemctl is-active fail2ban) ufw=$(ufw status | head -1 | cut -d' ' -f2)"
echo "updates:   $(apt list --upgradable 2>/dev/null | grep -c upgradable) pending;  reboot required: $([ -f /var/run/reboot-required ] && echo YES || echo no)"
echo "backups:   $(ls /var/backups/avm | wc -l) file(s) in /var/backups/avm"
