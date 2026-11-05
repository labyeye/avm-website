import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import NoticeTicker from './NoticeTicker';
import Footer from './Footer';
import Reveal from './Reveal';
import useSettings from '../../api/useSettings';

export default function SiteLayout({ children }) {
  const settings = useSettings();
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return (
    <>
      <Navbar />
      <NoticeTicker />
      <main>{children}</main>
      <Reveal from="up" clip><Footer settings={settings} /></Reveal>
    </>
  );
}
