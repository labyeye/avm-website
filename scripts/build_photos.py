#!/usr/bin/env python3
"""Builds web-sized photos from the school's original folder into frontend/public/assets/photos/.
Usage: python3 scripts/build_photos.py "<path to AVM Sikandarpur folder>"
Each entry: output name -> (folder, index in sorted folder listing, mode, size, focus, crop_bottom)
  cover: crop to the exact w x h shape around `focus` (fx, fy in 0..1); fit: keep shape, longest side = size.
"""
import os, sys
from PIL import Image, ImageOps
Image.MAX_IMAGE_PIXELS = None

SRC = os.path.expanduser(sys.argv[1] if len(sys.argv) > 1 else "~/Desktop/AVM Sikandarpur")
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "frontend", "public", "assets", "photos")
os.makedirs(OUT, exist_ok=True)
WM = 0.10  # bottom strip carrying the phone-camera watermark on the Class Room photos

HERO, BANNER, CARD, SQ = (1920, 1080), (1920, 500), (900, 600), (800, 800)
P = {
  # hero slides
  "hero-campus":      ("Annual Function 2024", 5, "cover", HERO, (0.5, 0.0), 0.36),
  "hero-culture":     ("Republic Day", 36, "cover", HERO, (0.5, 0.0), 0),
  "hero-annualday":   ("Annual Function 2024", 325, "cover", HERO, (0.5, 0.55), 0),
  # section background
  "why-bg":           ("Annual Function 2024", 4, "cover", HERO, (0.6, 0.3), 0),
  # page banners
  "banner-about":     ("Annual Function 2024", 5, "cover", BANNER, (0.5, 0.22), 0),
  "banner-academics": ("Class Room", 22, "cover", BANNER, (0.5, 0.6), WM),
  "banner-governing": ("Opening", 56, "cover", BANNER, (0.5, 0.78), 0),
  "banner-sports":    ("Festival", 14, "cover", BANNER, (0.5, 0.5), 0),
  "banner-downloads": ("Annual Function 2024", 4, "cover", BANNER, (0.6, 0.3), 0),
  "banner-pastoral":  ("Festival", 87, "cover", BANNER, (0.5, 0.55), 0),
  "banner-disclosure":("Annual Function 2024", 7, "cover", BANNER, (0.5, 0.25), 0),
  "banner-contact":   ("Opening", 0, "cover", BANNER, (0.5, 0.35), 0),
  "banner-alumni":    ("Festival", 65, "cover", BANNER, (0.5, 0.5), 0),
  "banner-admission": ("Republic Day", 4, "cover", BANNER, (0.5, 0.5), 0),
  # beside-text images (square)
  "about-avm":        ("Annual Function 2024", 5, "cover", SQ, (0.5, 0.0), 0.3),
  "pastoral-overview":("Morning Prayer", 1, "cover", (400, 400), (0.5, 0.5), 0),
  # admission form side photo
  "admission-form-bg":("Festival", 117, "cover", (1000, 800), (0.5, 0.5), 0),
  # curriculum cards
  "cur-preprimary":   ("Class Room", 14, "cover", CARD, (0.5, 0.5), WM),
  "cur-primary":      ("Class Room", 9, "cover", CARD, (0.5, 0.5), WM),
  "cur-middle":       ("Class Room", 20, "cover", CARD, (0.5, 0.5), WM),
  "cur-secondary":    ("Class Room", 22, "cover", CARD, (0.5, 0.5), WM),
  "cur-senior":       ("Class Room", 26, "cover", CARD, (0.5, 0.5), WM),
  # approach-to-learning cards
  "learn-experiential":("Festival", 40, "cover", CARD, (0.5, 0.5), 0),
  "learn-thinking":   ("Chess", 1, "cover", CARD, (0.5, 0.5), 0),
  "learn-tech":       ("PTM 2025-26", 26, "cover", CARD, (0.5, 0.5), 0),
  "learn-assessment": ("PTM 2025-26", 3, "cover", CARD, (0.5, 0.5), 0),
  # leadership + activities cards
  "lead-council":     ("Republic Day", 7, "cover", CARD, (0.5, 0.5), 0),
  "lead-houses":      ("Festival", 87, "cover", CARD, (0.5, 0.5), 0),
  "lead-clubs":       ("Republic Day", 4, "cover", CARD, (0.5, 0.45), 0),
  "act-dance":        ("Republic Day", 25, "cover", CARD, (0.5, 0.5), 0),
  "act-chess":        ("Chess", 1, "cover", CARD, (0.5, 0.5), 0),
  "act-annualday":    ("Annual Function 2024", 23, "cover", CARD, (0.5, 0.5), 0),
  "act-festival":     ("Festival", 72, "cover", CARD, (0.5, 0.35), 0),
  "act-republic":     ("Republic Day", 36, "cover", CARD, (0.5, 0.4), 0),
  "act-craft":        ("Festival", 40, "cover", CARD, (0.5, 0.5), 0),
  # facilities
  "fac-classroom":    ("Class Room", 0, "cover", (1200, 800), (0.5, 0.5), WM),
  "fac-smart":        ("PTM 2025-26", 26, "cover", (1200, 800), (0.5, 0.5), 0),
  "fac-library":      ("Class Room", 3, "cover", (1200, 800), (0.5, 0.5), WM),
  "fac-ground":       ("Festival", 14, "cover", (1200, 800), (0.5, 0.5), 0),
  "fac-chess":        ("Chess", 1, "cover", (1200, 800), (0.5, 0.5), 0),
  "fac-stage":        ("Annual Function 2024", 17, "cover", (1200, 800), (0.5, 0.5), 0),
}
# gallery: keep each photo's own shape (portrait stays portrait) so the masonry grid has variety
G = [
  ("gal-republic-day", "Republic Day", 36, "Republic Day celebrations"),
  ("gal-human-pyramid", "Annual Function 2024", 325, "Annual Day 2024"),
  ("gal-steps-group", "Festival", 65, "Celebration on the steps"),
  ("gal-costume-day", "Festival", 72, "Costume day"),
  ("gal-rangoli", "Festival", 117, "Flower rangoli"),
  ("gal-chess", "Chess", 1, "Chess competition"),
  ("gal-classroom", "Class Room", 22, "In the classroom"),
  ("gal-early-years", "Class Room", 14, "Early years classroom"),
  ("gal-dandiya-teachers", "Festival", 1, "Dandiya celebration"),
  ("gal-dandiya-kids", "Festival", 30, "Dandiya with the little ones"),
  ("gal-pineapple", "Festival", 80, "Fancy dress"),
  ("gal-dance-portrait", "Republic Day", 18, "Cultural programme"),
  ("gal-dance-group", "Republic Day", 4, "Tricolour dance"),
  ("gal-annualday-pink", "Annual Function 2024", 23, "Annual Day performance"),
  ("gal-annualday-orange", "Annual Function 2024", 57, "Annual Day performance"),
  ("gal-annualday-stage", "Annual Function 2024", 170, "Annual Day 2024"),
  ("gal-inauguration", "Opening", 56, "Inauguration of the new building"),
  ("gal-teachers", "PTM 2024-25", 0, "Our teachers"),
  ("gal-christmas", "Festival", 36, "Christmas celebration"),
  ("gal-staff-students", "Festival", 87, "Teachers and students together"),
  ("gal-campus", "Annual Function 2024", 4, "Our campus"),
  ("gal-garba-ground", "Festival", 14, "Garba on the ground"),
  ("gal-rangoli-portrait", "Festival", 108, "Rangoli in the classroom"),
  ("gal-craft-kids", "Festival", 63, "Craft time"),
  ("gal-bhumi-pujan", "Bhumi Pujan", 0, "Bhumi Pujan — where it began"),
]

def listing(folder):
    d = os.path.join(SRC, folder)
    return sorted(f for f in os.listdir(d) if f.lower().endswith((".jpg", ".jpeg", ".png")))

def load(folder, idx, crop_bottom):
    im = ImageOps.exif_transpose(Image.open(os.path.join(SRC, folder, listing(folder)[idx]))).convert("RGB")
    if crop_bottom:
        im = im.crop((0, 0, im.width, int(im.height * (1 - crop_bottom))))
    return im

def cover(im, size, focus):
    w, h = size
    ratio = w / h
    if im.width / im.height > ratio:            # too wide → trim sides
        nw = int(im.height * ratio); x = int((im.width - nw) * focus[0]); box = (x, 0, x + nw, im.height)
    else:                                       # too tall → trim top/bottom
        nh = int(im.width / ratio); y = int((im.height - nh) * focus[1]); box = (0, y, im.width, y + nh)
    return im.crop(box).resize(size, Image.LANCZOS) if im.width >= w else im.crop(box)

def save(im, name, q=82):
    path = os.path.join(OUT, name + ".jpg")
    im.save(path, "JPEG", quality=q, optimize=True, progressive=True)
    return os.path.getsize(path)

total = 0
for name, (folder, idx, mode, size, focus, cb) in P.items():
    total += save(cover(load(folder, idx, cb), size, focus), name)
for name, folder, idx, _ in G:
    im = load(folder, idx, WM if folder == "Class Room" else 0)
    im.thumbnail((1400, 1400), Image.LANCZOS)
    total += save(im, name)
print(f"{len(P) + len(G)} photos, {total / 1e6:.1f} MB -> {os.path.abspath(OUT)}")
