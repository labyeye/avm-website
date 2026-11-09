-- Public Disclosure pages (Holiday List, PTM Schedule, Transport, Book List); Forms & TC renamed. Safe to re-run.
USE avm_website;
INSERT INTO pages (slug, title, subtitle, banner_url, image_url, file_label, body, layout) VALUES
('downloads/holiday-list','Holiday List','School holidays for the session','https://placehold.co/1920x500/16346b/white?text=Holiday+List','','','The holiday list for the current session will be published here. Please check back or contact the school office.','downloads'),
('downloads/ptm-schedule','PTM Schedule','Parent-Teacher Meetings','https://placehold.co/1920x500/16346b/white?text=PTM+Schedule','','','Dates of parent-teacher meetings will be published here.','downloads'),
('downloads/transport','Transport & Bus Routes','Safe travel to and from school','https://placehold.co/1920x500/16346b/white?text=Transport','','','Bus routes, stops and the transport contact number will be published here.','downloads'),
('downloads/book-list','Book List','Class-wise books and stationery','https://placehold.co/1920x500/16346b/white?text=Book+List','','','The class-wise book list will be published here.','downloads')
ON DUPLICATE KEY UPDATE slug = slug;
UPDATE pages SET title = 'Forms & Transfer Certificate', subtitle = 'Request forms and certificates' WHERE slug = 'downloads/transfer-certificate' AND title = 'Transfer Certificate';
