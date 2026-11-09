-- Adarsh Vidya Mandir (AVM) — MySQL schema + seed data
-- Import: mysql -u root -p < schema.sql

CREATE DATABASE IF NOT EXISTS avm_website CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE avm_website;

CREATE TABLE IF NOT EXISTS admin_users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS admissions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_name VARCHAR(150) NOT NULL,
  parent_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  dob DATE NOT NULL,
  class_applied VARCHAR(30) NOT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS gallery (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  image_url VARCHAR(500) NOT NULL,
  caption VARCHAR(255) DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS testimonials (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  video_url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS notices (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  published_at DATE NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS site_settings (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `key` VARCHAR(100) NOT NULL UNIQUE,
  `value` TEXT
) ENGINE=InnoDB;

-- ---------- Seed data ----------

-- username: admin / password: admin123 (bcrypt)
INSERT INTO admin_users (username, password_hash) VALUES
  ('admin', '$2b$10$zTa3wQsMrfqpskrx.c3LrOdFvUCUfKQLjtCyhAhckDFjENa3Dttlu')
ON DUPLICATE KEY UPDATE username = username;

INSERT INTO site_settings (`key`, `value`) VALUES
  ('hero_heading', 'Cultivating Leadership'),
  ('about_text', 'Located in Muzaffarpur, Bihar, Adarsh Vidya Mandir (AVM) is an educational institution committed to nurturing young minds through quality education, strong values, and all-round development. Established in 1966, the institution has a longstanding legacy of guiding students towards academic excellence while instilling discipline, integrity, and respect for Indian traditions.\n\nAt Adarsh Vidya Mandir, education extends beyond textbooks and classrooms. The school strives to create a supportive learning environment where students are encouraged to develop their knowledge, discover their talents, build confidence, and prepare for the opportunities and challenges of the future.\n\nThe school''s educational philosophy emphasizes the importance of knowledge, character, discipline, and responsibility. Through a balanced approach to learning, AVM aims to foster critical thinking, creativity, communication, and problem-solving skills while nurturing the moral and social values that shape responsible citizens.\n\nAdarsh Vidya Mandir recognizes the importance of holistic development in every student''s journey. Alongside academics, the institution encourages participation in co-curricular activities, sports, cultural programmes, and other learning experiences that help students develop teamwork, leadership, self-confidence, and a spirit of collaboration.\n\nGuided by its enduring motto, ''विद्या ददाति विनयम्'' — Knowledge brings humility — Adarsh Vidya Mandir remains committed to the belief that true education builds not only successful individuals but also compassionate, capable, and responsible members of society.'),
  ('contact_email', 'avm.smfp@gmail.com'),
  ('contact_phone', '+91 9135303555'),
  ('address', 'Sikanderpur, Gaushala Campus, Near Rani Sati Mandir, Muzaffarpur'),
  ('facebook_url', 'https://facebook.com'),
  ('instagram_url', 'https://instagram.com'),
  ('youtube_url', 'https://youtube.com')
ON DUPLICATE KEY UPDATE `key` = `key`;

INSERT INTO gallery (image_url, caption, sort_order, is_active) VALUES
  ('https://placehold.co/400x500/0a1628/white?text=AVM+Photo+1', 'Annual day celebration', 1, 1),
  ('https://placehold.co/400x300/0a1628/white?text=AVM+Photo+2', 'Cultural programme', 2, 1),
  ('https://placehold.co/400x380/0a1628/white?text=AVM+Photo+3', 'Classroom activity', 3, 1),
  ('https://placehold.co/400x520/0a1628/white?text=AVM+Photo+4', 'Christmas celebration', 4, 1),
  ('https://placehold.co/400x300/0a1628/white?text=AVM+Photo+5', 'Sports day', 5, 1),
  ('https://placehold.co/400x440/0a1628/white?text=AVM+Photo+6', 'Science exhibition', 6, 1),
  ('https://placehold.co/400x340/0a1628/white?text=AVM+Photo+7', 'Morning assembly', 7, 1),
  ('https://placehold.co/400x480/0a1628/white?text=AVM+Photo+8', 'Campus', 8, 1);

INSERT INTO testimonials (title, video_url, thumbnail_url, is_active) VALUES
  ('Testimonial 1', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://placehold.co/300x420/1e3a6e/white?text=Testimonial+1', 1),
  ('Testimonial 2', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://placehold.co/300x420/1e3a6e/white?text=Testimonial+2', 1),
  ('Testimonial 3', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://placehold.co/300x420/1e3a6e/white?text=Testimonial+3', 1);

INSERT INTO notices (title, content, published_at, is_active) VALUES
  ('Admissions open for session 2025-26', 'Admissions are now open for Nursery to Class 12.', CURDATE(), 1),
  ('Annual Sports Day announced', 'Details will be shared with parents shortly.', CURDATE(), 1);

-- ---------- Dynamic pages (also in backend/migrations/001_pages.sql) ----------
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
  layout VARCHAR(30) NOT NULL DEFAULT 'text',   -- text | cards | members | downloads | contact | admission | items | slides
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
 ('home-hero', 'Hero Slider', '', '', '', 'slides'),
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

-- Generated by scripts/gen_nav_pages.py — one CMS page per navbar entry. Safe to re-run.

INSERT INTO pages (slug, title, subtitle, banner_url, image_url, file_label, body, layout) VALUES ('about-us/about-avm','About AVM','Adarsh Vidya Mandir, Muzaffarpur','https://placehold.co/1920x500/16346b/white?text=About+AVM','','','Adarsh Vidya Mandir (AVM), Muzaffarpur, Bihar, is a CBSE-affiliated school established in 1966.

## Our Story

For decades AVM has nurtured young minds through quality education, strong values and all-round development.

## Our Campus

A lush green campus with well-equipped classrooms, laboratories, a library and playgrounds gives every child room to learn and grow.','text') ON DUPLICATE KEY UPDATE slug = slug;
INSERT INTO pages (slug, title, subtitle, banner_url, image_url, file_label, body, layout) VALUES ('about-us/vision-mission','Vision & Mission','What guides us','https://placehold.co/1920x500/16346b/white?text=Vision+%26+Mission','','','## Our Vision

To nurture confident, compassionate and capable citizens who lead with integrity and serve society.

## Our Mission

To provide a balanced, values-based education that develops the mind, body and spirit of every child, in a safe and supportive environment.

## Our Motto

विद्या ददाति विनयम् — Knowledge brings humility.','text') ON DUPLICATE KEY UPDATE slug = slug;
INSERT INTO pages (slug, title, subtitle, banner_url, image_url, file_label, body, layout) VALUES ('about-us/principals-welcome','Principal''s Welcome','A message from our Principal','https://placehold.co/1920x500/16346b/white?text=Principal''s+Welcome','','','Welcome to Adarsh Vidya Mandir.

At AVM we believe every child is unique and capable of greatness. Our teachers work closely with students and parents to build knowledge, character and confidence.

I invite you to explore our website and visit our campus to experience the AVM spirit first-hand.','profile') ON DUPLICATE KEY UPDATE slug = slug;
INSERT INTO page_items (page_slug, title, subtitle, description, image_url, file_url, sort_order) SELECT * FROM (SELECT 'about-us/principals-welcome' AS page_slug,'Principal' AS title,'Principal, Adarsh Vidya Mandir' AS subtitle,'' AS description,'https://placehold.co/400x400/16346b/white?text=Photo' AS image_url,'' AS file_url,1 AS sort_order) seed WHERE NOT EXISTS (SELECT 1 FROM page_items WHERE page_slug = 'about-us/principals-welcome');
INSERT INTO pages (slug, title, subtitle, banner_url, image_url, file_label, body, layout) VALUES ('about-us/virtual-tour','Virtual Tour','Explore our campus from anywhere','https://placehold.co/1920x500/16346b/white?text=Virtual+Tour','','','Take a walk through our classrooms, laboratories, library and playgrounds.','embed') ON DUPLICATE KEY UPDATE slug = slug;
INSERT INTO page_items (page_slug, title, subtitle, description, image_url, file_url, sort_order) SELECT * FROM (SELECT 'about-us/virtual-tour' AS page_slug,'Campus Virtual Tour' AS title,'' AS subtitle,'' AS description,'' AS image_url,'' AS file_url,1 AS sort_order) seed WHERE NOT EXISTS (SELECT 1 FROM page_items WHERE page_slug = 'about-us/virtual-tour');
INSERT INTO pages (slug, title, subtitle, banner_url, image_url, file_label, body, layout) VALUES ('about-us/testimonials','Testimonials','What parents say about AVM','https://placehold.co/1920x500/16346b/white?text=Testimonials','','','Hear from parents who trust AVM in shaping their children''s future.','testimonials') ON DUPLICATE KEY UPDATE slug = slug;
INSERT INTO pages (slug, title, subtitle, banner_url, image_url, file_label, body, layout) VALUES ('academics/curriculum','Curriculum','CBSE curriculum from Nursery to Class 12','https://placehold.co/1920x500/16346b/white?text=Curriculum','/assets/cbse_logo.webp','Download Curriculum (PDF)','Adarsh Vidya Mandir is affiliated to the Central Board of Secondary Education (CBSE), New Delhi.

We purely follow the curriculum, syllabus, examination pattern and instructions issued by CBSE, with a focus on conceptual understanding, application and continuous assessment.

## Our Stages

From Nursery to Class 12, each stage builds on the last so that students are well prepared for the CBSE board examinations and beyond.','cards') ON DUPLICATE KEY UPDATE slug = slug;
INSERT INTO page_items (page_slug, title, subtitle, description, image_url, file_url, sort_order) SELECT * FROM (SELECT 'academics/curriculum' AS page_slug,'Pre-Primary' AS title,'Nursery – UKG' AS subtitle,'Play-based, activity-led learning that builds curiosity and early skills.' AS description,'https://placehold.co/600x400/16346b/white?text=Pre-Primary' AS image_url,'' AS file_url,1 AS sort_order UNION ALL SELECT 'academics/curriculum','Primary','Classes 1 – 5','Strong foundations in language, mathematics, environmental studies and the arts.','https://placehold.co/600x400/16346b/white?text=Primary','',2 UNION ALL SELECT 'academics/curriculum','Middle School','Classes 6 – 8','Concept-driven teaching with projects, labs and language enrichment.','https://placehold.co/600x400/16346b/white?text=Middle+School','',3 UNION ALL SELECT 'academics/curriculum','Secondary','Classes 9 – 10','Structured preparation for the CBSE Class 10 board examination.','https://placehold.co/600x400/16346b/white?text=Secondary','',4 UNION ALL SELECT 'academics/curriculum','Senior Secondary','Classes 11 – 12','Science, Commerce and Humanities streams with career guidance.','https://placehold.co/600x400/16346b/white?text=Senior+Secondary','',5) seed WHERE NOT EXISTS (SELECT 1 FROM page_items WHERE page_slug = 'academics/curriculum');
INSERT INTO pages (slug, title, subtitle, banner_url, image_url, file_label, body, layout) VALUES ('academics/approach-to-learning','Approach to Learning','Learning that goes beyond textbooks','https://placehold.co/1920x500/16346b/white?text=Approach+to+Learning','','','Our teaching encourages students to ask questions, think critically and apply what they learn.','cards') ON DUPLICATE KEY UPDATE slug = slug;
INSERT INTO page_items (page_slug, title, subtitle, description, image_url, file_url, sort_order) SELECT * FROM (SELECT 'academics/approach-to-learning' AS page_slug,'Experiential Learning' AS title,'Learn by doing' AS subtitle,'Experiments, projects, field visits and presentations make ideas real.' AS description,'https://placehold.co/600x400/16346b/white?text=Experiential+Learning' AS image_url,'' AS file_url,1 AS sort_order UNION ALL SELECT 'academics/approach-to-learning','Critical Thinking','Ask why','Discussion and problem-solving build reasoning and independent thought.','https://placehold.co/600x400/16346b/white?text=Critical+Thinking','',2 UNION ALL SELECT 'academics/approach-to-learning','Technology in the Classroom','Smart learning','Digital tools support, but never replace, great teaching.','https://placehold.co/600x400/16346b/white?text=Technology+in+the+Classroom','',3 UNION ALL SELECT 'academics/approach-to-learning','Continuous Assessment','Growth over grades','Regular feedback helps every student improve at their own pace.','https://placehold.co/600x400/16346b/white?text=Continuous+Assessment','',4) seed WHERE NOT EXISTS (SELECT 1 FROM page_items WHERE page_slug = 'academics/approach-to-learning');
INSERT INTO pages (slug, title, subtitle, banner_url, image_url, file_label, body, layout) VALUES ('academics/facilities','Facilities','Spaces built for learning','https://placehold.co/1920x500/16346b/white?text=Facilities','','','Explore the spaces where our students learn, play and perform. Select a tab to see each facility.','tabs') ON DUPLICATE KEY UPDATE slug = slug;
INSERT INTO page_items (page_slug, title, subtitle, description, image_url, file_url, sort_order) SELECT * FROM (SELECT 'academics/facilities' AS page_slug,'Classrooms' AS title,'' AS subtitle,'Bright, well-ventilated classrooms with comfortable furniture, designed for focused learning and easy interaction between teachers and students.' AS description,'/assets/photos/fac-classroom.jpg' AS image_url,'' AS file_url,1 AS sort_order UNION ALL SELECT 'academics/facilities','Smart Classrooms','','Interactive digital panels bring lessons to life with visuals, videos and hands-on activities.','/assets/photos/fac-smart.jpg','',2 UNION ALL SELECT 'academics/facilities','Library','','A quiet reading room stocked with story books, reference books and magazines to build the reading habit.','/assets/photos/fac-library.jpg','',3 UNION ALL SELECT 'academics/facilities','Science Laboratory','','Laboratory space where students learn Physics, Chemistry and Biology by doing. (Photo coming soon.)','https://placehold.co/1200x800/16346b/white?text=Science+Laboratory','',4 UNION ALL SELECT 'academics/facilities','Computer Laboratory','','Computer lab where students build digital skills and learn to use technology responsibly. (Photo coming soon.)','https://placehold.co/1200x800/16346b/white?text=Computer+Laboratory','',5 UNION ALL SELECT 'academics/facilities','Playground','','Open grounds for morning assembly, sports and festival celebrations.','/assets/photos/fac-ground.jpg','',6 UNION ALL SELECT 'academics/facilities','Indoor Games & Chess','','A dedicated hall for chess and other indoor games, with regular practice and inter-school competitions.','/assets/photos/fac-chess.jpg','',7 UNION ALL SELECT 'academics/facilities','Art & Music Room','','A creative space for art, craft, music and dance. (Photo coming soon.)','https://placehold.co/1200x800/16346b/white?text=Art+%26+Music+Room','',8 UNION ALL SELECT 'academics/facilities','Amphitheatre & Stage','','Open-air stone steps and a stage that host the Annual Day, Republic Day and cultural programmes.','/assets/photos/fac-stage.jpg','',9) seed WHERE NOT EXISTS (SELECT 1 FROM page_items WHERE page_slug = 'academics/facilities');
INSERT INTO pages (slug, title, subtitle, banner_url, image_url, file_label, body, layout) VALUES ('governing-body/founders-message','Founder''s Message','In the words of our Founder','https://placehold.co/1920x500/16346b/white?text=Founder''s+Message','','','Adarsh Vidya Mandir was founded on the belief that education is the surest path to a better society.

Our aim has always been to give children a strong foundation of knowledge and values, so that they grow into responsible citizens.

I thank every parent, teacher and student who has been part of this journey.','profile') ON DUPLICATE KEY UPDATE slug = slug;
INSERT INTO page_items (page_slug, title, subtitle, description, image_url, file_url, sort_order) SELECT * FROM (SELECT 'governing-body/founders-message' AS page_slug,'Founder' AS title,'Founder, Adarsh Vidya Mandir' AS subtitle,'' AS description,'https://placehold.co/400x400/16346b/white?text=Photo' AS image_url,'' AS file_url,1 AS sort_order) seed WHERE NOT EXISTS (SELECT 1 FROM page_items WHERE page_slug = 'governing-body/founders-message');
INSERT INTO pages (slug, title, subtitle, banner_url, image_url, file_label, body, layout) VALUES ('governing-body/board-of-governors','Board of Governors','Guiding the school''s vision','https://placehold.co/1920x500/16346b/white?text=Board+of+Governors','','','The Board of Governors provides vision, oversight and support to the school community.','members') ON DUPLICATE KEY UPDATE slug = slug;
INSERT INTO page_items (page_slug, title, subtitle, description, image_url, file_url, sort_order) SELECT * FROM (SELECT 'governing-body/board-of-governors' AS page_slug,'President' AS title,'President' AS subtitle,'' AS description,'https://placehold.co/400x400/16346b/white?text=Photo' AS image_url,'' AS file_url,1 AS sort_order UNION ALL SELECT 'governing-body/board-of-governors','Secretary','Secretary','','https://placehold.co/400x400/16346b/white?text=Photo','',2 UNION ALL SELECT 'governing-body/board-of-governors','Treasurer','Treasurer','','https://placehold.co/400x400/16346b/white?text=Photo','',3 UNION ALL SELECT 'governing-body/board-of-governors','Member','Board Member','','https://placehold.co/400x400/16346b/white?text=Photo','',4 UNION ALL SELECT 'governing-body/board-of-governors','Principal','Principal (Ex-officio)','','https://placehold.co/400x400/16346b/white?text=Photo','',5) seed WHERE NOT EXISTS (SELECT 1 FROM page_items WHERE page_slug = 'governing-body/board-of-governors');
INSERT INTO pages (slug, title, subtitle, banner_url, image_url, file_label, body, layout) VALUES ('governing-body/about-president','About President','Meet our President','https://placehold.co/1920x500/16346b/white?text=About+President','','','Our President has led the governing body with a steady commitment to academic excellence and strong values.

Under this guidance the school continues to grow in facilities, learning and community.','profile') ON DUPLICATE KEY UPDATE slug = slug;
INSERT INTO page_items (page_slug, title, subtitle, description, image_url, file_url, sort_order) SELECT * FROM (SELECT 'governing-body/about-president' AS page_slug,'President' AS title,'President, Governing Body' AS subtitle,'' AS description,'https://placehold.co/400x400/16346b/white?text=Photo' AS image_url,'' AS file_url,1 AS sort_order) seed WHERE NOT EXISTS (SELECT 1 FROM page_items WHERE page_slug = 'governing-body/about-president');
INSERT INTO pages (slug, title, subtitle, banner_url, image_url, file_label, body, layout) VALUES ('sports-and-activities/sports-overview','Sports Overview','Building fitness, teamwork and spirit','https://placehold.co/1920x500/16346b/white?text=Sports+Overview','','','Sport is an essential part of life at AVM. Students take part in cricket, football, athletics, badminton, kabaddi and more.

## Facilities

Our playgrounds and indoor spaces support regular training, house matches and inter-school tournaments.

## Why Sport Matters

Sport teaches discipline, resilience, leadership and the joy of playing as a team.','text') ON DUPLICATE KEY UPDATE slug = slug;
INSERT INTO pages (slug, title, subtitle, banner_url, image_url, file_label, body, layout) VALUES ('sports-and-activities/student-leadership','Student Leadership','Developing tomorrow''s leaders','https://placehold.co/1920x500/16346b/white?text=Student+Leadership','','','Students take on real responsibility through councils, houses and clubs.','cards') ON DUPLICATE KEY UPDATE slug = slug;
INSERT INTO page_items (page_slug, title, subtitle, description, image_url, file_url, sort_order) SELECT * FROM (SELECT 'sports-and-activities/student-leadership' AS page_slug,'Student Council' AS title,'Elected leaders' AS subtitle,'Head Boy, Head Girl and prefects represent their peers.' AS description,'https://placehold.co/600x400/16346b/white?text=Student+Council' AS image_url,'' AS file_url,1 AS sort_order UNION ALL SELECT 'sports-and-activities/student-leadership','House Captains','Leading by example','Each house is led by captains who organise events and teams.','https://placehold.co/600x400/16346b/white?text=House+Captains','',2 UNION ALL SELECT 'sports-and-activities/student-leadership','Club Leaders','Passion projects','Students run clubs in science, arts, literature and community service.','https://placehold.co/600x400/16346b/white?text=Club+Leaders','',3) seed WHERE NOT EXISTS (SELECT 1 FROM page_items WHERE page_slug = 'sports-and-activities/student-leadership');
INSERT INTO pages (slug, title, subtitle, banner_url, image_url, file_label, body, layout) VALUES ('sports-and-activities/activities','Activities','Beyond the classroom','https://placehold.co/1920x500/16346b/white?text=Activities','','','From the stage to the laboratory, AVM students discover their talents.','cards') ON DUPLICATE KEY UPDATE slug = slug;
INSERT INTO page_items (page_slug, title, subtitle, description, image_url, file_url, sort_order) SELECT * FROM (SELECT 'sports-and-activities/activities' AS page_slug,'Music & Dance' AS title,'Performing arts' AS subtitle,'Classical and contemporary music and dance training.' AS description,'https://placehold.co/600x400/16346b/white?text=Music+%26+Dance' AS image_url,'' AS file_url,1 AS sort_order UNION ALL SELECT 'sports-and-activities/activities','Art & Craft','Creativity','Painting, sketching and craft that give imagination a canvas.','https://placehold.co/600x400/16346b/white?text=Art+%26+Craft','',2 UNION ALL SELECT 'sports-and-activities/activities','Science Club','Curiosity','Hands-on experiments and exhibitions.','https://placehold.co/600x400/16346b/white?text=Science+Club','',3 UNION ALL SELECT 'sports-and-activities/activities','Debate & Quiz','Communication','Public speaking, debates and inter-school quizzes.','https://placehold.co/600x400/16346b/white?text=Debate+%26+Quiz','',4 UNION ALL SELECT 'sports-and-activities/activities','Community Service','Giving back','Drives and visits that teach empathy and responsibility.','https://placehold.co/600x400/16346b/white?text=Community+Service','',5) seed WHERE NOT EXISTS (SELECT 1 FROM page_items WHERE page_slug = 'sports-and-activities/activities');
INSERT INTO pages (slug, title, subtitle, banner_url, image_url, file_label, body, layout) VALUES ('downloads/annual-calendar','Annual Calendar 2026-2027','Key dates for the session','https://placehold.co/1920x500/16346b/white?text=Annual+Calendar+2026-2027','','','Download the academic calendar for the session.','downloads') ON DUPLICATE KEY UPDATE slug = slug;
INSERT INTO page_items (page_slug, title, subtitle, description, image_url, file_url, sort_order) SELECT * FROM (SELECT 'downloads/annual-calendar' AS page_slug,'Annual Calendar 2026-2027' AS title,'Document' AS subtitle,'' AS description,'' AS image_url,'#' AS file_url,1 AS sort_order) seed WHERE NOT EXISTS (SELECT 1 FROM page_items WHERE page_slug = 'downloads/annual-calendar');
INSERT INTO pages (slug, title, subtitle, banner_url, image_url, file_label, body, layout) VALUES ('downloads/e-brochure','E-Brochure','Know AVM at a glance','https://placehold.co/1920x500/16346b/white?text=E-Brochure','','','Download our school brochure.','downloads') ON DUPLICATE KEY UPDATE slug = slug;
INSERT INTO page_items (page_slug, title, subtitle, description, image_url, file_url, sort_order) SELECT * FROM (SELECT 'downloads/e-brochure' AS page_slug,'AVM E-Brochure' AS title,'Document' AS subtitle,'' AS description,'' AS image_url,'#' AS file_url,1 AS sort_order) seed WHERE NOT EXISTS (SELECT 1 FROM page_items WHERE page_slug = 'downloads/e-brochure');
INSERT INTO pages (slug, title, subtitle, banner_url, image_url, file_label, body, layout) VALUES ('downloads/yearbook-2025-2026','Yearbook 2025-2026','A year in pictures','https://placehold.co/1920x500/16346b/white?text=Yearbook+2025-2026','','','Relive the year through our yearbook.','downloads') ON DUPLICATE KEY UPDATE slug = slug;
INSERT INTO page_items (page_slug, title, subtitle, description, image_url, file_url, sort_order) SELECT * FROM (SELECT 'downloads/yearbook-2025-2026' AS page_slug,'Yearbook 2025-2026' AS title,'Document' AS subtitle,'' AS description,'' AS image_url,'#' AS file_url,1 AS sort_order) seed WHERE NOT EXISTS (SELECT 1 FROM page_items WHERE page_slug = 'downloads/yearbook-2025-2026');
INSERT INTO pages (slug, title, subtitle, banner_url, image_url, file_label, body, layout) VALUES ('downloads/old-year-books','Old Year Books','Memories from past years','https://placehold.co/1920x500/16346b/white?text=Old+Year+Books','','','Browse yearbooks from earlier sessions.','downloads') ON DUPLICATE KEY UPDATE slug = slug;
INSERT INTO page_items (page_slug, title, subtitle, description, image_url, file_url, sort_order) SELECT * FROM (SELECT 'downloads/old-year-books' AS page_slug,'Yearbook 2024-2025' AS title,'Document' AS subtitle,'' AS description,'' AS image_url,'#' AS file_url,1 AS sort_order UNION ALL SELECT 'downloads/old-year-books','Yearbook 2023-2024','Document','','','#',2 UNION ALL SELECT 'downloads/old-year-books','Yearbook 2022-2023','Document','','','#',3) seed WHERE NOT EXISTS (SELECT 1 FROM page_items WHERE page_slug = 'downloads/old-year-books');
INSERT INTO pages (slug, title, subtitle, banner_url, image_url, file_label, body, layout) VALUES ('downloads/newsletter','Newsletter','News from the AVM community','https://placehold.co/1920x500/16346b/white?text=Newsletter','','','Read our latest newsletters.','downloads') ON DUPLICATE KEY UPDATE slug = slug;
INSERT INTO page_items (page_slug, title, subtitle, description, image_url, file_url, sort_order) SELECT * FROM (SELECT 'downloads/newsletter' AS page_slug,'Newsletter — Latest Issue' AS title,'Document' AS subtitle,'' AS description,'' AS image_url,'#' AS file_url,1 AS sort_order) seed WHERE NOT EXISTS (SELECT 1 FROM page_items WHERE page_slug = 'downloads/newsletter');
INSERT INTO pages (slug, title, subtitle, banner_url, image_url, file_label, body, layout) VALUES ('downloads/results','Results','Academic results','https://placehold.co/1920x500/16346b/white?text=Results','','','Board and class results are published here.','downloads') ON DUPLICATE KEY UPDATE slug = slug;
INSERT INTO page_items (page_slug, title, subtitle, description, image_url, file_url, sort_order) SELECT * FROM (SELECT 'downloads/results' AS page_slug,'Class 10 Board Results' AS title,'Document' AS subtitle,'' AS description,'' AS image_url,'#' AS file_url,1 AS sort_order UNION ALL SELECT 'downloads/results','Class 12 Board Results','Document','','','#',2) seed WHERE NOT EXISTS (SELECT 1 FROM page_items WHERE page_slug = 'downloads/results');
INSERT INTO pages (slug, title, subtitle, banner_url, image_url, file_label, body, layout) VALUES ('downloads/transfer-certificate','Transfer Certificate','TC information and forms','https://placehold.co/1920x500/16346b/white?text=Transfer+Certificate','','','Download the forms needed to request a Transfer Certificate.','downloads') ON DUPLICATE KEY UPDATE slug = slug;
INSERT INTO page_items (page_slug, title, subtitle, description, image_url, file_url, sort_order) SELECT * FROM (SELECT 'downloads/transfer-certificate' AS page_slug,'Transfer Certificate Request Form' AS title,'Document' AS subtitle,'' AS description,'' AS image_url,'#' AS file_url,1 AS sort_order) seed WHERE NOT EXISTS (SELECT 1 FROM page_items WHERE page_slug = 'downloads/transfer-certificate');
INSERT INTO pages (slug, title, subtitle, banner_url, image_url, file_label, body, layout) VALUES ('pastoral/overview','Pastoral Overview','Caring for every child','https://placehold.co/1920x500/16346b/white?text=Pastoral+Overview','','','Pastoral care at AVM ensures that every student feels safe, heard and supported.

## Our Approach

Class teachers, house masters and counsellors work together to look after each child''s wellbeing, behaviour and progress.

## Support for Students

Students can speak to a trusted adult at any time, and parents are kept closely informed.','text') ON DUPLICATE KEY UPDATE slug = slug;
INSERT INTO pages (slug, title, subtitle, banner_url, image_url, file_label, body, layout) VALUES ('pastoral/house-system','House System','Four houses, one AVM family','https://placehold.co/1920x500/16346b/white?text=House+System','','','Every student belongs to a house. Houses compete in sports, arts and academics, building teamwork, loyalty and friendly rivalry.','cards') ON DUPLICATE KEY UPDATE slug = slug;
INSERT INTO page_items (page_slug, title, subtitle, description, image_url, file_url, sort_order) SELECT * FROM (SELECT 'pastoral/house-system' AS page_slug,'Knowledge House' AS title,'House' AS subtitle,'Curious minds who love to learn.' AS description,'https://placehold.co/600x400/16346b/white?text=Knowledge+House' AS image_url,'' AS file_url,1 AS sort_order UNION ALL SELECT 'pastoral/house-system','Wisdom House','House','Imaginative thinkers who explore and create.','https://placehold.co/600x400/16346b/white?text=Wonder+House','',2 UNION ALL SELECT 'pastoral/house-system','Intelligent House','House','Sharp, analytical and always ready to solve.','https://placehold.co/600x400/16346b/white?text=Intelligent+House','',3 UNION ALL SELECT 'pastoral/house-system','Confidence House','House','Bold leaders who stand tall and speak up.','https://placehold.co/600x400/16346b/white?text=Confidence+House','',4) seed WHERE NOT EXISTS (SELECT 1 FROM page_items WHERE page_slug = 'pastoral/house-system');
INSERT INTO pages (slug, title, subtitle, banner_url, image_url, file_label, body, layout) VALUES ('pastoral/house-system/knowledge-house','Knowledge House','Our house','https://placehold.co/1920x500/16346b/white?text=Knowledge+House','','','Welcome to Knowledge House. Members of the house take part in inter-house competitions in sports, arts and academics throughout the year.','members') ON DUPLICATE KEY UPDATE slug = slug;
INSERT INTO page_items (page_slug, title, subtitle, description, image_url, file_url, sort_order) SELECT * FROM (SELECT 'pastoral/house-system/knowledge-house' AS page_slug,'House Master' AS title,'Knowledge House — House Master' AS subtitle,'' AS description,'https://placehold.co/400x400/16346b/white?text=Photo' AS image_url,'' AS file_url,1 AS sort_order UNION ALL SELECT 'pastoral/house-system/knowledge-house','House Captain','Knowledge House — Captain','','https://placehold.co/400x400/16346b/white?text=Photo','',2 UNION ALL SELECT 'pastoral/house-system/knowledge-house','Vice Captain','Knowledge House — Vice Captain','','https://placehold.co/400x400/16346b/white?text=Photo','',3) seed WHERE NOT EXISTS (SELECT 1 FROM page_items WHERE page_slug = 'pastoral/house-system/knowledge-house');
INSERT INTO pages (slug, title, subtitle, banner_url, image_url, file_label, body, layout) VALUES ('pastoral/house-system/wonder-house','Wisdom House','Our house','https://placehold.co/1920x500/16346b/white?text=Wonder+House','','','Welcome to Wisdom House. Members of the house take part in inter-house competitions in sports, arts and academics throughout the year.','members') ON DUPLICATE KEY UPDATE slug = slug;
INSERT INTO page_items (page_slug, title, subtitle, description, image_url, file_url, sort_order) SELECT * FROM (SELECT 'pastoral/house-system/wonder-house' AS page_slug,'House Master' AS title,'Wisdom House — House Master' AS subtitle,'' AS description,'https://placehold.co/400x400/16346b/white?text=Photo' AS image_url,'' AS file_url,1 AS sort_order UNION ALL SELECT 'pastoral/house-system/wonder-house','House Captain','Wisdom House — Captain','','https://placehold.co/400x400/16346b/white?text=Photo','',2 UNION ALL SELECT 'pastoral/house-system/wonder-house','Vice Captain','Wisdom House — Vice Captain','','https://placehold.co/400x400/16346b/white?text=Photo','',3) seed WHERE NOT EXISTS (SELECT 1 FROM page_items WHERE page_slug = 'pastoral/house-system/wonder-house');
INSERT INTO pages (slug, title, subtitle, banner_url, image_url, file_label, body, layout) VALUES ('pastoral/house-system/intelligent-house','Intelligent House','Our house','https://placehold.co/1920x500/16346b/white?text=Intelligent+House','','','Welcome to Intelligent House. Members of the house take part in inter-house competitions in sports, arts and academics throughout the year.','members') ON DUPLICATE KEY UPDATE slug = slug;
INSERT INTO page_items (page_slug, title, subtitle, description, image_url, file_url, sort_order) SELECT * FROM (SELECT 'pastoral/house-system/intelligent-house' AS page_slug,'House Master' AS title,'Intelligent House — House Master' AS subtitle,'' AS description,'https://placehold.co/400x400/16346b/white?text=Photo' AS image_url,'' AS file_url,1 AS sort_order UNION ALL SELECT 'pastoral/house-system/intelligent-house','House Captain','Intelligent House — Captain','','https://placehold.co/400x400/16346b/white?text=Photo','',2 UNION ALL SELECT 'pastoral/house-system/intelligent-house','Vice Captain','Intelligent House — Vice Captain','','https://placehold.co/400x400/16346b/white?text=Photo','',3) seed WHERE NOT EXISTS (SELECT 1 FROM page_items WHERE page_slug = 'pastoral/house-system/intelligent-house');
INSERT INTO pages (slug, title, subtitle, banner_url, image_url, file_label, body, layout) VALUES ('pastoral/house-system/confidence-house','Confidence House','Our house','https://placehold.co/1920x500/16346b/white?text=Confidence+House','','','Welcome to Confidence House. Members of the house take part in inter-house competitions in sports, arts and academics throughout the year.','members') ON DUPLICATE KEY UPDATE slug = slug;
INSERT INTO page_items (page_slug, title, subtitle, description, image_url, file_url, sort_order) SELECT * FROM (SELECT 'pastoral/house-system/confidence-house' AS page_slug,'House Master' AS title,'Confidence House — House Master' AS subtitle,'' AS description,'https://placehold.co/400x400/16346b/white?text=Photo' AS image_url,'' AS file_url,1 AS sort_order UNION ALL SELECT 'pastoral/house-system/confidence-house','House Captain','Confidence House — Captain','','https://placehold.co/400x400/16346b/white?text=Photo','',2 UNION ALL SELECT 'pastoral/house-system/confidence-house','Vice Captain','Confidence House — Vice Captain','','https://placehold.co/400x400/16346b/white?text=Photo','',3) seed WHERE NOT EXISTS (SELECT 1 FROM page_items WHERE page_slug = 'pastoral/house-system/confidence-house');
INSERT INTO pages (slug, title, subtitle, banner_url, image_url, file_label, body, layout) VALUES ('admission/procedure','Admission Procedure','How to apply to AVM','https://placehold.co/1920x500/16346b/white?text=Admission+Procedure','','','## Step 1 — Enquiry

Fill in the enquiry form or visit the school office.

## Step 2 — Registration

Complete the registration form and submit the required documents.

## Step 3 — Interaction

The child and parents meet our admissions team.

## Step 4 — Confirmation

On selection, complete the fee payment to confirm the seat.

## Documents Required

Birth certificate, previous school report card and transfer certificate (where applicable), passport-size photographs and address proof.','text') ON DUPLICATE KEY UPDATE slug = slug;
INSERT INTO pages (slug, title, subtitle, banner_url, image_url, file_label, body, layout) VALUES ('admission/online-registration','Online Registration','Register your child online','https://placehold.co/1920x500/16346b/white?text=Online+Registration','','','Complete the form below to register your interest. Our admissions team will contact you with the next steps.','admission') ON DUPLICATE KEY UPDATE slug = slug;
INSERT INTO pages (slug, title, subtitle, banner_url, image_url, file_label, body, layout) VALUES ('admission/fee-structure','Fee Structure','Fees for the current session','https://placehold.co/1920x500/16346b/white?text=Fee+Structure','','','Download the fee structure for the current session.','downloads') ON DUPLICATE KEY UPDATE slug = slug;
INSERT INTO page_items (page_slug, title, subtitle, description, image_url, file_url, sort_order) SELECT * FROM (SELECT 'admission/fee-structure' AS page_slug,'Fee Structure' AS title,'Fees' AS subtitle,'' AS description,'' AS image_url,'#' AS file_url,1 AS sort_order) seed WHERE NOT EXISTS (SELECT 1 FROM page_items WHERE page_slug = 'admission/fee-structure');
INSERT INTO pages (slug, title, subtitle, banner_url, image_url, file_label, body, layout) VALUES ('admission/scholarships-and-bursaries','Scholarships and Bursaries','Supporting deserving students','https://placehold.co/1920x500/16346b/white?text=Scholarships+and+Bursaries','','','AVM believes that no deserving child should miss out on a good education.

## Scholarships

Merit scholarships recognise outstanding academic and co-curricular achievement.

## Bursaries

Financial assistance is available for families who need support. Please contact the school office for details and eligibility.','text') ON DUPLICATE KEY UPDATE slug = slug;
INSERT INTO pages (slug, title, subtitle, banner_url, image_url, file_label, body, layout) VALUES ('contact-us/enquire-now','Enquire Now','Send us your questions','https://placehold.co/1920x500/16346b/white?text=Enquire+Now','','','Have a question about admissions, fees or the school? Send us a message and we''ll reply shortly.','contact') ON DUPLICATE KEY UPDATE slug = slug;
INSERT INTO pages (slug, title, subtitle, banner_url, image_url, file_label, body, layout) VALUES ('contact-us/apply-now','Enquire Now','Start your child''s application','https://placehold.co/1920x500/16346b/white?text=Apply+Now','','','Ready to join the AVM family? Fill in the form below and our admissions team will be in touch.','admission') ON DUPLICATE KEY UPDATE slug = slug;

-- Generated by scripts/gen_photo_content.py. Safe to re-run; never overwrites admin uploads.

-- Hero slides
INSERT INTO page_items (page_slug, title, subtitle, description, image_url, file_url, sort_order) SELECT 'home-hero','A Campus Built for Learning','Adarsh Vidya Mandir, Muzaffarpur','','/assets/photos/hero-campus.jpg','',COALESCE((SELECT MAX(sort_order) FROM page_items WHERE page_slug='home-hero'),0)+1 FROM DUAL WHERE EXISTS (SELECT 1 FROM pages WHERE slug='home-hero') AND NOT EXISTS (SELECT 1 FROM page_items WHERE page_slug='home-hero' AND image_url='/assets/photos/hero-campus.jpg');
INSERT INTO page_items (page_slug, title, subtitle, description, image_url, file_url, sort_order) SELECT 'home-hero','Celebrating Our Culture','Music, dance and tradition','','/assets/photos/hero-culture.jpg','',COALESCE((SELECT MAX(sort_order) FROM page_items WHERE page_slug='home-hero'),0)+1 FROM DUAL WHERE EXISTS (SELECT 1 FROM pages WHERE slug='home-hero') AND NOT EXISTS (SELECT 1 FROM page_items WHERE page_slug='home-hero' AND image_url='/assets/photos/hero-culture.jpg');
INSERT INTO page_items (page_slug, title, subtitle, description, image_url, file_url, sort_order) SELECT 'home-hero','Teamwork. Confidence. Leadership.','Annual Day 2024','','/assets/photos/hero-annualday.jpg','',COALESCE((SELECT MAX(sort_order) FROM page_items WHERE page_slug='home-hero'),0)+1 FROM DUAL WHERE EXISTS (SELECT 1 FROM pages WHERE slug='home-hero') AND NOT EXISTS (SELECT 1 FROM page_items WHERE page_slug='home-hero' AND image_url='/assets/photos/hero-annualday.jpg');

-- Gallery: drop the sample placeholders, add real photos after whatever is already there
DELETE FROM gallery WHERE image_url LIKE 'https://placehold.co/%';
SET @n := (SELECT COALESCE(MAX(sort_order),0) FROM gallery);
INSERT INTO gallery (image_url, caption, sort_order, is_active) SELECT '/assets/photos/gal-republic-day.jpg','Republic Day celebrations',(@n := @n + 1),1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM gallery WHERE image_url='/assets/photos/gal-republic-day.jpg');
INSERT INTO gallery (image_url, caption, sort_order, is_active) SELECT '/assets/photos/gal-human-pyramid.jpg','Annual Day 2024',(@n := @n + 1),1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM gallery WHERE image_url='/assets/photos/gal-human-pyramid.jpg');
INSERT INTO gallery (image_url, caption, sort_order, is_active) SELECT '/assets/photos/gal-steps-group.jpg','Celebration on the steps',(@n := @n + 1),1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM gallery WHERE image_url='/assets/photos/gal-steps-group.jpg');
INSERT INTO gallery (image_url, caption, sort_order, is_active) SELECT '/assets/photos/gal-costume-day.jpg','Costume day',(@n := @n + 1),1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM gallery WHERE image_url='/assets/photos/gal-costume-day.jpg');
INSERT INTO gallery (image_url, caption, sort_order, is_active) SELECT '/assets/photos/gal-rangoli.jpg','Flower rangoli',(@n := @n + 1),1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM gallery WHERE image_url='/assets/photos/gal-rangoli.jpg');
INSERT INTO gallery (image_url, caption, sort_order, is_active) SELECT '/assets/photos/gal-chess.jpg','Chess competition',(@n := @n + 1),1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM gallery WHERE image_url='/assets/photos/gal-chess.jpg');
INSERT INTO gallery (image_url, caption, sort_order, is_active) SELECT '/assets/photos/gal-classroom.jpg','In the classroom',(@n := @n + 1),1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM gallery WHERE image_url='/assets/photos/gal-classroom.jpg');
INSERT INTO gallery (image_url, caption, sort_order, is_active) SELECT '/assets/photos/gal-early-years.jpg','Early years classroom',(@n := @n + 1),1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM gallery WHERE image_url='/assets/photos/gal-early-years.jpg');
INSERT INTO gallery (image_url, caption, sort_order, is_active) SELECT '/assets/photos/gal-dandiya-teachers.jpg','Dandiya celebration',(@n := @n + 1),1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM gallery WHERE image_url='/assets/photos/gal-dandiya-teachers.jpg');
INSERT INTO gallery (image_url, caption, sort_order, is_active) SELECT '/assets/photos/gal-dandiya-kids.jpg','Dandiya with the little ones',(@n := @n + 1),1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM gallery WHERE image_url='/assets/photos/gal-dandiya-kids.jpg');
INSERT INTO gallery (image_url, caption, sort_order, is_active) SELECT '/assets/photos/gal-pineapple.jpg','Fancy dress',(@n := @n + 1),1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM gallery WHERE image_url='/assets/photos/gal-pineapple.jpg');
INSERT INTO gallery (image_url, caption, sort_order, is_active) SELECT '/assets/photos/gal-dance-portrait.jpg','Cultural programme',(@n := @n + 1),1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM gallery WHERE image_url='/assets/photos/gal-dance-portrait.jpg');
INSERT INTO gallery (image_url, caption, sort_order, is_active) SELECT '/assets/photos/gal-dance-group.jpg','Tricolour dance',(@n := @n + 1),1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM gallery WHERE image_url='/assets/photos/gal-dance-group.jpg');
INSERT INTO gallery (image_url, caption, sort_order, is_active) SELECT '/assets/photos/gal-annualday-pink.jpg','Annual Day performance',(@n := @n + 1),1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM gallery WHERE image_url='/assets/photos/gal-annualday-pink.jpg');
INSERT INTO gallery (image_url, caption, sort_order, is_active) SELECT '/assets/photos/gal-annualday-orange.jpg','Annual Day performance',(@n := @n + 1),1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM gallery WHERE image_url='/assets/photos/gal-annualday-orange.jpg');
INSERT INTO gallery (image_url, caption, sort_order, is_active) SELECT '/assets/photos/gal-annualday-stage.jpg','Annual Day 2024',(@n := @n + 1),1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM gallery WHERE image_url='/assets/photos/gal-annualday-stage.jpg');
INSERT INTO gallery (image_url, caption, sort_order, is_active) SELECT '/assets/photos/gal-inauguration.jpg','Inauguration of the new building',(@n := @n + 1),1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM gallery WHERE image_url='/assets/photos/gal-inauguration.jpg');
INSERT INTO gallery (image_url, caption, sort_order, is_active) SELECT '/assets/photos/gal-teachers.jpg','Our teachers',(@n := @n + 1),1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM gallery WHERE image_url='/assets/photos/gal-teachers.jpg');
INSERT INTO gallery (image_url, caption, sort_order, is_active) SELECT '/assets/photos/gal-christmas.jpg','Christmas celebration',(@n := @n + 1),1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM gallery WHERE image_url='/assets/photos/gal-christmas.jpg');
INSERT INTO gallery (image_url, caption, sort_order, is_active) SELECT '/assets/photos/gal-staff-students.jpg','Teachers and students together',(@n := @n + 1),1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM gallery WHERE image_url='/assets/photos/gal-staff-students.jpg');
INSERT INTO gallery (image_url, caption, sort_order, is_active) SELECT '/assets/photos/gal-campus.jpg','Our campus',(@n := @n + 1),1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM gallery WHERE image_url='/assets/photos/gal-campus.jpg');
INSERT INTO gallery (image_url, caption, sort_order, is_active) SELECT '/assets/photos/gal-garba-ground.jpg','Garba on the ground',(@n := @n + 1),1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM gallery WHERE image_url='/assets/photos/gal-garba-ground.jpg');
INSERT INTO gallery (image_url, caption, sort_order, is_active) SELECT '/assets/photos/gal-rangoli-portrait.jpg','Rangoli in the classroom',(@n := @n + 1),1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM gallery WHERE image_url='/assets/photos/gal-rangoli-portrait.jpg');
INSERT INTO gallery (image_url, caption, sort_order, is_active) SELECT '/assets/photos/gal-craft-kids.jpg','Craft time',(@n := @n + 1),1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM gallery WHERE image_url='/assets/photos/gal-craft-kids.jpg');
INSERT INTO gallery (image_url, caption, sort_order, is_active) SELECT '/assets/photos/gal-bhumi-pujan.jpg','Bhumi Pujan — where it began',(@n := @n + 1),1 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM gallery WHERE image_url='/assets/photos/gal-bhumi-pujan.jpg');

-- Page banners
UPDATE pages SET banner_url='/assets/photos/banner-about.jpg' WHERE (slug='about-us' OR slug LIKE 'about-us/%') AND banner_url LIKE 'https://placehold.co/%';
UPDATE pages SET banner_url='/assets/photos/banner-academics.jpg' WHERE (slug='academics' OR slug LIKE 'academics/%') AND banner_url LIKE 'https://placehold.co/%';
UPDATE pages SET banner_url='/assets/photos/banner-governing.jpg' WHERE (slug='governing-body' OR slug LIKE 'governing-body/%') AND banner_url LIKE 'https://placehold.co/%';
UPDATE pages SET banner_url='/assets/photos/banner-sports.jpg' WHERE (slug='sports-and-activities' OR slug LIKE 'sports-and-activities/%') AND banner_url LIKE 'https://placehold.co/%';
UPDATE pages SET banner_url='/assets/photos/banner-downloads.jpg' WHERE (slug='downloads' OR slug LIKE 'downloads/%') AND banner_url LIKE 'https://placehold.co/%';
UPDATE pages SET banner_url='/assets/photos/banner-pastoral.jpg' WHERE (slug='pastoral' OR slug LIKE 'pastoral/%') AND banner_url LIKE 'https://placehold.co/%';
UPDATE pages SET banner_url='/assets/photos/banner-disclosure.jpg' WHERE (slug='public-disclosure' OR slug LIKE 'public-disclosure/%') AND banner_url LIKE 'https://placehold.co/%';
UPDATE pages SET banner_url='/assets/photos/banner-contact.jpg' WHERE (slug='contact-us' OR slug LIKE 'contact-us/%') AND banner_url LIKE 'https://placehold.co/%';
UPDATE pages SET banner_url='/assets/photos/banner-alumni.jpg' WHERE (slug='alumni' OR slug LIKE 'alumni/%') AND banner_url LIKE 'https://placehold.co/%';
UPDATE pages SET banner_url='/assets/photos/banner-admission.jpg' WHERE (slug='admission' OR slug LIKE 'admission/%') AND banner_url LIKE 'https://placehold.co/%';
UPDATE pages SET banner_url='/assets/photos/banner-academics.jpg' WHERE slug='academics/facilities' AND banner_url LIKE 'https://placehold.co/%';
UPDATE pages SET banner_url='/assets/photos/why-bg.jpg' WHERE slug='home-why' AND banner_url='';

-- Image beside the text
UPDATE pages SET image_url='/assets/photos/about-avm.jpg' WHERE slug='about-us/about-avm' AND image_url='';
UPDATE pages SET image_url='/assets/photos/pastoral-overview.jpg' WHERE slug='pastoral/overview' AND image_url='';

-- Card photos
UPDATE page_items SET image_url='/assets/photos/cur-preprimary.jpg' WHERE page_slug='academics/curriculum' AND title='Pre-Primary' AND image_url LIKE 'https://placehold.co/%';
UPDATE page_items SET image_url='/assets/photos/cur-primary.jpg' WHERE page_slug='academics/curriculum' AND title='Primary' AND image_url LIKE 'https://placehold.co/%';
UPDATE page_items SET image_url='/assets/photos/cur-middle.jpg' WHERE page_slug='academics/curriculum' AND title='Middle School' AND image_url LIKE 'https://placehold.co/%';
UPDATE page_items SET image_url='/assets/photos/cur-secondary.jpg' WHERE page_slug='academics/curriculum' AND title='Secondary' AND image_url LIKE 'https://placehold.co/%';
UPDATE page_items SET image_url='/assets/photos/cur-senior.jpg' WHERE page_slug='academics/curriculum' AND title='Senior Secondary' AND image_url LIKE 'https://placehold.co/%';
UPDATE page_items SET image_url='/assets/photos/learn-experiential.jpg' WHERE page_slug='academics/approach-to-learning' AND title='Experiential Learning' AND image_url LIKE 'https://placehold.co/%';
UPDATE page_items SET image_url='/assets/photos/learn-thinking.jpg' WHERE page_slug='academics/approach-to-learning' AND title='Critical Thinking' AND image_url LIKE 'https://placehold.co/%';
UPDATE page_items SET image_url='/assets/photos/learn-tech.jpg' WHERE page_slug='academics/approach-to-learning' AND title='Technology in the Classroom' AND image_url LIKE 'https://placehold.co/%';
UPDATE page_items SET image_url='/assets/photos/learn-assessment.jpg' WHERE page_slug='academics/approach-to-learning' AND title='Continuous Assessment' AND image_url LIKE 'https://placehold.co/%';
UPDATE page_items SET image_url='/assets/photos/lead-council.jpg' WHERE page_slug='sports-and-activities/student-leadership' AND title='Student Council' AND image_url LIKE 'https://placehold.co/%';
UPDATE page_items SET image_url='/assets/photos/lead-houses.jpg' WHERE page_slug='sports-and-activities/student-leadership' AND title='House Captains' AND image_url LIKE 'https://placehold.co/%';
UPDATE page_items SET image_url='/assets/photos/lead-clubs.jpg' WHERE page_slug='sports-and-activities/student-leadership' AND title='Club Leaders' AND image_url LIKE 'https://placehold.co/%';
UPDATE page_items SET image_url='/assets/photos/act-dance.jpg' WHERE page_slug='sports-and-activities/activities' AND title='Music & Dance' AND image_url LIKE 'https://placehold.co/%';
UPDATE page_items SET image_url='/assets/photos/act-craft.jpg' WHERE page_slug='sports-and-activities/activities' AND title='Art & Craft' AND image_url LIKE 'https://placehold.co/%';
UPDATE page_items SET image_url='/assets/photos/act-dance.jpg' WHERE page_slug='sports-and-activities' AND title='Music & Dance' AND image_url LIKE 'https://placehold.co/%';

-- New activity cards with real photos
INSERT INTO page_items (page_slug, title, subtitle, description, image_url, file_url, sort_order) SELECT 'sports-and-activities/activities','Chess','Indoor games','Regular practice and inter-school chess competitions.','/assets/photos/act-chess.jpg','',COALESCE((SELECT MAX(sort_order) FROM page_items WHERE page_slug='sports-and-activities/activities'),0)+1 FROM DUAL WHERE EXISTS (SELECT 1 FROM pages WHERE slug='sports-and-activities/activities') AND NOT EXISTS (SELECT 1 FROM page_items WHERE page_slug='sports-and-activities/activities' AND title='Chess');
INSERT INTO page_items (page_slug, title, subtitle, description, image_url, file_url, sort_order) SELECT 'sports-and-activities/activities','Annual Day','Stage','Dance, drama and music in front of the whole school community.','/assets/photos/act-annualday.jpg','',COALESCE((SELECT MAX(sort_order) FROM page_items WHERE page_slug='sports-and-activities/activities'),0)+1 FROM DUAL WHERE EXISTS (SELECT 1 FROM pages WHERE slug='sports-and-activities/activities') AND NOT EXISTS (SELECT 1 FROM page_items WHERE page_slug='sports-and-activities/activities' AND title='Annual Day');
INSERT INTO page_items (page_slug, title, subtitle, description, image_url, file_url, sort_order) SELECT 'sports-and-activities/activities','Festival Celebrations','Culture','Costume days, dandiya, rangoli and festivals celebrated together.','/assets/photos/act-festival.jpg','',COALESCE((SELECT MAX(sort_order) FROM page_items WHERE page_slug='sports-and-activities/activities'),0)+1 FROM DUAL WHERE EXISTS (SELECT 1 FROM pages WHERE slug='sports-and-activities/activities') AND NOT EXISTS (SELECT 1 FROM page_items WHERE page_slug='sports-and-activities/activities' AND title='Festival Celebrations');
INSERT INTO page_items (page_slug, title, subtitle, description, image_url, file_url, sort_order) SELECT 'sports-and-activities/activities','Republic Day','National pride','Tricolour performances and a flag hoisting that students look forward to.','/assets/photos/act-republic.jpg','',COALESCE((SELECT MAX(sort_order) FROM page_items WHERE page_slug='sports-and-activities/activities'),0)+1 FROM DUAL WHERE EXISTS (SELECT 1 FROM pages WHERE slug='sports-and-activities/activities') AND NOT EXISTS (SELECT 1 FROM page_items WHERE page_slug='sports-and-activities/activities' AND title='Republic Day');
