-- Sports / leadership / activities detail fields + YouTube live settings.
-- Safe to re-run. Usage: mysql -u root -p < backend/migrations/006_sports_live.sql
USE avm_website;

SET @s := IF((SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'page_items' AND column_name = 'captain') = 0,
  'ALTER TABLE page_items ADD COLUMN captain VARCHAR(150) DEFAULT '''' AFTER description', 'SELECT 1');
PREPARE st FROM @s; EXECUTE st; DEALLOCATE PREPARE st;

SET @s := IF((SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'page_items' AND column_name = 'incharge') = 0,
  'ALTER TABLE page_items ADD COLUMN incharge VARCHAR(150) DEFAULT '''' AFTER captain', 'SELECT 1');
PREPARE st FROM @s; EXECUTE st; DEALLOCATE PREPARE st;

SET @s := IF((SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'page_items' AND column_name = 'team_photo_url') = 0,
  'ALTER TABLE page_items ADD COLUMN team_photo_url VARCHAR(500) DEFAULT '''' AFTER incharge', 'SELECT 1');
PREPARE st FROM @s; EXECUTE st; DEALLOCATE PREPARE st;

SET @s := IF((SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'page_items' AND column_name = 'captain_photo_url') = 0,
  'ALTER TABLE page_items ADD COLUMN captain_photo_url VARCHAR(500) DEFAULT '''' AFTER incharge', 'SELECT 1');
PREPARE st FROM @s; EXECUTE st; DEALLOCATE PREPARE st;

SET @s := IF((SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'page_items' AND column_name = 'incharge_photo_url') = 0,
  'ALTER TABLE page_items ADD COLUMN incharge_photo_url VARCHAR(500) DEFAULT '''' AFTER captain_photo_url', 'SELECT 1');
PREPARE st FROM @s; EXECUTE st; DEALLOCATE PREPARE st;

UPDATE pages SET layout = 'sports'     WHERE slug IN ('sports-and-activities/sports-overview', 'sports-and-activities/activities');
UPDATE pages SET layout = 'leadership' WHERE slug = 'sports-and-activities/student-leadership';

INSERT INTO site_settings (`key`, `value`) VALUES ('live_active', 'false'), ('live_url', ''), ('live_title', 'AVM Live')
ON DUPLICATE KEY UPDATE `key` = `key`;
