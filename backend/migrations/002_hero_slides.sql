-- Hero slider. Safe to re-run. Usage: mysql -u root -p < backend/migrations/002_hero_slides.sql
USE avm_website;

INSERT INTO pages (slug, title, subtitle, banner_url, body, layout)
SELECT 'home-hero', 'Hero Slider', '', '', '', 'slides'
WHERE NOT EXISTS (SELECT 1 FROM pages WHERE slug = 'home-hero');
