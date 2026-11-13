-- The school has no Senior Secondary (Classes 11-12): remove its card from the Curriculum page. Safe to re-run.
USE avm_website;
DELETE FROM page_items WHERE page_slug = 'academics/curriculum' AND title = 'Senior Secondary';
