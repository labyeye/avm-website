import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPage } from '../../api/public';
import { asset } from '../../api/assets';

// Uploaded photos are already full paths (/backend/uploads/..); only bare file names live in /assets. Placeholder images count as no photo.
const photoSrc = (u = '') => (!u || /placehold\.co/.test(u) ? '' : /^(https?:)?\//.test(u) ? u : asset(u));

// Short Principal's message on the home page, pulled from the About Us → Principal's Welcome page (edit it there).
export default function PrincipalMessage() {
  const [page, setPage] = useState(null);
  useEffect(() => { getPage('about-us/principals-welcome').then(setPage).catch(() => setPage(null)); }, []);
  if (!page?.body) return null;
  const text = page.body.replace(/[#*_>`]/g, '').split(/\n\s*\n/).filter(Boolean).slice(0, 2).join('\n\n');
  const who = page.items?.[0];
  // The photo uploaded on the Principal's Welcome page wins; the Person item's photo is the fallback.
  const photo = photoSrc(page.image_url) || photoSrc(who?.image_url);
  return (
    <section className="bg-slate-50 py-14">
      <div className="mx-auto grid max-w-5xl items-center gap-8 px-4 md:grid-cols-[220px_1fr]">
        {photo && <img src={photo} alt={who?.title || 'Principal'} loading="lazy" className="mx-auto h-52 w-52 rounded-full object-cover shadow-lg" />}
        <div className={photo ? '' : 'md:col-span-2'}>
          <h2 className="text-2xl font-bold text-navy-900">From the Principal's Desk</h2>
          <p className="mt-3 whitespace-pre-line text-slate-700">{text}</p>
          {who && <p className="mt-3 font-semibold text-navy-800">{who.title}{who.subtitle ? <span className="block text-sm font-normal text-slate-500">{who.subtitle}</span> : null}</p>}
          <Link to="/about-us/principals-welcome" className="mt-4 inline-block text-sm font-semibold text-gold-600 hover:underline">Read the full message →</Link>
        </div>
      </div>
    </section>
  );
}
