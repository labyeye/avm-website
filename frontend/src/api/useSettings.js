import { useEffect, useState } from 'react';
import { getSettings } from './public';

let cache = null;

// Site settings, fetched once and shared by Navbar/Footer/Home.
export default function useSettings() {
  const [settings, setSettings] = useState(cache || {});
  useEffect(() => {
    if (cache) return;
    getSettings().then((s) => { cache = s; setSettings(s); }).catch(() => {});
  }, []);
  return settings;
}
