import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react';
import { getTestimonials } from '../../api/public';
import { placeholder } from '../../api/assets';

export function youtubeId(url = '') {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/);
  return m ? m[1] : null;
}

const isVideoFile = (url = '') => /\.(mp4|webm|mov)(\?.*)?$/i.test(url);

function useMobile() {
  const calc = () => typeof window !== 'undefined' && window.innerWidth < 768;
  const [m, setM] = useState(calc);
  useEffect(() => {
    const on = () => setM(calc());
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return m;
}

export default function Testimonials({ heading, subheading }) {
  const [items, setItems] = useState([]);
  const [index, setIndex] = useState(0);
  const [video, setVideo] = useState(null);
  const mobile = useMobile();
  const n = items.length;

  useEffect(() => { getTestimonials().then(setItems).catch(() => setItems([])); }, []);

  const next = () => setIndex((i) => (i + 1) % n);
  const prev = () => setIndex((i) => (i - 1 + n) % n);

  useEffect(() => {
    if (video || n < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % n), 4500);
    return () => clearInterval(t);
  }, [video, n]);

  useEffect(() => {
    if (!video) return;
    const onKey = (e) => e.key === 'Escape' && setVideo(null);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [video]);

  // Signed distance of card i from the centre card, wrapping around the list.
  const offset = (i) => {
    let d = (i - index + n) % n;
    if (d > n / 2) d -= n;
    return d;
  };

  const step = mobile ? 0 : 290;
  const vid = video && youtubeId(video.video_url);

  return (
    <section id="testimonials" className="section scroll-mt-20 overflow-hidden bg-navy-700">
      <h2 className="text-center text-3xl font-medium">{heading || 'What Parents Say About AVM'}</h2>
      <p className="mb-8 mt-1 text-center text-white/90">{subheading || "Hear from parents who trust AVM in shaping their children's future."}</p>

      {n > 0 && (
        <div className="relative mx-auto h-[580px] max-w-5xl">
          {items.map((t, i) => {
            const d = offset(i);
            const center = d === 0;
            const visible = Math.abs(d) <= 1 && (!mobile || center);
            return (
              <div
                key={t.id}
                className="absolute left-1/2 top-1/2 w-[200px] transition-all duration-500 ease-out md:w-[250px]"
                style={{
                  transform: `translate(calc(-50% + ${d * step}px), -50%) scale(${center ? 1.12 : 0.82})`,
                  opacity: visible ? (center ? 1 : 0.65) : 0,
                  zIndex: center ? 10 : 5 - Math.abs(d),
                  pointerEvents: visible ? 'auto' : 'none',
                }}
              >
                <button
                  onClick={() => (center ? setVideo(t) : setIndex(i))}
                  className={`group relative block aspect-[9/16] w-full overflow-hidden rounded-2xl bg-white/10 transition-shadow ${center ? 'shadow-2xl shadow-black/50 ring-2 ring-gold-500' : ''}`}
                  aria-label={center ? `Play ${t.title}` : `Show ${t.title}`}
                >
                  <img src={t.thumbnail_url} alt={t.title} loading="lazy" className="h-full w-full object-cover" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = placeholder(300, 400, t.title, '1e3a6e'); }} />
                  <span className="absolute inset-0 flex items-center justify-center transition group-hover:bg-black/40">
                    <span className={`flex items-center justify-center rounded-full bg-gold-500 text-navy-950 transition-transform group-hover:scale-110 ${center ? 'h-16 w-16' : 'h-12 w-12'}`}><Play size={center ? 28 : 20} fill="currentColor" /></span>
                  </span>
                </button>
              </div>
            );
          })}
          {n > 1 && (
            <>
              <button onClick={prev} aria-label="Previous" className="absolute left-0 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 hover:bg-white/40"><ChevronLeft /></button>
              <button onClick={next} aria-label="Next" className="absolute right-0 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 hover:bg-white/40"><ChevronRight /></button>
            </>
          )}
        </div>
      )}

      {video && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4" onClick={() => setVideo(null)} role="dialog" aria-modal="true">
          <button className="absolute right-4 top-4" onClick={() => setVideo(null)} aria-label="Close"><X size={30} /></button>
          <div className="aspect-video w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            {isVideoFile(video.video_url) ? (
              <video className="h-full w-full rounded-lg bg-black" src={video.video_url} controls autoPlay playsInline preload="none" />
            ) : vid ? (
              <iframe className="h-full w-full rounded-lg" src={`https://www.youtube.com/embed/${vid}?autoplay=1`} title={video.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
            ) : (
              <div className="flex h-full items-center justify-center rounded-lg bg-navy-900 text-sm">Invalid video URL</div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
