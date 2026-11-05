-- Adds an optional inline image/logo and an optional downloadable file to every CMS page.
-- Safe to re-run. Usage: mysql -u root -p < backend/migrations/004_page_media.sql
USE avm_website;

SET @s := IF((SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'pages' AND column_name = 'image_url') = 0,
  'ALTER TABLE pages ADD COLUMN image_url VARCHAR(500) DEFAULT '''' AFTER banner_url', 'SELECT 1');
PREPARE st FROM @s; EXECUTE st; DEALLOCATE PREPARE st;

SET @s := IF((SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'pages' AND column_name = 'file_url') = 0,
  'ALTER TABLE pages ADD COLUMN file_url VARCHAR(500) DEFAULT '''' AFTER image_url', 'SELECT 1');
PREPARE st FROM @s; EXECUTE st; DEALLOCATE PREPARE st;

SET @s := IF((SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'pages' AND column_name = 'file_label') = 0,
  'ALTER TABLE pages ADD COLUMN file_label VARCHAR(150) DEFAULT '''' AFTER file_url', 'SELECT 1');
PREPARE st FROM @s; EXECUTE st; DEALLOCATE PREPARE st;
