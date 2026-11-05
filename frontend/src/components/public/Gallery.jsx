import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { getGallery } from '../../api/public';
import { placeholder } from '../../api/assets';

const HEIGHTS = { compact: 480, medium: 640, tall: 800 };
const FADE = 'linear-gradient(to bottom, transparent, #000 14%, #000 86%, transparent)';

function useColumns(desktop) {
  const calc = () => (typeof window === 'undefined' ? desktop : window.innerWidth >= 1024 ? desktop : window.innerWidth >= 640 ? Math.min(3, desktop) : 2);
  const [n, setN] = useState(calc);
  useEffect(() => {
    const on = () => setN(calc());
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
    // eslint-disable-next-line
  }, [desktop]);
  return n;
}

// One auto-scrolling column: repeats its tiles enough times to always fill the box, so the loop never shows a gap.
function ScrollColumn({ renderTiles, boxHeight, reverse, speed }) {
  const first = useRef(null);
  const [h, setH] = useState(0);

  useLayoutEffect(() => {
    const el = first.current;
    if (!el) return;
    const measure = () => setH(el.offsetHeight > 80 ? el.offsetHeight : 0); // ignore the collapsed (images not yet loaded) height
    measure();
    const ro = new ResizeObserver(measure); // images load later and change the height
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const copies = h ? Math.min(8, Math.max(2, Math.ceil(boxHeight / h) + 1)) : 2;
  const style = h
    ? { '--shift': `-${h}px`, animation: `colShift ${Math.max(14, h / speed)}s linear infinite ${reverse ? 'reverse' : 'normal'}` }
    : undefined;

  return (
    <div className="hover:[animation-play-state:paused]" style={style}>
      {Array.from({ length: copies }, (_, c) => (
        <div key={c} ref={c === 0 ? first : undefined} className="flex flex-col gap-3 pb-3">
          {renderTiles(c ? `-dup${c}` : '')}
        </div>
      ))}
    </div>
  );
}

const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Masonry gallery. Layout options (columns, auto-scroll, height) come from site settings (Admin → Home Page → Gallery).
export default function Gallery({ heading, subheading, columns = '4', scroll = 'true', height = 'medium' }) {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(null);
  const wanted = Math.min(6, Math.max(2, parseInt(columns, 10) || 4));
  const responsive = useColumns(wanted);
  const cols = Math.max(1, Math.min(responsive, items.length || wanted));

  useEffect(() => {
    getGallery().then(setItems).catch(() => setItems([]));
  }, []);

  useEffect(() => {
    if (!active) return;
    const onKey = (e) => e.key === 'Escape' && setActive(null);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [active]);

  // Round-robin so columns stay balanced while keeping the admin's sort order reading left-to-right.
  const columnsData = useMemo(() => {
    const out = Array.from({ length: cols }, () => []);
    items.forEach((it, i) => out[i % cols].push(it));
    return out;
  }, [items, cols]);

  const animate = scroll !== 'false' && !prefersReducedMotion() && items.length >= 2;
  const boxHeight = Math.min(HEIGHTS[height] || HEIGHTS.medium, typeof window !== 'undefined' ? window.innerHeight * 0.85 : 640);

  const onErr = (e) => { e.currentTarget.onerror = null; e.currentTarget.src = placeholder(400, 300, 'AVM Photo'); };

  const tile = (it, suffix = '') => (
    <button
      key={`${it.id}${suffix}`}
      onClick={() => setActive(it)}
      className="group relative block w-full overflow-hidden bg-navy-900 shadow-lg"
      aria-hidden={suffix ? 'true' : undefined}
      tabIndex={suffix ? -1 : 0}
    >
      <img src={it.image_url} alt={suffix ? '' : it.caption || 'AVM photo'} loading={suffix ? 'lazy' : 'eager'} onError={onErr} className="block h-auto min-h-[8rem] w-full bg-navy-900 object-cover transition duration-500 group-hover:scale-105" />
      {it.caption && (
        <span className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/80 to-transparent p-3 text-left text-xs transition group-hover:translate-y-0">{it.caption}</span>
      )}
    </button>
  );

  return (
    <section id="gallery" className="section scroll-mt-20 bg-navy-700">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-3xl font-medium">{heading || 'Life at AVM'}</h2>
        <p className="mb-8 mt-1 text-white/90">{subheading || 'Where learning, friendship, and growth come together.'}</p>

        <div
          className="relative overflow-hidden"
          style={animate ? { height: boxHeight, WebkitMaskImage: FADE, maskImage: FADE } : undefined}
        >
          <div className="flex gap-3">
            {columnsData.map((col, ci) => (
              <div key={ci} className="min-w-0 flex-1">
                {animate ? (
                  <ScrollColumn
                    boxHeight={boxHeight}
                    reverse={ci % 2 === 1}
                    speed={26 + (ci % 3) * 6}
                    renderTiles={(suffix) => col.map((it) => tile(it, suffix))}
                  />
                ) : (
                  <div className="flex flex-col gap-3">{col.map((it) => tile(it))}</div>
                )}
              </div>
            ))}
          </div>
          {animate && (
            <>
              <div className="pointer-events-none absolute inset-x-0 top-0 h-24 backdrop-blur-sm" style={{ WebkitMaskImage: 'linear-gradient(to bottom, #000, transparent)', maskImage: 'linear-gradient(to bottom, #000, transparent)' }} />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 backdrop-blur-sm" style={{ WebkitMaskImage: 'linear-gradient(to top, #000, transparent)', maskImage: 'linear-gradient(to top, #000, transparent)' }} />
            </>
          )}
        </div>
      </div>

      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4" onClick={() => setActive(null)} role="dialog" aria-modal="true">
          <button className="absolute right-4 top-4 text-white" onClick={() => setActive(null)} aria-label="Close"><X size={30} /></button>
          <figure onClick={(e) => e.stopPropagation()} className="max-h-full max-w-4xl">
            <img src={active.image_url} alt={active.caption} onError={onErr} className="max-h-[80vh] rounded-lg object-contain" />
            {active.caption && <figcaption className="mt-2 text-center text-sm text-white/80">{active.caption}</figcaption>}
          </figure>
        </div>
      )}
    </section>
  );
}
