import { useEffect, useState } from 'react';
import { getPage } from '../../api/public';
import { iconByName } from '../../api/icons';

const FALLBACK = [
  'Academic Excellence', 'Values-Based Education', 'Holistic Development', 'Focus on Discipline and Character', 'Supportive Learning',
  'Preparing Students', 'Lush Green Campus', 'Academic Excellence', 'Individual Growth', 'Leadership and Teamwork',
].map((title, i) => ({ id: i, title, subtitle: '', image_url: '' }));

// Heading, background image, and every card's icon + text come from the "home-why" page in the CMS
// (Admin → Home Page → Why AVM). Falls back to a static list if the API is unreachable.
export default function WhyAVM() {
  const [page, setPage] = useState(null);
  useEffect(() => { getPage('home-why').then(setPage).catch(() => {}); }, []);

  const items = page ? page.items : FALLBACK;
  const bg = page?.banner_url;

  return (
    <section
      id="why-avm"
      className="relative scroll-mt-20 bg-navy-950 bg-cover bg-center px-4 py-14 md:px-10 lg:px-20"
      style={bg ? { backgroundImage: `url(${bg})` } : undefined}
    >
      <div className="absolute inset-0 bg-navy-950/75" />
      <div className="relative mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-semibold">{page?.title || 'Why AVM?'}</h2>
        <div className="mx-auto mb-3 mt-3 flex w-20 flex-col gap-1" aria-hidden="true">
          <span className="h-px bg-white/80" />
          <span className="ml-3 h-px bg-white/80" />
        </div>
        {(page ? page.subtitle : 'More Than Education — A Foundation for Life') && (
          <p className="mb-10 text-center text-sm text-white/80">{page ? page.subtitle : 'More Than Education — A Foundation for Life'}</p>
        )}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-5">
          {items.map((it) => {
            const Icon = iconByName(it.subtitle);
            return (
              <div
                key={it.id}
                className="group flex cursor-default flex-col items-center gap-4 border-b border-r border-white/40 px-3 py-9 text-center
                  [&:nth-child(2n)]:border-r-0 [&:nth-last-child(-n+2)]:border-b-0
                  md:[&:nth-child(2n)]:border-r md:[&:nth-child(5n)]:border-r-0 md:[&:nth-last-child(-n+5)]:border-b-0"
              >
                <div className="flex flex-col items-center gap-4 transition-transform duration-300 ease-out group-hover:-translate-y-3">
                  {it.image_url
                    ? <img src={it.image_url} alt="" className="h-12 w-12 object-contain transition-transform duration-300 group-hover:scale-110" />
                    : <Icon size={48} strokeWidth={1.5} className="text-white transition-transform duration-300 group-hover:scale-110 group-hover:text-gold-400" />}
                  <span className="max-w-[12rem] text-sm leading-7 text-white transition-colors group-hover:text-gold-400">{it.title}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
