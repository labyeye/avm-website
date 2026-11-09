import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Download, Eye, FileText, Maximize2, User, X } from "lucide-react";
import SiteLayout from "../../components/public/SiteLayout";
import RichText from "../../components/public/RichText";
import ContactSection from "../../components/public/ContactSection";
import AdmissionForm from "../../components/public/AdmissionForm";
import Reveal from "../../components/public/Reveal";
import WhyAVM from "../../components/public/WhyAVM";
import FacilityTabs from "../../components/public/FacilityTabs";
import Testimonials, { youtubeId } from "../../components/public/Testimonials";
import ZoomImage, { Lightbox } from "../../components/public/ZoomImage";
import { NAV } from "../../api/navConfig";
import { getPage, downloadPageUrl } from "../../api/public";
import { placeholder } from "../../api/assets";

// Grid cells enter from the left / below / right by column, staggered.
const FROM = ["left", "up", "right"];
const stagger = (i) => ({
  from: FROM[i % 3],
  delay: (i % 3) * 90,
  distance: 90,
});

const imgFallback = (w, h, t) => (e) => {
  e.currentTarget.onerror = null;
  e.currentTarget.src = placeholder(w, h, t, "16346b");
};

function Cards({ items }) {
  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it, i) => (
        <Reveal key={it.id} {...stagger(i)}>
          <article className="lift h-full overflow-hidden rounded-2xl bg-white/10">
            {it.image_url && (
              <ZoomImage
                src={it.image_url}
                alt={it.title}
                loading="lazy"
                onError={imgFallback(600, 400, it.title)}
                className="aspect-[3/2] w-full object-cover"
              />
            )}
            <div className="p-5">
              <h3 className="text-lg font-semibold">{it.title}</h3>
              {it.subtitle && (
                <p className="text-xs uppercase tracking-wide text-gold-400">
                  {it.subtitle}
                </p>
              )}
              {it.description && (
                <p className="mt-2 text-sm text-white/85">{it.description}</p>
              )}
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

// Alternating rows: text on one side, rounded image with soft shadow on the other (flips each row).
function SplitCards({ items }) {
  return (
    <div className="mt-12 space-y-14 md:space-y-20">
      {items.map((it, i) => (
        <div
          key={it.id}
          className="grid items-center gap-8 md:grid-cols-2 md:gap-14"
        >
          <div className={i % 2 ? "md:order-2" : ""}>
            <Reveal from={i % 2 ? "right" : "left"}>
              <div>
              <h3 className="text-2xl font-bold md:text-3xl">{it.title}</h3>
              {it.subtitle && (
                <p className="mt-1 text-xs uppercase tracking-wide text-gold-400">
                  {it.subtitle}
                </p>
              )}
              {it.description && (
                <p className="mt-4 text-justify leading-8 text-white/85">
                  {it.description}
                </p>
              )}
              </div>
            </Reveal>
          </div>
          <div className={i % 2 ? "md:order-1" : ""}>
            <Reveal from={i % 2 ? "left" : "right"}>
            <ZoomImage
                src={it.image_url || placeholder(600, 400, it.title, "16346b")}
              alt={it.title}
              loading="lazy"
              onError={imgFallback(600, 400, it.title)}
              className={`aspect-[3/2] w-full rounded-3xl object-cover shadow-2xl`}
              />
            </Reveal>
          </div>
        </div>
      ))}
    </div>
  );
}

function Members({ items }) {
  return (
    <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it, i) => (
        <Reveal key={it.id} {...stagger(i)}>
          <article className="lift rounded-2xl p-4 text-center">
            <ZoomImage
              src={it.image_url || placeholder(400, 400, "Photo", "16346b")}
              alt={it.title}
              loading="lazy"
              onError={imgFallback(400, 400, "Photo")}
              className="mx-auto h-40 w-40 rounded-full border-4 border-gold-500 object-cover"
            />
            <h3 className="mt-4 text-lg font-semibold">{it.title}</h3>
            {it.subtitle && (
              <p className="text-sm text-gold-400">{it.subtitle}</p>
            )}
            {it.description && (
              <p className="mt-2 text-sm text-white/85">{it.description}</p>
            )}
          </article>
        </Reveal>
      ))}
    </div>
  );
}

function Downloads({ items }) {
  return (
    <div className="mt-10 overflow-hidden rounded-2xl bg-white/10">
      <div className="grid grid-cols-[3rem_1fr_auto] gap-4 bg-white/10 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gold-400">
        <span>S.No</span>
        <span>Document</span>
        <span className="w-36 text-center">View</span>
      </div>
      {items.map((it, i) => {
        const ready = it.file_url && it.file_url !== "#";
        return (
          <Reveal key={it.id} from={i % 2 ? "right" : "left"} distance={80}>
            <div className="grid grid-cols-[3rem_1fr_auto] items-center gap-4 border-b border-white/10 px-5 py-3 transition duration-300 last:border-b-0 hover:-translate-y-0.5 hover:bg-white/10">
              <span className="text-sm text-white/70">{i + 1}</span>
              <div className="flex min-w-0 items-center gap-3">
                <FileText className="shrink-0 text-gold-400" size={18} />
                <span className="font-medium">{it.title}</span>
              </div>
              {ready ? (
                <a
                  href={it.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold w-36"
                >
                  <Eye size={16} /> Click to View
                </a>
              ) : (
                <span className="w-36 text-center text-xs text-white/50">
                  Coming soon
                </span>
              )}
            </div>
          </Reveal>
        );
      })}
      {!items.length && (
        <div className="px-5 py-8 text-center text-white/70">
          No documents available yet.
        </div>
      )}
    </div>
  );
}

// One featured person (first item): portrait + role beside the page text. Used for messages from the Principal / Founder.
function Profile({ person, image, body }) {
  // Photo: the page's own image (Header tab) wins; the Person item's photo is the fallback.
  const photo = image || person?.image_url;
  return (
    <div className={`grid gap-10 ${photo || person ? "md:grid-cols-[290px_1fr]" : ""}`}>
      {(photo || person) && (
        <Reveal from="left">
          <div className="lift rounded-2xl p-5 text-center">
            <ZoomImage
              src={photo || placeholder(400, 400, "Photo", "16346b")}
              alt={person?.title || "Photo"}
              onError={imgFallback(400, 400, "Photo")}
              className="mx-auto aspect-square w-full rounded-full object-cover object-top"
            />
            {person?.title && <h3 className="mt-4 text-lg font-semibold">{person.title}</h3>}
            {person?.subtitle && (
              <p className="text-sm text-gold-400">{person.subtitle}</p>
            )}
          </div>
        </Reveal>
      )}
      <Reveal from="right">
        <RichText text={body} className="text-[14px] text-justify" />
      </Reveal>
    </div>
  );
}


const parseGallery = (v) => {
  try {
    const a = JSON.parse(v || "[]");
    return Array.isArray(a) ? a : [];
  } catch {
    return [];
  }
};

// Masonry photo grid (CSS columns); click a photo to open it full-size.
function MasonryGallery({ urls, title }) {
  const [open, setOpen] = useState(null);
  if (!urls.length) return null;
  return (
    <div className="mt-6">
      <p className="mb-2 text-xs uppercase tracking-wide text-gold-400">Gallery</p>
      <div className="columns-2 gap-3 md:columns-3">
        {urls.map((u, i) => (
          <button key={u + i} onClick={() => setOpen(u)} className="mb-3 block w-full overflow-hidden rounded-xl">
            <img src={u} alt={`${title} photo ${i + 1}`} loading="lazy" className="w-full object-cover transition duration-300 hover:scale-105" />
          </button>
        ))}
      </div>
      {open && <Lightbox src={open} alt={title} onClose={() => setOpen(null)} />}
    </div>
  );
}

// Sports in-charge: photo + message shown above the sport cards.
function InCharge({ page }) {
  if (!page.incharge_message && !page.incharge_name) return null;
  return (
    <Reveal from="up">
      <div className="mt-2 grid items-center gap-8 rounded-2xl bg-white/10 p-6 md:grid-cols-[220px_1fr]">
        <div className="text-center">
          <ZoomImage
            src={page.incharge_photo_url || placeholder(400, 400, "Photo", "16346b")}
            alt={page.incharge_name || "In-charge"}
            onError={imgFallback(400, 400, "Photo")}
            className="mx-auto aspect-square w-48 rounded-full border-2 border-gold-500 object-cover object-top"
          />
          {page.incharge_name && <h3 className="mt-3 text-lg font-semibold">{page.incharge_name}</h3>}
          {page.incharge_role && <p className="text-xs uppercase tracking-wide text-gold-400">{page.incharge_role}</p>}
        </div>
        <RichText text={page.incharge_message} className="text-[15px]" />
      </div>
    </Reveal>
  );
}

// Achievements: photo cards with year/level badge.
function Achievements({ items }) {
  if (!items.length) return <p className="mt-10 text-center text-white/70">Achievements coming soon.</p>;
  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it, i) => (
        <Reveal key={it.id} {...stagger(i)}>
          <article className="lift h-full overflow-hidden rounded-2xl bg-white/10">
            {it.image_url && (
              <ZoomImage src={it.image_url} alt={it.title} loading="lazy" onError={imgFallback(600, 400, it.title)} className="aspect-[3/2] w-full object-cover" />
            )}
            <div className="p-5">
              {it.subtitle && <span className="inline-block rounded-full bg-gold-500 px-3 py-0.5 text-xs font-semibold text-navy-950">{it.subtitle}</span>}
              <h3 className="mt-2 text-lg font-semibold">{it.title}</h3>
              {it.description && <p className="mt-1 whitespace-pre-line text-sm text-white/80">{it.description}</p>}
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

// Sports / activities / student leadership: clickable cards that open a details modal.
function DetailModal({ item, kind, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);
  const person = kind === "leadership";
  const Row = ({ label, value, photo }) =>
    value || photo ? (
      <div className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3">
        {photo ? (
          <ZoomImage
            src={photo}
            alt={value || label}
            onError={imgFallback(200, 200, "Photo")}
            className="h-16 w-16 shrink-0 rounded-full border-2 border-gold-500 object-cover object-top"
          />
        ) : (
          <User size={18} className="shrink-0 text-gold-400" />
        )}
        <div>
          <p className="text-xs uppercase tracking-wide text-gold-400">{label}</p>
          <p className="font-semibold">{value}</p>
        </div>
      </div>
    ) : null;
  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-navy-900 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-white/10 p-2 transition hover:bg-white/25"
        >
          <X size={20} />
        </button>
        <h3 className="pr-10 text-2xl font-bold md:text-3xl">{item.title}</h3>
        {item.subtitle && <p className="mt-1 text-gold-400">{item.subtitle}</p>}

        {person ? (
          <div className="mt-5 grid gap-6 md:grid-cols-[240px_1fr]">
            <ZoomImage
              src={item.image_url || placeholder(400, 400, "Photo", "16346b")}
              alt={item.title}
              onError={imgFallback(400, 400, "Photo")}
              className="aspect-square w-full rounded-2xl object-cover object-top"
            />
            <p className="whitespace-pre-line leading-7 text-white/85">{item.description}</p>
          </div>
        ) : (
          <>
            {item.description && (
              <p className="mt-4 whitespace-pre-line leading-7 text-white/85">{item.description}</p>
            )}
            <div className="mt-5 grid gap-6 md:grid-cols-[200px_1fr]">
              {(item.captain || item.captain_photo_url) && (
                <div className="text-center">
                  <ZoomImage
                    src={item.captain_photo_url || placeholder(300, 300, "Captain", "16346b")}
                    alt={item.captain || "Captain"}
                    onError={imgFallback(300, 300, "Captain")}
                    className="mx-auto aspect-square w-40 rounded-full border-2 border-gold-500 object-cover object-top md:w-full"
                  />
                  <p className="mt-2 text-xs uppercase tracking-wide text-gold-400">Captain</p>
                  <p className="font-semibold">{item.captain}</p>
                </div>
              )}
              {(item.team_photo_url || item.image_url) && (
                <div>
                  <p className="mb-2 text-xs uppercase tracking-wide text-gold-400">Team photo</p>
                  <ZoomImage
                    src={item.team_photo_url || item.image_url}
                    alt={`${item.title} team`}
                    onError={imgFallback(900, 500, "Team photo")}
                    className="w-full rounded-2xl object-cover"
                  />
                </div>
              )}
            </div>
            {item.captain_message && (
              <blockquote className="mt-5 rounded-xl border-l-4 border-gold-500 bg-white/10 p-4">
                <p className="text-xs uppercase tracking-wide text-gold-400">Captain's message</p>
                <p className="mt-1 whitespace-pre-line italic leading-7 text-white/90">{item.captain_message}</p>
              </blockquote>
            )}
            <div className="mt-3">
              <Row label="In-charge" value={item.incharge} photo={item.incharge_photo_url} />
            </div>
            <MasonryGallery urls={parseGallery(item.gallery)} title={item.title} />
          </>
        )}
      </div>
    </div>
  );
}

function DetailCards({ items, kind }) {
  const [sel, setSel] = useState(null);
  const person = kind === "leadership";
  return (
    <>
      <div
        className={`mt-10 grid gap-6 ${person ? "grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3"}`}
      >
        {items.map((it, i) => (
          <Reveal key={it.id} {...stagger(i)}>
            <button
              onClick={() => setSel(it)}
              className="lift group block h-full w-full overflow-hidden rounded-2xl bg-white/10 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
            >
              <img
                src={it.image_url || placeholder(600, 400, it.title, "16346b")}
                alt={it.title}
                loading="lazy"
                onError={imgFallback(600, 400, it.title)}
                className={`w-full object-cover transition duration-300 group-hover:scale-105 ${person ? "aspect-square object-top" : "aspect-[3/2]"}`}
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{it.title}</h3>
                {it.subtitle && (
                  <p className="text-xs uppercase tracking-wide text-gold-400">{it.subtitle}</p>
                )}
                <p className="mt-2 text-xs text-white/60">Click for details</p>
              </div>
            </button>
          </Reveal>
        ))}
      </div>
      {!items.length && (
        <p className="mt-10 text-center text-white/70">Details coming soon.</p>
      )}
      {sel && <DetailModal item={sel} kind={kind} onClose={() => setSel(null)} />}
    </>
  );
}

// Embedded tour / video (first item's link). YouTube links are converted to embeds; other URLs (360° tours etc.) are framed as-is.
function Embed({ item }) {
  const url = item?.file_url && item.file_url !== "#" ? item.file_url : "";
  const yt = youtubeId(url);
  const src = yt ? `https://www.youtube.com/embed/${yt}` : url;
  return (
    <Reveal from="up">
      <div className="mt-8 aspect-video w-full overflow-hidden rounded-2xl bg-navy-900 shadow-2xl">
        {/^https?:\/\//.test(src) ? (
          <iframe
            src={src}
            title={item.title || "Virtual tour"}
            className="h-full w-full"
            allow="fullscreen; autoplay; xr-spatial-tracking"
            allowFullScreen
          />
        ) : (
          <div className="flex h-full items-center justify-center text-white/60">
            The virtual tour will be available soon.
          </div>
        )}
      </div>
    </Reveal>
  );
}

// Path of nav nodes leading to `path`, e.g. [About Us, Vision & Mission].
const trailTo = (nodes, path, acc = []) => {
  for (const n of nodes) {
    if (n.to === path) return [...acc, n];
    const r = n.children && trailTo(n.children, path, [...acc, n]);
    if (r) return r;
  }
  return null;
};

// Small breadcrumb above the title: Home › About Us › Vision & Mission.
function Breadcrumb({ path }) {
  const trail = trailTo(NAV, path);
  if (!trail || trail.length < 2) return null;
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-2 flex flex-wrap items-center gap-1 text-xs text-white/80"
    >
      <Link to="/" className="hover:text-gold-400">
        Home
      </Link>
      {trail.map((n, i) => (
        <span key={n.to} className="flex items-center gap-1">
          <ChevronRight size={12} />
          {i < trail.length - 1 ? (
            <Link to={n.to} className="hover:text-gold-400">
              {n.label}
            </Link>
          ) : (
            <span className="text-gold-400">{n.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export default function DynamicPage() {
  // Full path is the page slug, so nested pages like /about-us/vision-mission work.
  const slug = decodeURIComponent(useLocation().pathname).replace(
    /^\/+|\/+$/g,
    "",
  );
  const [page, setPage] = useState(null);
  const [state, setState] = useState("loading");
  const [heroZoom, setHeroZoom] = useState(false);

  useEffect(() => {
    setState("loading");
    getPage(slug)
      .then((p) => {
        setPage(p);
        setState("ok");
        document.title = `${p.title} | Adarsh Vidya Mandir`;
      })
      .catch((e) => setState(e.response?.status === 404 ? "missing" : "error"));
  }, [slug]);

  if (state !== "ok") {
    return (
      <SiteLayout>
        <div className="section min-h-[50vh] text-center text-white/80">
          {state === "loading"
            ? "Loading…"
            : state === "missing"
              ? "Page not found."
              : "Could not load this page."}
        </div>
      </SiteLayout>
    );
  }

  const L = page.layout;
  // Sports / leadership / activities pages use the banner as a large group-photo hero.
  const bigHero = ["sports", "leadership"].includes(L) && page.banner_url;
  return (
    <SiteLayout>
      <section
        className={`relative flex items-end bg-navy-900 bg-cover bg-center ${bigHero ? "h-72 md:h-[30rem]" : "h-48 md:h-64"}`}
        style={
          page.banner_url
            ? { backgroundImage: `url(${page.banner_url})` }
            : undefined
        }
      >
        <div className={`absolute inset-0 bg-gradient-to-t ${bigHero ? "from-navy-950/85 via-transparent to-transparent" : "from-navy-950/90 to-navy-950/30"}`} />
        {bigHero && (
          <button
            onClick={() => setHeroZoom(true)}
            aria-label="View full photo"
            className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium transition hover:bg-black/70"
          >
            <Maximize2 size={14} /> View photo
          </button>
        )}
        <div className="relative px-4 pb-6 md:px-10 lg:px-20">
          <Breadcrumb path={`/${slug}`} />
          <Reveal from="left" distance={160}>
            <h1 className="text-3xl font-bold md:text-5xl">{page.title}</h1>
          </Reveal>
          {page.subtitle && (
            <Reveal from="right" distance={160} delay={120}>
              <p className="mt-1 text-white/90">{page.subtitle}</p>
            </Reveal>
          )}
        </div>
      </section>

      {L === "why-avm" && <WhyAVM />}
      <div className={`section mx-auto max-w-9xl  bg-navy-700 ${L === "why-avm" ? "hidden" : ""}`}>
        {L === "profile" ? (
          <Profile person={page.items[0]} image={page.image_url} body={page.body} />
        ) : (
          <div
            className={
              page.image_url
                ? "grid items-start gap-8 md:grid-cols-[220px_1fr]"
                : ""
            }
          >
            {page.image_url && (
              <Reveal from="left">
                <div className="lift rounded-2xl bg-white p-5 shadow-xl">
                  <img
                    src={page.image_url}
                    alt={page.title}
                    onError={imgFallback(400, 400, page.title)}
                    className="mx-auto aspect-square w-full max-w-[200px] object-contain"
                  />
                </div>
              </Reveal>
            )}
            <Reveal from="right">
              <RichText text={page.body} className="max-w-1xl" />
            </Reveal>
          </div>
        )}
        {page.file_url && page.file_url !== "#" && (
          <Reveal from="up">
            <a
              href={
                /\/backend\/uploads\//.test(page.file_url)
                  ? downloadPageUrl(slug)
                  : page.file_url
              }
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold mt-8 !px-6 !py-3 text-base"
            >
              <Download size={18} /> {page.file_label || "Download PDF"}
            </a>
          </Reveal>
        )}
        {L === "embed" && <Embed item={page.items[0]} />}
        {L === "cards" &&
          (slug.startsWith("pastoral") ? (
            <SplitCards items={page.items} />
          ) : (
            <Cards items={page.items} />
          ))}
        {L === "tabs" && (
          <Reveal from="up">
            <FacilityTabs items={page.items} />
          </Reveal>
        )}
        {L === "members" && <Members items={page.items} />}
        {L === "sports" && <InCharge page={page} />}
        {L === "achievements" && <Achievements items={page.items} />}
        {(L === "sports" || L === "leadership") && (
          <DetailCards items={page.items} kind={L} />
        )}
        {L === "downloads" && <Downloads items={page.items} />}
        {L === "contact" && <ContactSection />}
      </div>
      {heroZoom && (
        <Lightbox src={page.banner_url} alt={page.title} onClose={() => setHeroZoom(false)} />
      )}
      {L === "testimonials" && <Testimonials />}
      {L === "admission" && (
        <Reveal from="left" clip>
          <AdmissionForm showHeading={false} />
        </Reveal>
      )}
    </SiteLayout>
  );
}
