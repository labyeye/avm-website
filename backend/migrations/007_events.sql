-- Events (poster + photos + videos + flip album). Safe to re-run.
-- Usage: mysql -u root -p < backend/migrations/007_events.sql
USE avm_website;

CREATE TABLE IF NOT EXISTS events (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  event_date DATE NOT NULL,
  location VARCHAR(255) DEFAULT '',
  description TEXT,
  poster_url VARCHAR(500) DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  INDEX idx_date (event_date)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS event_media (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  event_id INT UNSIGNED NOT NULL,
  type VARCHAR(10) NOT NULL DEFAULT 'photo',   -- photo | video
  url VARCHAR(500) NOT NULL,
  caption VARCHAR(255) DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  in_album TINYINT(1) NOT NULL DEFAULT 1,       -- photos only: shown in the flip album
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  INDEX idx_event (event_id)
) ENGINE=InnoDB;
