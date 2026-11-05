#!/usr/bin/env bash
# Update the live AVM site FROM THE VM, after you pushed to GitHub.   Run on the VM:   ~/avm-website/deploy/update_on_vm.sh
#   1. git pull            2. backend: copy PHP files (no build, no restart needed)
#   3. frontend: npm ci + build, copy to the web folder          4. health checks
# Never touches: backend/.env (DB password), backend/uploads (photos/PDFs/videos), the database.
# (Use scripts/deploy_vm.sh only from your Mac - it is the other direction.)
set -euo pipefail
REPO="${REPO:-$HOME/avm-website}"
LIVE=/var/www/avm

command -v node >/dev/null || { echo "Node is not installed on this VM. Install it once:"; echo "  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt -y install nodejs"; exit 1; }
cd "$REPO"

echo "== 1/4 git pull"
BRANCH="$(git branch --show-current)"
git pull --ff-only origin "$BRANCH"   # explicit remote+branch: works even if no upstream is configured
git log --oneline -1

echo "== 2/4 backend (PHP) -> $LIVE/backend"
rsync -a --exclude '.env' --exclude 'uploads' --exclude '.DS_Store' backend/ "$LIVE/backend/"
echo "   copied. (.env and uploads/ left alone)"
ls backend/migrations 2>/dev/null | tail -3 | sed 's/^/   migrations in repo (apply new ones by hand if this commit adds any): /'

echo "== 3/4 frontend build -> $LIVE/site"
( cd frontend && npm ci --no-audit --no-fund && npm run build )
rsync -a --delete frontend/dist/ "$LIVE/site/"

echo "== 4/4 checks"
chk() { printf "   %-46s -> " "$1"; curl -s -o /dev/null -w "%{http_code}\n" -H "Host: avm.pixelatenest.com" "http://127.0.0.1$1"; }
chk /; chk /about-us/vision-mission; chk /backend/api/public/settings.php; chk /backend/api/public/gallery.php
if sudo -n true 2>/dev/null; then sudo systemctl reload nginx && echo "   nginx reloaded"; else echo "   (nginx reload skipped - not needed for a normal update)"; fi
echo "done."
