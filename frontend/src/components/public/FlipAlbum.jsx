import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";

// Masonry-style collage templates on a 4-col x 6-row grid: [col, row, colSpan, rowSpan] per photo.
const T = {
  1: [[[1, 1, 4, 6]]],
  2: [[[1, 1, 4, 3], [1, 4, 4, 3]], [[1, 1, 2, 6], [3, 1, 2, 6]], [[1, 1, 4, 4], [1, 5, 4, 2]]],
  3: [
    [[1, 1, 4, 3], [1, 4, 2, 3], [3, 4, 2, 3]],
    [[1, 1, 2, 6], [3, 1, 2, 3], [3, 4, 2, 3]],
    [[1, 1, 2, 3], [3, 1, 2, 3], [1, 4, 4, 3]],
  ],
  4: [
    [[1, 1, 2, 4], [3, 1, 2, 2], [3, 3, 2, 2], [1, 5, 4, 2]],
    [[1, 1, 4, 2], [1, 3, 2, 2], [3, 3, 2, 2], [1, 5, 4, 2]],
    [[1, 1, 3, 3], [4, 1, 1, 3], [1, 4, 1, 3], [2, 4, 3, 3]],
  ],
  5: [
    [[1, 1, 2, 3], [3, 1, 2, 2], [3, 3, 2, 1], [1, 4, 2, 3], [3, 4, 2, 3]],
    [[1, 1, 4, 2], [1, 3, 1, 2], [2, 3, 3, 2], [1, 5, 2, 2], [3, 5, 2, 2]],
  ],
};

// Groups photos into pages of 2-5 with a varied layout each. Seeded so the album looks the same on every visit.
function buildCollages(photos) {
  let seed = photos.reduce((a, p) => a + Number(p.id || 0) * 7 + 13, photos.length * 31) || 1;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
  const out = [];
  let i = 0;
  while (i < photos.length) {
    const left = photos.length - i;
    let k = Math.min(left, 2 + Math.floor(rnd() * 4)); // 2..5
    if (left - k === 1) k = left; // avoid a lonely last photo when possible
    k = Math.min(k, 5);
    if (left - k === 1) k = left - 1 || 1;
    const opts = T[k];
    out.push({ kind: "collage", photos: photos.slice(i, i + k).map((p, n) => ({ ...p, gi: i + n })), layout: opts[Math.floor(rnd() * opts.length)] });
    i += k;
  }
  return out;
}

// Page-turning photo album. Cover = event poster; every photo is a page; last page is the back cover.
const STEP = 5; // photos loaded per batch

function Face({ page, side, title, subtitle, poster, allowed, onLoaded }) {
  // side: 'front' = right-hand page (spine on the left), 'back' = left-hand page (spine on the right)
  const shade = side === "front"
    ? "linear-gradient(to right, rgba(0,0,0,.28), rgba(0,0,0,0) 14%)"
    : "linear-gradient(to left, rgba(0,0,0,.28), rgba(0,0,0,0) 14%)";
  let inner;
  if (page.kind === "cover") {
    inner = (
      <div className="relative h-full w-full bg-navy-900">
        {poster && <img src={poster} alt="" draggable={false} className="absolute inset-0 h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/30" />
        <div className="absolute inset-3 rounded-sm border border-gold-400/70" />
        <div className="absolute inset-x-0 bottom-0 p-[8%] text-center">
          <p className="text-[clamp(.55rem,1.6vw,.8rem)] uppercase tracking-[.25em] text-gold-400">Photo Album</p>
          <h3 className="mt-1 text-[clamp(.9rem,3vw,1.6rem)] font-bold leading-tight text-white">{title}</h3>
          {subtitle && <p className="mt-1 text-[clamp(.55rem,1.6vw,.8rem)] text-white/80">{subtitle}</p>}
        </div>
      </div>
    );
  } else if (page.kind === "collage") {
    inner = (
      <div className="h-full w-full bg-[#fbf8f1] p-[4%]">
        <div className="grid h-full w-full gap-[1.5%]" style={{ gridTemplateColumns: "repeat(4, 1fr)", gridTemplateRows: "repeat(6, 1fr)" }}>
          {page.photos.map((ph, n) => {
            const [c, r, cs, rs] = page.layout[n];
            return (
              ph.gi < allowed ? (
                <img
                  key={ph.id}
                  src={ph.url}
                  alt={ph.caption || ""}
                  title={ph.caption || undefined}
                  draggable={false}
                  onLoad={() => onLoaded(ph.gi)}
                  onError={() => onLoaded(ph.gi)}
                  className="h-full w-full animate-pop rounded-sm object-cover shadow"
                  style={{ gridColumn: `${c} / span ${cs}`, gridRow: `${r} / span ${rs}` }}
                />
              ) : (
                <div
                  key={ph.id}
                  className="animate-pulse rounded-sm bg-slate-200"
                  style={{ gridColumn: `${c} / span ${cs}`, gridRow: `${r} / span ${rs}` }}
                />
              )
            );
          })}
        </div>
      </div>
    );
  } else if (page.kind === "end") {
    inner = (
      <div className="flex h-full w-full flex-col items-center justify-center bg-navy-900 p-4 text-center">
        <div className="absolute inset-3 rounded-sm border border-gold-400/60" />
        <p className="text-[clamp(.9rem,3vw,1.5rem)] font-bold text-gold-400">Thank You</p>
        <p className="mt-1 text-[clamp(.5rem,1.6vw,.8rem)] text-white/80">Adarsh Vidya Mandir</p>
      </div>
    );
  } else {
    inner = <div className="h-full w-full bg-[#fbf8f1]" />;
  }
  return (
    <div
      className={`absolute inset-0 overflow-hidden ${side === "front" ? "rounded-r-md" : "rounded-l-md"}`}
      style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: side === "back" ? "rotateY(180deg)" : undefined }}
    >
      {inner}
      <div className="pointer-events-none absolute inset-0" style={{ background: shade }} />
    </div>
  );
}

export default function FlipAlbum({ title, subtitle, poster, photos }) {
  const wrap = useRef(null);
  const [w, setW] = useState(320);
  const [idx, setIdx] = useState(0); // number of sheets turned
  const [full, setFull] = useState(false);
  // Progressive loading: first STEP photos, then the next STEP once those have loaded, and so on.
  const [allowed, setAllowed] = useState(STEP);
  const loaded = useRef(new Set());
  const [loadedN, setLoadedN] = useState(0);
  const onLoaded = (gi) => {
    if (!loaded.current.has(gi)) { loaded.current.add(gi); setLoadedN(loaded.current.size); }
  };

  const collages = useMemo(() => buildCollages(photos), [photos]);
  const pages = [{ kind: "cover" }, ...collages];
  if ((pages.length + 1) % 2) pages.push({ kind: "blank" }); // keep an even count incl. the end page
  pages.push({ kind: "end" });
  const sheets = pages.length / 2;

  useEffect(() => {
    if (loadedN >= allowed && allowed < photos.length) setAllowed((a) => a + STEP);
  }, [loadedN, allowed, photos.length]);

  // If the reader turns pages faster than loading, make sure the visible spread (+1 sheet ahead) is allowed.
  useEffect(() => {
    const upto = Math.min(pages.length, idx * 2 + 4);
    let need = 0;
    for (let n = 0; n < upto; n++) if (pages[n].kind === "collage") need = Math.max(need, pages[n].photos[pages[n].photos.length - 1].gi + 1);
    setAllowed((a) => (need > a ? Math.ceil(need / STEP) * STEP : a));
    // eslint-disable-next-line
  }, [idx]);

  useEffect(() => {
    const el = wrap.current;
    const ro = new ResizeObserver(() => {
      const cw = el.clientWidth;
      const ch = el.clientHeight;
      // Fit two pages (aspect 3:4) into the box; fullscreen also limits by height.
      const byW = (cw - 16) / 2;
      const byH = full ? (ch - 90) / 1.35 : Infinity;
      setW(Math.max(120, Math.min(420, byW, byH)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [full]);

  useEffect(() => {
    const on = () => setFull(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", on);
    return () => document.removeEventListener("fullscreenchange", on);
  }, []);

  const go = (d) => setIdx((i) => Math.min(sheets, Math.max(0, i + d)));
  const h = w * 1.35;
  const shift = idx === 0 ? -w / 2 : idx === sheets ? w / 2 : 0;
  let startX = null;

  const toggleFull = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else wrap.current?.requestFullscreen?.();
  };

  return (
    <div
      ref={wrap}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); }}
      className={`relative flex select-none flex-col items-center justify-center rounded-2xl outline-none ${full ? "h-screen bg-navy-950 p-4" : "bg-gradient-to-b from-navy-800 to-navy-950 py-8"}`}
    >
      <button
        onClick={toggleFull}
        className="absolute right-3 top-3 z-[200] rounded-full bg-white/10 p-2 text-white transition hover:bg-white/25"
        aria-label={full ? "Exit full screen" : "Full screen"}
      >
        {full ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
      </button>

      <div style={{ perspective: w * 5 }}>
        <div
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            go(e.clientX < r.left + r.width / 2 ? -1 : 1);
          }}
          onTouchStart={(e) => (startX = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (startX === null) return;
            const dx = e.changedTouches[0].clientX - startX;
            if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
            startX = null;
          }}
          className="relative cursor-pointer"
          style={{
            width: w * 2,
            height: h,
            transform: `translateX(${shift}px)`,
            transition: "transform .9s cubic-bezier(.4,.1,.2,1)",
            filter: "drop-shadow(0 25px 35px rgba(0,0,0,.55))",
          }}
        >
          {Array.from({ length: sheets }, (_, i) => {
            const flipped = i < idx;
            return (
              <div
                key={i}
                className="absolute top-0"
                style={{
                  left: w,
                  width: w,
                  height: h,
                  transformOrigin: "left center",
                  transformStyle: "preserve-3d",
                  transform: flipped ? "rotateY(-180deg)" : "rotateY(0deg)",
                  zIndex: flipped ? i + 1 : sheets - i,
                  transition: "transform 1s cubic-bezier(.45,.05,.25,1), z-index 0s linear .5s",
                }}
              >
                <Face page={pages[2 * i]} side="front" title={title} subtitle={subtitle} poster={poster} allowed={allowed} onLoaded={onLoaded} />
                <Face page={pages[2 * i + 1]} side="back" title={title} subtitle={subtitle} poster={poster} allowed={allowed} onLoaded={onLoaded} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4 text-white">
        <button onClick={() => go(-1)} disabled={idx === 0} className="rounded-full bg-white/10 p-2.5 transition hover:bg-white/25 disabled:opacity-30" aria-label="Previous page"><ChevronLeft size={20} /></button>
        <span className="min-w-[7rem] text-center text-sm text-white/80">
          {idx === 0 ? "Cover" : idx === sheets ? "The End" : `Page ${idx * 2} – ${idx * 2 + 1}`}
        </span>
        <button onClick={() => go(1)} disabled={idx === sheets} className="rounded-full bg-white/10 p-2.5 transition hover:bg-white/25 disabled:opacity-30" aria-label="Next page"><ChevronRight size={20} /></button>
      </div>
      <p className="mt-2 text-xs text-white/50">Click the page edges, swipe or use ← → keys to turn pages</p>
    </div>
  );
}
