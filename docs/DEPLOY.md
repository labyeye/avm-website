# Deploying — show the site to a client

The site has two parts and they live in different places:

| Part | Where | Why |
|---|---|---|
| React site (`frontend/`) | **Vercel** | Static files; Vercel is perfect for this |
| PHP API + MySQL (`backend/`) | **PHP hosting** (cPanel / Hostinger / any shared host, or a VPS) | Vercel cannot run PHP or MySQL |

Visitors only ever talk to the Vercel address. `frontend/vercel.json` forwards `/backend/*` to your PHP host behind the scenes, so there are no cross-site cookie or CORS problems.

## 1. Put the backend + database online
1. **Create a MySQL database** on the host (cPanel → MySQL Databases). Note host, name, user, password.
2. **Export your local data** (it contains your uploaded content):
   ```bash
   mysqldump -u root avm_website > avm.sql
   ```
   Import `avm.sql` into the new database (phpMyAdmin → Import). For a fresh start, import `schema.sql` instead.
3. **Upload the `backend/` folder** to the host so it is reachable at `https://YOUR-BACKEND-HOST/backend/...`
   (put it inside `public_html/` so the folder is called `backend`). Keep `backend/uploads/` — it holds your PDFs, videos and uploaded images.
4. **Create `backend/.env`** on the host:
   ```
   DB_HOST=localhost
   DB_NAME=your_db_name
   DB_USER=your_db_user
   DB_PASS=your_db_password
   APP_DEBUG=false
   ```
5. In PHP settings raise `upload_max_filesize` to `50M` and `post_max_size` to `55M` (cPanel → MultiPHP INI Editor).
6. Check it: open `https://YOUR-BACKEND-HOST/backend/api/public/settings.php` — you should see JSON.
7. **Change the admin password** (default `admin` / `admin123`):
   ```bash
   php -r 'echo password_hash("NEW-PASSWORD", PASSWORD_BCRYPT);'
   ```
   then `UPDATE admin_users SET password_hash='<hash>' WHERE username='admin';`

If your database still has absolute `http://localhost:8000/...` links from older uploads, run `scripts/make_urls_relative.sql` against it once.

## 2. Deploy the frontend on Vercel
1. Open `frontend/vercel.json` and replace `YOUR-BACKEND-HOST` with the real host (no trailing slash), e.g.
   `https://api.avmschool.in/backend/:path*` or `https://avmschool.in/backend/:path*`.
2. Deploy — either way works:
   - **Without Git (quickest):**
     ```bash
     npm i -g vercel
     cd frontend
     vercel          # first run: log in, accept the defaults (Vite is detected)
     vercel --prod   # gives the final https://<name>.vercel.app link
     ```
   - **With GitHub:** push the project, then on vercel.com → *Add New → Project*, import it, and set **Root Directory = `frontend`**. Framework: Vite. Build `npm run build`, output `dist`.
3. Do **not** set `VITE_API_BASE_URL` on Vercel (leave it empty). 
4. Send the client the `.vercel.app` link. Admin is at `/admin/login`.

Every time you change the code, run `vercel --prod` again (or push to GitHub).

## Notes
- Local development is unchanged: run `php -S localhost:8000` from the project root and `npm run dev` in `frontend/`. Vite now proxies `/backend` to PHP, exactly like Vercel does in production. **Restart `npm run dev` after pulling this change.**
- New uploads are stored as `/backend/uploads/<file>` (site-relative), so the database can move between hosts untouched. Copy `backend/uploads/` along with the database.
- Large files (videos up to 50 MB) pass through Vercel's proxy. If a big upload fails there, log in to the admin at the backend host directly for that upload.
- `public/logo.png` is 8 MB. Shrink it (e.g. 512 px wide) before the client demo — it loads on every page as the tab icon.
- Quick demo without hosting: keep `php -S localhost:8000` running and expose it with a tunnel (`cloudflared tunnel --url http://localhost:8000`), then use the printed `https://….trycloudflare.com` address as `YOUR-BACKEND-HOST`. Your laptop must stay on, and the address changes each time, so this is for a short demo only.
