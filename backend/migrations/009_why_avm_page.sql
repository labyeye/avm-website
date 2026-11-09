-- "Why AVM" becomes a page under About Us (content still edited at Admin → Home Page → Why AVM). Safe to re-run.
USE avm_website;
INSERT INTO pages (slug, title, subtitle, banner_url, image_url, file_label, body, layout) VALUES
('about-us/why-avm', 'Why AVM?', 'More Than Education — A Foundation for Life', 'https://placehold.co/1920x500/16346b/white?text=Why+AVM', '', '', '', 'why-avm')
ON DUPLICATE KEY UPDATE slug = slug;
