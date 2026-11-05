import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import { asset, withFallback } from '../../api/assets';
import avmlogo from "../../assets/logo.png";
const COL1 = [['About Us', '/about-us'], ['Curriculum', '/academics'], ['Governing Body', '/governing-body'], ['Leadership', '/governing-body'], ['Registration Form', '/admission'], ['Sports & Activities', '/sports-and-activities'], ['Alumni', '/alumni']];
const COL2 = [['Contact Us', '/contact-us'], ['Downloads', '/downloads'], ['Public Disclosure', '/public-disclosure'], ['House System', '/pastoral'], ['Academic Calendar', '/downloads']];

export default function Footer({ settings = {} }) {
  const social = [
    { Icon: Facebook, label: 'Facebook', url: settings.facebook_url },
    { Icon: Instagram, label: 'Instagram', url: settings.instagram_url },
    { Icon: Youtube, label: 'YouTube', url: settings.youtube_url },
  ];
  const link = 'block text-sm text-white/80 transition duration-200 hover:-translate-y-0.5 hover:text-gold-400';

  return (
    <footer className="bg-[#262b33] text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-[1.3fr_1.4fr_0.8fr]">
        <div>
          <div className="flex items-center gap-3">
            <img src={avmlogo} onError={withFallback(80, 80, 'AVM')} alt="AVM logo" className="h-16 w-16 rounded-full object-cover" />
            <div>
              <div className="text-lg font-medium">Adarsh Vidya Mandir</div>
              <div className="text-xs text-white/70">Muzaffarpur | Bihar</div>
            </div>
          </div>
          <p className="mt-5 text-sm text-white/80">{settings.address}</p>
          {settings.contact_email && <p className="mt-3 text-sm text-white/80">Email: <a className="hover:text-gold-400" href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a></p>}
          {settings.contact_phone && <p className="mt-1 text-sm text-white/80">Phone: <a className="hover:text-gold-400" href={`tel:${settings.contact_phone.replace(/\s/g, '')}`}>{settings.contact_phone}</a></p>}
        </div>

        <div>
          <h3 className="mb-3 font-medium">Useful Links</h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            <div className="space-y-2">{COL1.map(([l, to]) => <Link key={l} to={to} className={link}>{l}</Link>)}</div>
            <div className="space-y-2">{COL2.map(([l, to]) => <Link key={l} to={to} className={link}>{l}</Link>)}</div>
          </div>
        </div>

        <div className="space-y-3">
          {social.map(({ Icon, label, url }) => (
            <a key={label} href={url || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-white/90 hover:text-gold-400">
              <Icon size={18} /> {label}
            </a>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap justify-between gap-2 bg-navy-950 px-6 py-3 text-xs text-white/80">
        <span>© Copyright 2025, All Rights Reserved</span>
        <span>Designed & Developed by <a href="https://pixelatenest.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold-400">Pixelate Nest</a></span>
      </div>
    </footer>
  );
}
