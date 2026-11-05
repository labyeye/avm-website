import { useEffect, useState } from 'react';
import { getSettings } from './public';

// Live-stream status from site settings; re-checked every minute so the nav shows/hides LIVE without a reload.
export default function useLive() {
  const [live, setLive] = useState({ active: false, url: '', title: '' });
  useEffect(() => {
    let stop = false;
    const load = () => getSettings().then((s) => {
      if (stop) return;
      setLive({ active: s.live_active === 'true' && !!s.live_url, url: s.live_url || '', title: s.live_title || 'AVM Live' });
    }).catch(() => {});
    load();
    const t = setInterval(load, 60000);
    return () => { stop = true; clearInterval(t); };
  }, []);
  return live;
}
