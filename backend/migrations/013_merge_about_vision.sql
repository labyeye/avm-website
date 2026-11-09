-- Merge "Vision & Mission" into "About AVM" (one page). Safe to re-run.
USE avm_website;
UPDATE pages a
JOIN pages v ON v.slug = 'about-us/vision-mission'
SET a.body = CONCAT(a.body, '\n\n', v.body),
    a.subtitle = 'About, Vision & Mission'
WHERE a.slug = 'about-us/about-avm' AND a.body NOT LIKE '%## Our Vision%';
DELETE FROM page_items WHERE page_slug = 'about-us/vision-mission';
DELETE FROM pages WHERE slug = 'about-us/vision-mission';

-- Rename "Intelligent House" to "Intelligence House" (slug unchanged).
UPDATE pages SET title = 'Intelligence House' WHERE slug = 'pastoral/house-system/intelligent-house' AND title = 'Intelligent House';
UPDATE page_items SET title = 'Intelligence House' WHERE page_slug = 'pastoral/house-system' AND title = 'Intelligent House';
UPDATE page_items SET subtitle = 'Intelligence House' WHERE page_slug = 'pastoral/house-system/intelligent-house' AND subtitle = 'Intelligent House';
