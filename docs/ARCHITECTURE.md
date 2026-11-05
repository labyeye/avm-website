# Architecture

```
/avm-website
  /docs                 documentation
  schema.sql  .env.example
  /frontend             Vite + React (public site + /admin)
    /public/assets      logo, hero, gallery... (placeholders → real files later)
    /src
      main.jsx App.jsx
      /pages/public     Home.jsx
      /pages/admin      Login Dashboard Admissions Gallery Testimonials Notices Settings
      /components/public  Navbar NoticeTicker Hero About WhyAVM Gallery AdmissionForm Testimonials Footer
      /components/admin   Sidebar AdminNavbar StatCard DataTable Modal Toast ProtectedRoute
      /context          AuthContext.jsx (+ ToastContext in Toast.jsx)
      /api              axiosInstance.js public.js admin.js
      /styles           global.css
  /backend              plain PHP REST API
    /api/public  /api/admin
    /config  db.php session.php cors.php
    /middleware auth.php
    /uploads  .htaccess
```

## Decisions
- **One Vite app**, `/admin/*` routes lazy-separated from the public site; React Router DOM.
- **Tailwind CSS v3** used consistently (no CSS Modules). Navy `#0a1628`/`#1a3a7a`, gold `#c9a54a`.
- **PHP, no framework**: PDO + prepared statements only. `config/cors.php` (CORS + JSON headers + OPTIONS) is required by every endpoint through `db.php`/`session.php`; `middleware/auth.php` guards admin routes.
- **Auth**: PHP session cookie + bcrypt. The React `AuthContext` mirrors state in localStorage for refresh, and re-validates against the server (`stats.php`) so an expired session logs the user out; an axios 401 interceptor clears state.
- **Assets**: referenced as `/assets/...` from `frontend/public/assets`, so real files drop in without code changes. `onError` fallbacks use placehold.co.
- **Dev topology**: `php -S localhost:8000` from the project root serves `/backend/api/...`; Vite runs on 5173; CORS allows that origin with credentials.
