# AVM website — production runbook

## Architecture
```
Internet -> router -> GATEWAY 192.168.1.192 (nginx; HTTPS certificates; proxies each site)
                        |  plain HTTP, real visitor IP in X-Real-IP
                        v
                   AVM VM 192.168.1.185  (Ubuntu, nginx + PHP-FPM 8.5 + MySQL)
   avm.pixelatenest.com          React site (/var/www/avm/site) + same-origin API (/backend/*)
   avm-backend.pixelatenest.com  PHP API + uploaded files (/var/www/avm/backend)
```
Code: GitHub `labyeye/avm-website` -> clone at `/home/avm/avm-website` on the VM. Live folders: `/var/www/avm/{site,backend}`.
Secrets: `/var/www/avm/backend/.env` (DB password; root:www-data, mode 640). Uploads: `/var/www/avm/backend/uploads` (never overwritten by deploys).

## Routine tasks
| Task | Command (on the VM unless noted) |
|---|---|
| Deploy a new commit | `~/avm-website/deploy/update_on_vm.sh` |
| Apply a new DB migration | `sudo mysqldump --single-transaction avm_website > ~/db-backups/pre_$(date +%F).sql && sudo mysql < backend/migrations/<file>.sql` |
| Change the admin password | `sudo bash ~/avm-website/deploy/set_admin_password.sh` |
| Backup now (DB + uploads) | `sudo /usr/local/bin/avm-backup --with-uploads` |
| Check health | `tail /var/log/avm-health.log` (empty = healthy), `sudo systemctl status nginx mysql php8.5-fpm` |
| Web / PHP errors | `sudo tail -50 /var/log/nginx/error.log` |
| Gateway: open the admin login to all devices | `deploy/gateway_open_admin.sh` (run on the gateway **after** the password change) |
| Gateway: renew certificates | automatic (certbot timer); check `sudo certbot renew --dry-run` on the gateway |

Rule: a commit that adds a file to `backend/migrations/` needs that migration applied **before** (or right after) `update_on_vm.sh`,
otherwise the new PHP code reads columns that do not exist yet and pages return a 500.

## What is already hardened (deploy/harden_vm.sh, re-runnable)
- Disk: root volume extended to the full 30 GB. `ufw` allows only SSH + web; MySQL listens on localhost only.
- nginx: version hidden, security headers (`nosniff`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`),
  login rate limit (~12 attempts/min per visitor, then HTTP 429), config/`.env`/migrations folders denied, no PHP execution in `uploads/`.
- PHP: errors never shown to visitors, version hidden, strict sessions, `httponly` cookies, timezone Asia/Kolkata.
- fail2ban (sshd, office network exempt), automatic security updates, NTP time sync, timezone IST.
- Backups: nightly DB dump 02:30 (kept 14 days) + weekly uploads archive (kept 28 days) in `/var/backups/avm`.
- Health check every 5 min (restarts a stopped service, logs failures and a disk-over-90% warning).

## Restore
- Database: `gunzip -c /var/backups/avm/db_<stamp>.sql.gz | sudo mysql avm_website`
- Uploads: `sudo tar -C /var/www/avm/backend -xzf /var/backups/avm/uploads_<stamp>.tar.gz && sudo chown -R www-data:www-data /var/www/avm/backend/uploads`
- Whole VM lost: new Ubuntu VM -> `deploy/remote_setup.sh` (phase1/phase2) from `scripts/deploy_vm.sh full` on a Mac, then restore the two files above.

## Handover items
Open security items (credentials, SSH keys, off-site backups) are tracked privately by the site owner and intentionally
**not** written in this public repository. See `deploy/set_admin_password.sh` and `deploy/gateway_open_admin.sh` for the tooling.
