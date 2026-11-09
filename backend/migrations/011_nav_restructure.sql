-- Nav restructure: "Sports & Events" (Events inside, Activities removed); "Management" page under About Us
-- (copied from Board of Governors; Governing Body pages are kept in the DB but hidden from the menu). Safe to re-run.
USE avm_website;

UPDATE pages SET title = 'Sports & Events' WHERE slug = 'sports-and-activities';
UPDATE pages SET is_active = 0 WHERE slug = 'sports-and-activities/activities';

INSERT INTO pages (slug, title, subtitle, banner_url, image_url, file_url, file_label, body, layout)
SELECT 'about-us/management', 'Management', 'Guiding the school''s vision', src.banner_url, src.image_url, src.file_url, src.file_label, src.body, 'members'
FROM pages src WHERE src.slug = 'governing-body/board-of-governors'
ON DUPLICATE KEY UPDATE slug = VALUES(slug);

INSERT INTO page_items (page_slug, title, subtitle, description, image_url, file_url, sort_order, is_active)
SELECT 'about-us/management', title, subtitle, description, image_url, file_url, sort_order, is_active
FROM page_items WHERE page_slug = 'governing-body/board-of-governors'
AND NOT EXISTS (SELECT 1 FROM (SELECT 1 FROM page_items WHERE page_slug = 'about-us/management') x);
