# Adarsh Vidya Mandir (AVM) Website

React (Vite) + Tailwind frontend, plain PHP REST API, MySQL.

## Prerequisites
Node 18+, PHP 8.0+ (with `pdo_mysql`), MySQL 5.7+/8 or MariaDB.

## 1. Database
```bash
mysql -u root -p < schema.sql
```
Creates `avm_website` with tables and seed data (admin `admin` / `admin123`).

## 2. Backend
```bash
cp .env.example backend/.env      # edit DB_USER / DB_PASS
php -S localhost:8000             # run from the PROJECT ROOT
```
Test: <http://localhost:8000/backend/api/public/settings.php>

## 3. Frontend
```bash
cd frontend
cp ../.env.example .env           # keep only the VITE_ line if you like
npm install
npm run dev                       # http://localhost:5173
```
- Public site: `/`
- Admin: `/admin/login` (admin / admin123 — change it!)

## Assets
Drop real files into `frontend/public/assets/` using the same names (`logo.png`, `hero-bg.jpg`, `gallery-1.jpg`…`gallery-8.jpg`, `admission-form-bg.jpg`, `testimonial-1-thumb.jpg`…, `favicon.ico`). No code changes needed; missing files fall back to placehold.co.

## Deploying
See [docs/DEPLOY.md](docs/DEPLOY.md) — React site on Vercel, PHP + MySQL on any PHP host.

## Production notes
Serve the built `frontend/dist` and `/backend` on the same host, set `CORS_ORIGIN`, use HTTPS, and change the default admin password.

See [docs/](docs/) for architecture, API, schema and component docs.

## Existing database? Run the migration
If you imported an earlier `schema.sql`, add the dynamic-pages tables with:
```bash
mysql -u root -p < backend/migrations/001_pages.sql
```

## Reset the database from scratch
Drops all data and recreates everything (tables + seed content) from `schema.sql`:
```bash
mysql -u root -p -e "DROP DATABASE IF EXISTS avm_website" && mysql -u root -p < schema.sql
```
# avm-website
