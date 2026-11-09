-- Notice board: each notice can carry a link (YouTube etc.) and an image. Safe to re-run.
USE avm_website;
SET @s := IF((SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'notices' AND column_name = 'link_url') = 0,
  'ALTER TABLE notices ADD COLUMN link_url VARCHAR(500) DEFAULT '''', ADD COLUMN image_url VARCHAR(500) DEFAULT ''''', 'SELECT 1');
PREPARE st FROM @s; EXECUTE st; DEALLOCATE PREPARE st;
