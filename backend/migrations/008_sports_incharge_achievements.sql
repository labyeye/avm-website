-- Sports in-charge message (page level), captain message + masonry gallery (per sport), Achievements page.
-- Safe to re-run. Usage: mysql -u root -p < backend/migrations/008_sports_incharge_achievements.sql
USE avm_website;

SET @s := IF((SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'pages' AND column_name = 'incharge_name') = 0,
  'ALTER TABLE pages ADD COLUMN incharge_name VARCHAR(150) DEFAULT '''', ADD COLUMN incharge_role VARCHAR(150) DEFAULT '''', ADD COLUMN incharge_photo_url VARCHAR(500) DEFAULT '''', ADD COLUMN incharge_message TEXT', 'SELECT 1');
PREPARE st FROM @s; EXECUTE st; DEALLOCATE PREPARE st;

SET @s := IF((SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'page_items' AND column_name = 'captain_message') = 0,
  'ALTER TABLE page_items ADD COLUMN captain_message TEXT, ADD COLUMN gallery TEXT', 'SELECT 1');
PREPARE st FROM @s; EXECUTE st; DEALLOCATE PREPARE st;

INSERT INTO pages (slug, title, subtitle, banner_url, image_url, file_label, body, layout) VALUES
('sports-and-activities/achievements', 'Achievements', 'Pride of AVM', 'https://placehold.co/1920x500/16346b/white?text=Achievements', '', '',
 'Our students shine in sports, academics and the arts. Here are some of the moments we are proud of.', 'achievements')
ON DUPLICATE KEY UPDATE slug = slug;
