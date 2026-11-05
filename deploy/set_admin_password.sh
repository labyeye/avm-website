#!/usr/bin/env bash
# Set the dashboard admin password. Run ON THE VM:   sudo bash ~/avm-website/deploy/set_admin_password.sh
# It asks for the password (nothing is shown, nothing lands in shell history), stores only a bcrypt hash,
# then proves the new password works through the real login API.
set -euo pipefail
[ "$(id -u)" = 0 ] || { echo "run with sudo"; exit 1; }
NAME="${1:-admin}"
[[ "$NAME" =~ ^[A-Za-z0-9_-]+$ ]] || { echo "username may only contain letters, digits, _ and -"; exit 1; }

read -rsp "New password for '$NAME' (at least 12 characters): " P1; echo
read -rsp "Type it again: " P2; echo
[ "$P1" = "$P2" ] || { echo "The two entries differ. Nothing was changed."; exit 1; }
[ "${#P1}" -ge 12 ] || { echo "Too short (minimum 12). Nothing was changed."; exit 1; }

HASH=$(printf '%s' "$P1" | php -r 'echo password_hash(stream_get_contents(STDIN), PASSWORD_BCRYPT);')
printf "UPDATE admin_users SET password_hash='%s' WHERE username='%s';" "$HASH" "$NAME" | mysql avm_website
ROWS=$(mysql -N avm_website -e "SELECT COUNT(*) FROM admin_users WHERE username='$NAME' AND password_hash='$HASH'")
[ "$ROWS" = 1 ] || { echo "No user called '$NAME' was updated."; exit 1; }

sleep 6   # the login endpoint is rate-limited; give it a moment
JSON=$(printf '%s' "$P1" | php -r 'echo json_encode(["username"=>$argv[1],"password"=>stream_get_contents(STDIN)]);' -- "$NAME")
if curl -s -H 'Host: avm.pixelatenest.com' -H 'Content-Type: application/json' -d "$JSON" http://127.0.0.1/backend/api/admin/login.php | grep -q '"success":true'; then
  echo "Done. '$NAME' can now log in with the new password."
else
  echo "Password stored, but the test login did not succeed - check the password and try logging in from the website."
fi
unset P1 P2 JSON HASH
