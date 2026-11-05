-- Dynamic pages migration. Safe to re-run. Usage: mysql -u root -p < backend/migrations/001_pages.sql
USE avm_website;

CREATE TABLE IF NOT EXISTS pages (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255) DEFAULT '',
  banner_url VARCHAR(500) DEFAULT '',
  image_url VARCHAR(500) DEFAULT '',
  file_url VARCHAR(500) DEFAULT '',
  file_label VARCHAR(150) DEFAULT '',
  body MEDIUMTEXT,
  layout VARCHAR(30) NOT NULL DEFAULT 'text',   -- text | cards | members | downloads | contact | admission | items
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS page_items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  page_slug VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255) DEFAULT '',
  description TEXT,
  image_url VARCHAR(500) DEFAULT '',
  file_url VARCHAR(500) DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  INDEX idx_slug (page_slug)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS contact_messages (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(30) DEFAULT '',
  subject VARCHAR(255) DEFAULT '',
  message TEXT NOT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO site_settings (`key`, `value`) VALUES
  ('hero_image', ''),
  ('gallery_columns', '4'),
  ('gallery_scroll', 'true'),
  ('gallery_height', 'medium'),
  ('about_heading', 'Welcome to Adarsh Vidya Mandir'),
  ('about_subheading', 'A Legacy of Excellence in Muzaffarpur, Bihar'),
  ('gallery_heading', 'Life at AVM'),
  ('gallery_subheading', 'Where learning, friendship, and growth come together.'),
  ('admission_heading', 'Admission Enquiry'),
  ('admission_subheading', 'Begin Your Child''s Journey to Excellence'),
  ('testimonials_heading', 'What Parents Say About AVM'),
  ('testimonials_subheading', 'Hear from parents who trust AVM in shaping their children''s future.')
ON DUPLICATE KEY UPDATE `key` = `key`;

INSERT INTO pages (slug, title, subtitle, banner_url, body, layout) VALUES
 ('home-why', 'Why AVM?', 'More Than Education — A Foundation for Life', '', '', 'items'),
 ('about-us', 'About Us', 'A Legacy of Excellence Since 1966', 'https://placehold.co/1920x500/16346b/white?text=About+Us',
  'Adarsh Vidya Mandir (AVM), Muzaffarpur, was established in 1966 with a simple belief: education should build both knowledge and character.\n\n## Our Vision\n\nTo nurture confident, compassionate and capable citizens who lead with integrity.\n\n## Our Mission\n\nTo provide a balanced, values-based education that develops the mind, body and spirit of every child.\n\n## Our Motto\n\nविद्या ददाति विनयम् — Knowledge brings humility.', 'text'),
 ('academics', 'Academics', 'CBSE curriculum from Nursery to Class 12', 'https://placehold.co/1920x500/16346b/white?text=Academics',
  'AVM follows the CBSE curriculum with a strong focus on conceptual understanding, critical thinking and continuous assessment.', 'cards'),
 ('governing-body', 'Governing Body', 'The people guiding our institution', 'https://placehold.co/1920x500/16346b/white?text=Governing+Body',
  'Our governing body provides vision, oversight and support to the school community.', 'members'),
 ('sports-and-activities', 'Sports & Activities', 'Learning beyond the classroom', 'https://placehold.co/1920x500/16346b/white?text=Sports+%26+Activities',
  'From the playground to the stage, AVM students discover their talents through sports, arts and clubs.', 'cards'),
 ('downloads', 'Downloads', 'Forms, circulars and calendars', 'https://placehold.co/1920x500/16346b/white?text=Downloads',
  'Download important school documents below.', 'downloads'),
 ('pastoral', 'Pastoral Care', 'Caring for every child', 'https://placehold.co/1920x500/16346b/white?text=Pastoral',
  'Pastoral care at AVM ensures every student feels safe, heard and supported.', 'cards'),
 ('public-disclosure', 'Public Disclosure', 'Mandatory disclosure as per CBSE norms', 'https://placehold.co/1920x500/16346b/white?text=Public+Disclosure',
  'In keeping with CBSE guidelines, the following documents are made available to the public.', 'downloads'),
 ('contact-us', 'Contact Us', 'We would love to hear from you', 'https://placehold.co/1920x500/16346b/white?text=Contact+Us',
  'Reach out for admissions, general enquiries or feedback. Our team will get back to you shortly.', 'contact'),
 ('alumni', 'Alumni', 'Once an AVMite, always an AVMite', 'https://placehold.co/1920x500/16346b/white?text=Alumni',
  'Our alumni carry the AVM spirit across the world. Meet a few of them.', 'members'),
 ('admission', 'Admission', 'Begin your child''s journey', 'https://placehold.co/1920x500/16346b/white?text=Admission',
  '## Admission Process\n\nFill in the enquiry form below. Our admissions team will contact you with the next steps, including documents required and campus visit schedule.\n\nAdmissions are open from Nursery to Class 12.', 'admission')
ON DUPLICATE KEY UPDATE slug = slug;

-- Items seed (only when empty)
INSERT INTO page_items (page_slug, title, subtitle, description, image_url, file_url, sort_order)
SELECT * FROM (
 SELECT 'home-why' AS page_slug,'Academic Excellence' AS title,'Award' AS subtitle,'' AS description,'' AS image_url,'' AS file_url,1 AS sort_order UNION ALL
 SELECT 'home-why','Values-Based Education','Heart','','','',2 UNION ALL
 SELECT 'home-why','Holistic Development','Sparkles','','','',3 UNION ALL
 SELECT 'home-why','Focus on Discipline and Character','Shield','','','',4 UNION ALL
 SELECT 'home-why','Supportive Learning','Lightbulb','','','',5 UNION ALL
 SELECT 'home-why','Preparing Students','GraduationCap','','','',6 UNION ALL
 SELECT 'home-why','Lush Green Campus','Trees','','','',7 UNION ALL
 SELECT 'home-why','Academic Excellence','BookOpen','','','',8 UNION ALL
 SELECT 'home-why','Individual Growth','User','','','',9 UNION ALL
 SELECT 'home-why','Leadership and Teamwork','Users','','','',10 UNION ALL
 SELECT 'academics','Primary (Nursery – Class 5)','Foundation years','Play-based and activity-led learning that builds curiosity and basic skills.','https://placehold.co/600x400/16346b/white?text=Primary','',1 UNION ALL
 SELECT 'academics','Middle (Class 6 – 8)','Building concepts','Concept-driven teaching with projects, labs and language enrichment.','https://placehold.co/600x400/16346b/white?text=Middle','',2 UNION ALL
 SELECT 'academics','Secondary (Class 9 – 10)','Board preparation','Structured preparation for the CBSE Class 10 examination.','https://placehold.co/600x400/16346b/white?text=Secondary','',3 UNION ALL
 SELECT 'academics','Senior Secondary (Class 11 – 12)','Streams','Science, Commerce and Humanities with career guidance.','https://placehold.co/600x400/16346b/white?text=Senior+Secondary','',4 UNION ALL
 SELECT 'governing-body','Chairperson','Chairperson','Placeholder biography.','https://placehold.co/400x400/16346b/white?text=Photo','',1 UNION ALL
 SELECT 'governing-body','Secretary','Secretary','Placeholder biography.','https://placehold.co/400x400/16346b/white?text=Photo','',2 UNION ALL
 SELECT 'governing-body','Principal','Principal','Placeholder biography.','https://placehold.co/400x400/16346b/white?text=Photo','',3 UNION ALL
 SELECT 'sports-and-activities','Cricket','Sports','Coaching and inter-school tournaments.','https://placehold.co/600x400/16346b/white?text=Cricket','',1 UNION ALL
 SELECT 'sports-and-activities','Football','Sports','Regular training and house matches.','https://placehold.co/600x400/16346b/white?text=Football','',2 UNION ALL
 SELECT 'sports-and-activities','Music & Dance','Arts','Classical and contemporary performing arts.','https://placehold.co/600x400/16346b/white?text=Music+%26+Dance','',3 UNION ALL
 SELECT 'sports-and-activities','Science Club','Clubs','Hands-on experiments and exhibitions.','https://placehold.co/600x400/16346b/white?text=Science+Club','',4 UNION ALL
 SELECT 'downloads','Academic Calendar 2025-26','Calendar','','','#',1 UNION ALL
 SELECT 'downloads','Registration Form','Form','','','#',2 UNION ALL
 SELECT 'downloads','School Fee Details','Fees','','','#',3 UNION ALL
 SELECT 'pastoral','House System','Pastoral','Students are grouped into houses that foster teamwork and healthy competition.','https://placehold.co/600x400/16346b/white?text=House+System','',1 UNION ALL
 SELECT 'pastoral','Counselling','Wellbeing','Confidential counselling for students and parents.','https://placehold.co/600x400/16346b/white?text=Counselling','',2 UNION ALL
 SELECT 'pastoral','Student Council','Leadership','Elected student leaders who represent their peers.','https://placehold.co/600x400/16346b/white?text=Student+Council','',3 UNION ALL
 SELECT 'public-disclosure','CBSE Annual Mandatory Disclosure','Document','','','#',1 UNION ALL
 SELECT 'public-disclosure','Building Safety Certificate','Document','','','#',2 UNION ALL
 SELECT 'public-disclosure','Drinking Water and Sanitary','Document','','','#',3 UNION ALL
 SELECT 'public-disclosure','Water Test Report','Document','','','#',4 UNION ALL
 SELECT 'public-disclosure','Society Certificate','Document','','','#',5 UNION ALL
 SELECT 'public-disclosure','NOC','Document','','','#',6 UNION ALL
 SELECT 'public-disclosure','Land Certificate','Document','','','#',7 UNION ALL
 SELECT 'public-disclosure','Fire Safety','Document','','','#',8 UNION ALL
 SELECT 'public-disclosure','Posco','Document','','','#',9 UNION ALL
 SELECT 'public-disclosure','PTA','Document','','','#',10 UNION ALL
 SELECT 'public-disclosure','Academic Calendar','Document','','','#',11 UNION ALL
 SELECT 'public-disclosure','Recognition','Document','','','#',12 UNION ALL
 SELECT 'public-disclosure','SMC','Document','','','#',13 UNION ALL
 SELECT 'public-disclosure','Grievance Cell CBSE','Document','','','#',14 UNION ALL
 SELECT 'public-disclosure','Affiliation Certificate','Document','','','#',15 UNION ALL
 SELECT 'public-disclosure','Teaching Staffs','Document','','','#',16 UNION ALL
 SELECT 'public-disclosure','RTE','Document','','','#',17 UNION ALL
 SELECT 'public-disclosure','Fee Structure','Document','','','#',18 UNION ALL
 SELECT 'public-disclosure','Self Certificate','Document','','','#',19 UNION ALL
 SELECT 'public-disclosure','Campus Video','Video','','','#',20 UNION ALL
 SELECT 'alumni','Alumnus Name','Batch of 2005','"AVM shaped who I am today."','https://placehold.co/400x400/16346b/white?text=Alumni','',1 UNION ALL
 SELECT 'alumni','Alumna Name','Batch of 2010','"The values I learned here guide me every day."','https://placehold.co/400x400/16346b/white?text=Alumni','',2
) seed WHERE NOT EXISTS (SELECT 1 FROM page_items);
