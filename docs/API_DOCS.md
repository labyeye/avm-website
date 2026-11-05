# API Documentation

Base URL (dev): `http://localhost:8000`. All responses are JSON:

```json
{ "success": true, "data": ... }
{ "success": false, "message": "..." }
```
Admin endpoints use the PHP session cookie (send with `withCredentials: true`) and return **401** `{success:false,message:"Unauthorized"}` when not logged in. Validation errors return **422**, unknown methods **405**, missing ids **404**.

## Public

| Method | URL | Body | `data` |
|---|---|---|---|
| GET | `/backend/api/public/gallery.php` | – | `[{id,image_url,caption,sort_order}]` active, sorted by `sort_order` |
| GET | `/backend/api/public/testimonials.php` | – | `[{id,title,video_url,thumbnail_url}]` active |
| GET | `/backend/api/public/notices.php` | – | `[{id,title,content,published_at}]` active, newest first |
| GET | `/backend/api/public/settings.php` | – | `{hero_heading:"...", about_text:"...", ...}` |
| POST | `/backend/api/public/admissions.php` | `{student_name,parent_name,email,phone,dob,class_applied}` | `{id}` (201) |

## Admin

| Method | URL | Request | `data` |
|---|---|---|---|
| POST | `/backend/api/admin/login.php` | `{username,password}` | `{id,username}`; 401 on bad credentials |
| GET | `/backend/api/admin/logout.php` | – | `null` |
| GET | `/backend/api/admin/stats.php` | – | `{total_admissions,active_gallery,active_testimonials,published_notices,recent_admissions:[...5]}` |
| GET | `/backend/api/admin/admissions.php` | – | all admissions, newest first |
| DELETE | `/backend/api/admin/admissions.php?id=N` | – | `null` |
| GET | `/backend/api/admin/gallery.php` | – | all items (incl. inactive) |
| POST | `/backend/api/admin/gallery.php` | `{image_url,caption,sort_order,is_active}` | created row (201) |
| PUT | `/backend/api/admin/gallery.php?id=N` | same fields (partial OK, e.g. `{is_active:0}`) | updated row |
| DELETE | `/backend/api/admin/gallery.php?id=N` | – | `null` |
| GET/POST/PUT/DELETE | `/backend/api/admin/testimonials.php` | `{title,video_url,thumbnail_url,is_active}` | same pattern as gallery |
| GET/POST/PUT/DELETE | `/backend/api/admin/notices.php` | `{title,content,published_at,is_active}` | same pattern as gallery |
| GET | `/backend/api/admin/settings.php` | – | `{key:value,...}` |
| PUT | `/backend/api/admin/settings.php` | `{hero_heading,about_text,...}` (allowed keys only) | updated settings object |

`id` may be passed in the query string or in the JSON body for PUT/DELETE.

## Dynamic pages (CMS)

| Method | URL | Notes |
|---|---|---|
| GET | `/backend/api/public/pages.php?slug=about-us` | `{slug,title,subtitle,banner_url,body,layout,items:[{id,title,subtitle,description,image_url,file_url}]}`; 404 if missing/unpublished |
| POST | `/backend/api/public/contact.php` | `{name,email,phone?,subject?,message}` → `{id}` |
| GET | `/backend/api/admin/pages.php` | list pages (excludes `home-*`) |
| GET/PUT | `/backend/api/admin/pages.php?slug=` | read / update `title,subtitle,banner_url,body,is_active` |
| GET | `/backend/api/admin/page_items.php?page_slug=` | items of a page (incl. hidden) |
| POST/PUT/DELETE | `/backend/api/admin/page_items.php[?id=]` | `{page_slug,title,subtitle,description,image_url,file_url,sort_order,is_active}` |
| GET/DELETE | `/backend/api/admin/contact_messages.php[?id=]` | contact form submissions |

Page `layout` values: `text`, `cards`, `members`, `downloads`, `contact`, `admission`, `items` (Home "Why AVM"). Body text: blank-line paragraphs, `## ` for headings.
