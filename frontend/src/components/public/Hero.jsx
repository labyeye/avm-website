import { useEffect, useState } from 'react';
import { asset } from '../../api/assets';
import { getPage } from '../../api/public';

const INTERVAL = 5000;

// Slides come from the "home-hero" page in the CMS; falls back to the single heading/image settings.
export default function Hero({ heading, image }) {
  const [slides, setSlides] = useState([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => { getPage('home-hero').then((p) => setSlides(p.items || [])).catch(() => {}); }, []);

  const list = slides.length
    ? slides
    : [{ id: 0, title: heading || 'Adarsh Vidya Mandir', subtitle: '', image_url: image || asset('photos/hero-campus.jpg') }];
  const cur = idx % list.length;

  useEffect(() => {
    if (list.length < 2) return undefined;
    const t = setInterval(() => setIdx((i) => (i + 1) % list.length), INTERVAL);
    return () => clearInterval(t);
  }, [list.length]);

  return (
    <section id="home" className="relative h-[55vh] min-h-[320px] scroll-mt-20 overflow-hidden bg-navy-950 md:h-[70vh]">
      {list.map((s, i) => (
        <div
          key={s.id}
          aria-hidden={i !== cur}
          className={`absolute inset-0 flex items-end justify-center bg-cover bg-center pb-12 transition-opacity duration-1000 ${i === cur ? 'opacity-100' : 'opacity-0'}`}
          style={{ backgroundImage: `url(${s.image_url || asset('photos/hero-campus.jpg')}), url(https://placehold.co/1920x900/16346b/white?text=Adarsh+Vidya+Mandir)` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90  to-transparent" />
          <div className="relative px-4 text-center">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg md:text-6xl">{s.title}</h1>
            {s.subtitle && <p className="mt-3 text-lg text-white/90 drop-shadow md:text-2xl">{s.subtitle}</p>}
          </div>
        </div>
      ))}
      {list.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {list.map((s, i) => (
            <button key={s.id} aria-label={`Slide ${i + 1}`} onClick={() => setIdx(i)}
              className={`h-2.5 w-2.5 rounded-full transition ${i === cur ? 'bg-gold-500' : 'bg-white/50'}`} />
          ))}
        </div>
      )}
    </section>
  );
}
