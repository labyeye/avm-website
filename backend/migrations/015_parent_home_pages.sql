-- Parent-focused additions: Age Criteria + Safety/Health/Counselling pages, admissions banner. Safe to re-run.
USE avm_website;
INSERT INTO pages (slug, title, subtitle, banner_url, image_url, file_label, body, layout) VALUES
('admission/age-criteria','Age Criteria','Minimum age for each class','https://placehold.co/1920x500/16346b/white?text=Age+Criteria','','','The class-wise age criteria for the coming session will be published here. Please contact the school office for the latest details.','text'),
('pastoral/safety-health-counselling','Safety, Health & Counselling','Your child''s wellbeing comes first','https://placehold.co/1920x500/16346b/white?text=Safety+%26+Wellbeing','','','This page will describe campus safety, medical care and counselling support at AVM. Please contact the school office for details.','text')
ON DUPLICATE KEY UPDATE slug = slug;
INSERT INTO site_settings (`key`, `value`) VALUES
('admission_banner','Admissions open — apply online or enquire today'),
('stat1_value','1966'),('stat1_label','Established'),
('stat2_value','CBSE'),('stat2_label','Affiliated')
ON DUPLICATE KEY UPDATE `key` = `key`;
