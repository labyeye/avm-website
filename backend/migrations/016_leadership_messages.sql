-- Student Leadership page: Head Girl + Vice Captain messages and a team photo (In-charge message already exists). Safe to re-run.
USE avm_website;
SET @s := IF((SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'pages' AND column_name = 'headgirl_name') = 0,
  'ALTER TABLE pages ADD COLUMN headgirl_name VARCHAR(150) DEFAULT '''', ADD COLUMN headgirl_photo_url VARCHAR(500) DEFAULT '''', ADD COLUMN headgirl_message TEXT, ADD COLUMN vice_name VARCHAR(150) DEFAULT '''', ADD COLUMN vice_photo_url VARCHAR(500) DEFAULT '''', ADD COLUMN vice_message TEXT, ADD COLUMN team_photo_url VARCHAR(500) DEFAULT ''''', 'SELECT 1');
PREPARE st FROM @s; EXECUTE st; DEALLOCATE PREPARE st;
