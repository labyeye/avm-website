-- Management -> Working Committee; Pastoral -> House System. Safe to re-run.
USE avm_website;
UPDATE pages SET slug = 'about-us/working-committee', title = 'Working Committee' WHERE slug = 'about-us/management';
UPDATE page_items SET page_slug = 'about-us/working-committee' WHERE page_slug = 'about-us/management';
UPDATE pages SET title = 'House System' WHERE slug = 'pastoral';
