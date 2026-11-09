import { useEffect, useState } from 'react';
import { ExternalLink, Megaphone, Play } from 'lucide-react';
import { getNotices } from '../../api/public';
import { youtubeId } from './Testimonials';

const fmt = (d) => { try { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); } catch { return d; } };
const hasMedia = (n) => n.link_url || n.image_url;

// Left: "main screen" for the selected notice (YouTube plays inline, else its image / text).
// Right: scrollable notice list — click one to show it on the main screen.
export default function NoticeBoard() {
  const [notices, setNotices] = useState([]);
  const [sel, setSel] = useState(null);

  useEffect(() => {
    getNotices().then((r) => { setNotices(r); setSel((r.find(hasMedia) || r[0])?.id ?? null); }).catch(() => {});
  }, []);

  if (!notices.length) return null;
  const cur = notices.find((n) => n.id === sel) || notices[0];
  const yt = youtubeId(cur.link_url || '');

  return (
    <section id="notice-board" className="section scroll-mt-20 bg-navy-700">
      <h2 className="text-center text-3xl font-medium">Notice Board</h2>
      <p className="mb-8 mt-1 text-center text-white/90">Latest announcements, videos and updates from AVM.</p>
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="overflow-hidden rounded-2xl bg-navy-950 shadow-xl">
          <div className="aspect-video w-full bg-black">
            {yt ? (
              <iframe key={yt} className="h-full w-full" src={`https://www.youtube.com/embed/${yt}?rel=0`} title={cur.title} allow="accelerometer; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
            ) : cur.image_url ? (
              <img src={cur.image_url} alt={cur.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
                <Megaphone size={40} className="text-gold-400" />
                <p className="text-xl font-semibold">{cur.title}</p>
              </div>
            )}
          </div>
          <div className="p-5">
            <p className="text-xs uppercase tracking-wide text-gold-400">{fmt(cur.published_at)}</p>
            <h3 className="mt-1 text-xl font-semibold">{cur.title}</h3>
            {cur.content && <p className="mt-2 whitespace-pre-line text-sm text-white/80">{cur.content}</p>}
            {cur.link_url && !yt && (
              <a href={cur.link_url} target="_blank" rel="noopener noreferrer" className="btn-gold mt-4"><ExternalLink size={16} /> Open link</a>
            )}
          </div>
        </div>

        <ul className="max-h-[34rem] space-y-2 overflow-y-auto rounded-2xl bg-white/10 p-3">
          {notices.map((n) => (
            <li key={n.id}>
              <button onClick={() => setSel(n.id)}
                className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition ${n.id === cur.id ? 'bg-gold-500 text-navy-950' : 'bg-white/5 hover:bg-white/15'}`}>
                <span className={`mt-0.5 shrink-0 rounded-full p-1.5 ${n.id === cur.id ? 'bg-navy-950/20' : 'bg-white/10'}`}>
                  {youtubeId(n.link_url || '') ? <Play size={14} /> : n.link_url ? <ExternalLink size={14} /> : <Megaphone size={14} />}
                </span>
                <span>
                  <span className="block text-sm font-semibold">{n.title}</span>
                  <span className={`text-xs ${n.id === cur.id ? 'text-navy-950/70' : 'text-white/60'}`}>{fmt(n.published_at)}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
