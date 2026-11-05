#!/usr/bin/env python3
"""Generates backend/migrations/003_nav_pages.sql: one CMS page (+ starter items) per navbar entry.
Re-runnable: pages use ON DUPLICATE KEY, items are only inserted for pages that have none."""
import os

q = lambda s: s.replace("\\", "\\\\").replace("'", "''")
ph = lambda w, h, t, bg="16346b": f"https://placehold.co/{w}x{h}/{bg}/white?text=" + t.replace(" ", "+").replace("&", "%26")
banner = lambda t: ph(1920, 500, t)
P = []  # (slug, title, subtitle, layout, body, items)
def page(slug, title, subtitle, layout, body, items=(), image="", file_label=""):
    P.append((slug, title, subtitle, layout, body, list(items), image, file_label))
person = lambda name, role, desc="": (name, role, desc, ph(400, 400, "Photo"), "", 0)
card = lambda title, sub, desc, w=600, h=400: (title, sub, desc, ph(w, h, title), "", 0)
doc = lambda title, sub="Document": (title, sub, "", "", "#", 0)

# ---- About Us ----
page("about-us/about-avm", "About AVM", "Adarsh Vidya Mandir, Muzaffarpur", "text",
 "Adarsh Vidya Mandir (AVM), Muzaffarpur, Bihar, is a CBSE-affiliated school established in 1966.\n\n## Our Story\n\nFor decades AVM has nurtured young minds through quality education, strong values and all-round development.\n\n## Our Campus\n\nA lush green campus with well-equipped classrooms, laboratories, a library and playgrounds gives every child room to learn and grow.")
page("about-us/vision-mission", "Vision & Mission", "What guides us", "text",
 "## Our Vision\n\nTo nurture confident, compassionate and capable citizens who lead with integrity and serve society.\n\n## Our Mission\n\nTo provide a balanced, values-based education that develops the mind, body and spirit of every child, in a safe and supportive environment.\n\n## Our Motto\n\nविद्या ददाति विनयम् — Knowledge brings humility.")
page("about-us/principals-welcome", "Principal's Welcome", "A message from our Principal", "profile",
 "Welcome to Adarsh Vidya Mandir.\n\nAt AVM we believe every child is unique and capable of greatness. Our teachers work closely with students and parents to build knowledge, character and confidence.\n\nI invite you to explore our website and visit our campus to experience the AVM spirit first-hand.",
 [person("Principal", "Principal, Adarsh Vidya Mandir")])
page("about-us/virtual-tour", "Virtual Tour", "Explore our campus from anywhere", "embed",
 "Take a walk through our classrooms, laboratories, library and playgrounds.",
 [("Campus Virtual Tour", "", "", "", "", 0)])
page("about-us/testimonials", "Testimonials", "What parents say about AVM", "testimonials",
 "Hear from parents who trust AVM in shaping their children's future.")

# ---- Academics ----
page("academics/curriculum", "Curriculum", "CBSE curriculum from Nursery to Class 12", "cards",
 "Adarsh Vidya Mandir is affiliated to the Central Board of Secondary Education (CBSE), New Delhi.\n\nWe purely follow the curriculum, syllabus, examination pattern and instructions issued by CBSE, with a focus on conceptual understanding, application and continuous assessment.\n\n## Our Stages\n\nFrom Nursery to Class 12, each stage builds on the last so that students are well prepared for the CBSE board examinations and beyond.",
 [card("Pre-Primary", "Nursery – UKG", "Play-based, activity-led learning that builds curiosity and early skills."),
  card("Primary", "Classes 1 – 5", "Strong foundations in language, mathematics, environmental studies and the arts."),
  card("Middle School", "Classes 6 – 8", "Concept-driven teaching with projects, labs and language enrichment."),
  card("Secondary", "Classes 9 – 10", "Structured preparation for the CBSE Class 10 board examination."),
  card("Senior Secondary", "Classes 11 – 12", "Science, Commerce and Humanities streams with career guidance.")],
 image="/assets/cbse_logo.webp", file_label="Download Curriculum (PDF)")
page("academics/approach-to-learning", "Approach to Learning", "Learning that goes beyond textbooks", "cards",
 "Our teaching encourages students to ask questions, think critically and apply what they learn.",
 [card("Experiential Learning", "Learn by doing", "Experiments, projects, field visits and presentations make ideas real."),
  card("Critical Thinking", "Ask why", "Discussion and problem-solving build reasoning and independent thought."),
  card("Technology in the Classroom", "Smart learning", "Digital tools support, but never replace, great teaching."),
  card("Continuous Assessment", "Growth over grades", "Regular feedback helps every student improve at their own pace.")])

page("academics/facilities", "Facilities", "Spaces built for learning", "tabs",
 "Explore the spaces where our students learn, play and perform. Select a tab to see each facility.",
 [("Classrooms", "", "Bright, well-ventilated classrooms with comfortable furniture, designed for focused learning and easy interaction between teachers and students.", "/assets/photos/fac-classroom.jpg", "", 0),
  ("Smart Classrooms", "", "Interactive digital panels bring lessons to life with visuals, videos and hands-on activities.", "/assets/photos/fac-smart.jpg", "", 0),
  ("Library", "", "A quiet reading room stocked with story books, reference books and magazines to build the reading habit.", "/assets/photos/fac-library.jpg", "", 0),
  ("Science Laboratory", "", "Laboratory space where students learn Physics, Chemistry and Biology by doing. (Photo coming soon.)", ph(1200, 800, "Science Laboratory"), "", 0),
  ("Computer Laboratory", "", "Computer lab where students build digital skills and learn to use technology responsibly. (Photo coming soon.)", ph(1200, 800, "Computer Laboratory"), "", 0),
  ("Playground", "", "Open grounds for morning assembly, sports and festival celebrations.", "/assets/photos/fac-ground.jpg", "", 0),
  ("Indoor Games & Chess", "", "A dedicated hall for chess and other indoor games, with regular practice and inter-school competitions.", "/assets/photos/fac-chess.jpg", "", 0),
  ("Art & Music Room", "", "A creative space for art, craft, music and dance. (Photo coming soon.)", ph(1200, 800, "Art & Music Room"), "", 0),
  ("Amphitheatre & Stage", "", "Open-air stone steps and a stage that host the Annual Day, Republic Day and cultural programmes.", "/assets/photos/fac-stage.jpg", "", 0)])

# ---- Governing Body ----
page("governing-body/founders-message", "Founder's Message", "In the words of our Founder", "profile",
 "Adarsh Vidya Mandir was founded on the belief that education is the surest path to a better society.\n\nOur aim has always been to give children a strong foundation of knowledge and values, so that they grow into responsible citizens.\n\nI thank every parent, teacher and student who has been part of this journey.",
 [person("Founder", "Founder, Adarsh Vidya Mandir")])
page("governing-body/board-of-governors", "Board of Governors", "Guiding the school's vision", "members",
 "The Board of Governors provides vision, oversight and support to the school community.",
 [person("President", "President"), person("Secretary", "Secretary"), person("Treasurer", "Treasurer"), person("Member", "Board Member"), person("Principal", "Principal (Ex-officio)")])
page("governing-body/about-president", "About President", "Meet our President", "profile",
 "Our President has led the governing body with a steady commitment to academic excellence and strong values.\n\nUnder this guidance the school continues to grow in facilities, learning and community.",
 [person("President", "President, Governing Body")])

# ---- Sports & Activities ----
page("sports-and-activities/sports-overview", "Sports Overview", "Building fitness, teamwork and spirit", "text",
 "Sport is an essential part of life at AVM. Students take part in cricket, football, athletics, badminton, kabaddi and more.\n\n## Facilities\n\nOur playgrounds and indoor spaces support regular training, house matches and inter-school tournaments.\n\n## Why Sport Matters\n\nSport teaches discipline, resilience, leadership and the joy of playing as a team.")
page("sports-and-activities/student-leadership", "Student Leadership", "Developing tomorrow's leaders", "cards",
 "Students take on real responsibility through councils, houses and clubs.",
 [card("Student Council", "Elected leaders", "Head Boy, Head Girl and prefects represent their peers."),
  card("House Captains", "Leading by example", "Each house is led by captains who organise events and teams."),
  card("Club Leaders", "Passion projects", "Students run clubs in science, arts, literature and community service.")])
page("sports-and-activities/activities", "Activities", "Beyond the classroom", "cards",
 "From the stage to the laboratory, AVM students discover their talents.",
 [card("Music & Dance", "Performing arts", "Classical and contemporary music and dance training."),
  card("Art & Craft", "Creativity", "Painting, sketching and craft that give imagination a canvas."),
  card("Science Club", "Curiosity", "Hands-on experiments and exhibitions."),
  card("Debate & Quiz", "Communication", "Public speaking, debates and inter-school quizzes."),
  card("Community Service", "Giving back", "Drives and visits that teach empathy and responsibility.")])

# ---- Downloads ----
dl = lambda slug, title, sub, intro, docs: page(f"downloads/{slug}", title, sub, "downloads", intro, [doc(d) for d in docs])
dl("annual-calendar", "Annual Calendar 2026-2027", "Key dates for the session", "Download the academic calendar for the session.", ["Annual Calendar 2026-2027"])
dl("e-brochure", "E-Brochure", "Know AVM at a glance", "Download our school brochure.", ["AVM E-Brochure"])
dl("yearbook-2025-2026", "Yearbook 2025-2026", "A year in pictures", "Relive the year through our yearbook.", ["Yearbook 2025-2026"])
dl("old-year-books", "Old Year Books", "Memories from past years", "Browse yearbooks from earlier sessions.", ["Yearbook 2024-2025", "Yearbook 2023-2024", "Yearbook 2022-2023"])
dl("newsletter", "Newsletter", "News from the AVM community", "Read our latest newsletters.", ["Newsletter — Latest Issue"])
dl("results", "Results", "Academic results", "Board and class results are published here.", ["Class 10 Board Results", "Class 12 Board Results"])
dl("transfer-certificate", "Transfer Certificate", "TC information and forms", "Download the forms needed to request a Transfer Certificate.", ["Transfer Certificate Request Form"])

# ---- Pastoral ----
page("pastoral/overview", "Pastoral Overview", "Caring for every child", "text",
 "Pastoral care at AVM ensures that every student feels safe, heard and supported.\n\n## Our Approach\n\nClass teachers, house masters and counsellors work together to look after each child's wellbeing, behaviour and progress.\n\n## Support for Students\n\nStudents can speak to a trusted adult at any time, and parents are kept closely informed.")
page("pastoral/house-system", "House System", "Four houses, one AVM family", "cards",
 "Every student belongs to a house. Houses compete in sports, arts and academics, building teamwork, loyalty and friendly rivalry.",
 [card("Knowledge House", "House", "Curious minds who love to learn."),
  card("Wonder House", "House", "Imaginative thinkers who explore and create."),
  card("Intelligent House", "House", "Sharp, analytical and always ready to solve."),
  card("Confidence House", "House", "Bold leaders who stand tall and speak up.")])
for h, tag in [("knowledge-house", "Knowledge House"), ("wonder-house", "Wonder House"), ("intelligent-house", "Intelligent House"), ("confidence-house", "Confidence House")]:
    page(f"pastoral/house-system/{h}", tag, "Our house", "members",
     f"Welcome to {tag}. Members of the house take part in inter-house competitions in sports, arts and academics throughout the year.",
     [person("House Master", f"{tag} — House Master"), person("House Captain", f"{tag} — Captain"), person("Vice Captain", f"{tag} — Vice Captain")])

# ---- Admission ----
page("admission/procedure", "Admission Procedure", "How to apply to AVM", "text",
 "## Step 1 — Enquiry\n\nFill in the enquiry form or visit the school office.\n\n## Step 2 — Registration\n\nComplete the registration form and submit the required documents.\n\n## Step 3 — Interaction\n\nThe child and parents meet our admissions team.\n\n## Step 4 — Confirmation\n\nOn selection, complete the fee payment to confirm the seat.\n\n## Documents Required\n\nBirth certificate, previous school report card and transfer certificate (where applicable), passport-size photographs and address proof.")
page("admission/online-registration", "Online Registration", "Register your child online", "admission",
 "Complete the form below to register your interest. Our admissions team will contact you with the next steps.")
page("admission/fee-structure", "Fee Structure", "Fees for the current session", "downloads",
 "Download the fee structure for the current session.", [doc("Fee Structure", "Fees")])
page("admission/scholarships-and-bursaries", "Scholarships and Bursaries", "Supporting deserving students", "text",
 "AVM believes that no deserving child should miss out on a good education.\n\n## Scholarships\n\nMerit scholarships recognise outstanding academic and co-curricular achievement.\n\n## Bursaries\n\nFinancial assistance is available for families who need support. Please contact the school office for details and eligibility.")

# ---- Contact Us ----
page("contact-us/enquire-now", "Enquire Now", "Send us your questions", "contact",
 "Have a question about admissions, fees or the school? Send us a message and we'll reply shortly.")
page("contact-us/apply-now", "Apply Now", "Start your child's application", "admission",
 "Ready to join the AVM family? Fill in the form below and our admissions team will be in touch.")

out = ["-- Generated by scripts/gen_nav_pages.py — one CMS page per navbar entry. Safe to re-run.",
       "-- Usage: mysql -u root -p < backend/migrations/003_nav_pages.sql", "USE avm_website;", ""]
for slug, title, sub, layout, body, items, image, file_label in P:
    out.append(f"INSERT INTO pages (slug, title, subtitle, banner_url, image_url, file_label, body, layout) VALUES ('{q(slug)}','{q(title)}','{q(sub)}','{q(banner(title))}','{q(image)}','{q(file_label)}','{q(body)}','{layout}') ON DUPLICATE KEY UPDATE slug = slug;")
    if items:
        sel = " UNION ALL ".join(
            (f"SELECT '{q(slug)}' AS page_slug,'{q(t)}' AS title,'{q(st)}' AS subtitle,'{q(d)}' AS description,'{q(img)}' AS image_url,'{q(f)}' AS file_url,{i} AS sort_order" if i == 1
             else f"SELECT '{q(slug)}','{q(t)}','{q(st)}','{q(d)}','{q(img)}','{q(f)}',{i}")
            for i, (t, st, d, img, f, _) in enumerate(items, 1))
        out.append(f"INSERT INTO page_items (page_slug, title, subtitle, description, image_url, file_url, sort_order) SELECT * FROM ({sel}) seed WHERE NOT EXISTS (SELECT 1 FROM page_items WHERE page_slug = '{q(slug)}');")
root = os.path.join(os.path.dirname(__file__), "..")
sql = "\n".join(out) + "\n"
open(os.path.join(root, "backend/migrations/003_nav_pages.sql"), "w").write(sql)
print(len(P), "pages")
