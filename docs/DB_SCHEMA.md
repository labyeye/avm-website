# Database Schema

Database: `avm_website` (utf8mb4, InnoDB). Full DDL + seed data: [`schema.sql`](../schema.sql).

## admin_users
| Column | Type | Notes |
|---|---|---|
| id | INT UNSIGNED PK AI | |
| username | VARCHAR(100) UNIQUE | |
| password_hash | VARCHAR(255) | bcrypt via `password_hash()` |
| created_at | TIMESTAMP | default now |

## admissions
| Column | Type | Notes |
|---|---|---|
| id | INT UNSIGNED PK AI | |
| student_name, parent_name | VARCHAR(150) | |
| email | VARCHAR(150) | |
| phone | VARCHAR(30) | |
| dob | DATE | `YYYY-MM-DD` |
| class_applied | VARCHAR(30) | Nursery / KG / Class 1–12 |
| submitted_at | TIMESTAMP | default now |

## gallery
| Column | Type | Notes |
|---|---|---|
| id | INT UNSIGNED PK AI | |
| image_url | VARCHAR(500) | |
| caption | VARCHAR(255) | |
| sort_order | INT DEFAULT 0 | ascending |
| is_active | TINYINT(1) DEFAULT 1 | public only shows 1 |

## testimonials
| Column | Type | Notes |
|---|---|---|
| id | INT UNSIGNED PK AI | |
| title | VARCHAR(255) | |
| video_url | VARCHAR(500) | YouTube URL (watch / youtu.be / embed) |
| thumbnail_url | VARCHAR(500) | |
| is_active | TINYINT(1) DEFAULT 1 | |

## notices
| Column | Type | Notes |
|---|---|---|
| id | INT UNSIGNED PK AI | |
| title | VARCHAR(255) | |
| content | TEXT | |
| published_at | DATE | |
| is_active | TINYINT(1) DEFAULT 1 | |

## site_settings
| Column | Type | Notes |
|---|---|---|
| id | INT UNSIGNED PK AI | |
| `key` | VARCHAR(100) UNIQUE | reserved word — always backtick |
| `value` | TEXT | |

Allowed keys: `hero_heading, about_text, contact_email, contact_phone, address, facebook_url, instagram_url, youtube_url`.

## Seed data
- **admin_users**: `admin` / `admin123` (bcrypt hash precomputed; **change after first login in production**).
- **site_settings**: all 8 keys above with sensible defaults.
- **gallery**: 8 placehold.co images; **testimonials**: 3 placeholder cards; **notices**: 2 sample notices — so the public site is populated out of the box.

## Dynamic pages
- **pages** — `slug` (unique), `title`, `subtitle`, `banner_url`, `body`, `layout`, `is_active`, `updated_at`. Seeded: about-us, academics, governing-body, sports-and-activities, downloads, pastoral, public-disclosure, contact-us, alumni, admission, plus `home-why` (Home "Why AVM" block).
- **page_items** — `page_slug`, `title`, `subtitle`, `description`, `image_url`, `file_url`, `sort_order`, `is_active`. Cards / people / documents shown on a page.
- **contact_messages** — `name, email, phone, subject, message, submitted_at`.
- New `site_settings` keys: `hero_image, about_heading, about_subheading, gallery_heading, gallery_subheading, admission_heading, admission_subheading, testimonials_heading, testimonials_subheading`.

Existing databases: run `mysql -u root -p < backend/migrations/001_pages.sql` (safe to re-run).
