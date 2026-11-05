import { useEffect, useState } from 'react';
import { Megaphone } from 'lucide-react';
import { getNotices } from '../../api/public';

export default function NoticeTicker() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    getNotices().then(setNotices).catch(() => setNotices([]));
  }, []);

  if (!notices.length) return null;
  // Duplicate the list so the -50% translate loops seamlessly.
  const loop = [...notices, ...notices];

  return (
    <div className="flex items-center overflow-hidden bg-gold-500 text-navy-950" aria-label="Notices">
      <div className="z-10 flex shrink-0 items-center gap-2 bg-gold-600 px-4 py-2 text-xs font-bold uppercase">
        <Megaphone size={14} /> Notices
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="flex w-max animate-marquee whitespace-nowrap hover:[animation-play-state:paused]">
          {loop.map((n, i) => (
            <span key={`${n.id}-${i}`} className="px-8 py-2 text-sm font-medium">• {n.title}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
