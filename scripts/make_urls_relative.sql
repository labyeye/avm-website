-- Turns absolute upload links (http://localhost:8000/backend/uploads/x.jpg) into site-relative ones (/backend/uploads/x.jpg)
-- so the same database works locally, on a staging site and live. Safe to re-run.
-- Usage: mysql -u root -p avm_website < scripts/make_urls_relative.sql
UPDATE gallery SET image_url = REPLACE(image_url, 'http://localhost:8000', '') WHERE image_url LIKE 'http://localhost:8000/%';
UPDATE testimonials SET video_url = REPLACE(video_url, 'http://localhost:8000', '') WHERE video_url LIKE 'http://localhost:8000/%';
UPDATE testimonials SET thumbnail_url = REPLACE(thumbnail_url, 'http://localhost:8000', '') WHERE thumbnail_url LIKE 'http://localhost:8000/%';
UPDATE pages SET banner_url = REPLACE(banner_url, 'http://localhost:8000', '') WHERE banner_url LIKE 'http://localhost:8000/%';
UPDATE pages SET image_url = REPLACE(image_url, 'http://localhost:8000', '') WHERE image_url LIKE 'http://localhost:8000/%';
UPDATE pages SET file_url = REPLACE(file_url, 'http://localhost:8000', '') WHERE file_url LIKE 'http://localhost:8000/%';
UPDATE page_items SET image_url = REPLACE(image_url, 'http://localhost:8000', '') WHERE image_url LIKE 'http://localhost:8000/%';
UPDATE page_items SET file_url = REPLACE(file_url, 'http://localhost:8000', '') WHERE file_url LIKE 'http://localhost:8000/%';
UPDATE site_settings SET `value` = REPLACE(`value`, 'http://localhost:8000', '') WHERE `value` LIKE 'http://localhost:8000/%';
