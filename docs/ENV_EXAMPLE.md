# Environment Variables

Template file: [`.env.example`](../.env.example) at project root.

## Backend — `backend/.env`
Loaded by `backend/config/db.php` (tiny built-in parser, no Composer needed).

| Variable | Example | Description |
|---|---|---|
| `DB_HOST` | `127.0.0.1` | MySQL host |
| `DB_PORT` | `3306` | MySQL port |
| `DB_NAME` | `avm_website` | Database name (created by `schema.sql`) |
| `DB_USER` | `root` | MySQL user |
| `DB_PASS` | `secret` | MySQL password (may be empty locally) |
| `CORS_ORIGIN` | `http://localhost:5173` | Allowed origin for the React app. Must be exact (credentials are enabled, so `*` is invalid) |
| `SESSION_NAME` | `AVMSESSID` | PHP session cookie name |

If `backend/.env` is absent, the defaults above are used.

## Frontend — `frontend/.env`
| Variable | Example | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8000` | Origin serving `/backend/api/...`. Used by `axiosInstance.js` |
