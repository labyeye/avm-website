import { useState } from 'react';
import { placeholder } from '../../api/assets';

// Facilities as tabs: one pill per facility, the selected one shows its photo and description.
export default function FacilityTabs({ items }) {
  const [active, setActive] = useState(0);
  if (!items.length) return <p className="mt-8 text-white/70">Facilities will be listed here soon.</p>;
  const cur = items[Math.min(active, items.length - 1)];

  const onKey = (e) => {
    if (e.key === 'ArrowRight') setActive((i) => (i + 1) % items.length);
    if (e.key === 'ArrowLeft') setActive((i) => (i - 1 + items.length) % items.length);
  };

  return (
    <div className="mt-10">
      <div role="tablist" aria-label="Facilities" onKeyDown={onKey} className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-3">
        {items.map((it, i) => (
          <button
            key={it.id}
            role="tab"
            id={`fac-tab-${it.id}`}
            aria-selected={i === active}
            aria-controls="fac-panel"
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition hover:-translate-y-0.5 ${
              i === active ? 'bg-gold-500 text-navy-950 shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {it.title}
          </button>
        ))}
      </div>

      <div key={cur.id} id="fac-panel" role="tabpanel" aria-labelledby={`fac-tab-${cur.id}`} className="mt-4 grid animate-slideIn items-center gap-8 md:grid-cols-2">
        <img
          src={cur.image_url || placeholder(1200, 800, cur.title, '16346b')}
          alt={cur.title}
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = placeholder(1200, 800, cur.title, '16346b'); }}
          className="aspect-[3/2] w-full rounded-2xl object-cover shadow-2xl"
        />
        <div>
          <h2 className="text-2xl font-semibold text-gold-400 md:text-3xl">{cur.title}</h2>
          {cur.subtitle && <p className="mt-1 text-sm uppercase tracking-wide text-white/70">{cur.subtitle}</p>}
          <p className="mt-4 whitespace-pre-line leading-relaxed text-white/90">{cur.description}</p>
        </div>
      </div>
    </div>
  );
}
