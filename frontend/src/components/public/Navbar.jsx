import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, GraduationCap, Box, ChevronDown, ChevronRight, Download } from 'lucide-react';
import { asset, withFallback } from '../../api/assets';
import { NAV } from '../../api/navConfig';
import { getPage, downloadUrl } from '../../api/public';
import avmlogo from "../../assets/logo.png";
const linkCls = ({ isActive }) =>
  `whitespace-nowrap text-[13px] font-medium transition hover:text-gold-400 ${isActive ? 'text-gold-400' : 'text-white/90'}`;

// Menu entry: internal route, or `href` for a file download / external link (opens in a new tab).
function MenuLink({ item, className, children }) {
  if (item.href) {
    return <a href={item.href} target="_blank" rel="noopener noreferrer" className={className({ isActive: false })}>{children}</a>;
  }
  return <NavLink to={item.to} className={className}>{children}</NavLink>;
}

// Items marked `dynamicFrom` get their dropdown from that CMS page's items (e.g. Public Disclosure documents).
const dynamicCache = {};
function useNav() {
  const [, bump] = useState(0);
  useEffect(() => {
    NAV.filter((i) => i.dynamicFrom && !dynamicCache[i.dynamicFrom]).forEach((i) => {
      dynamicCache[i.dynamicFrom] = [];
      getPage(i.dynamicFrom)
        .then((p) => {
          dynamicCache[i.dynamicFrom] = p.items.map((it) => {
            const url = it.file_url;
            const ready = url && url !== '#';
            const local = ready && /\/backend\/uploads\//.test(url);
            return { key: `d${it.id}`, label: it.title, to: i.to, ...(local ? { href: downloadUrl(it.id) } : ready ? { href: url } : {}) };
          });
          bump((n) => n + 1);
        })
        .catch(() => { delete dynamicCache[i.dynamicFrom]; });
    });
  }, []);
  return NAV.map((i) => (i.dynamicFrom && dynamicCache[i.dynamicFrom]?.length ? { ...i, children: dynamicCache[i.dynamicFrom] } : i));
}

// Desktop dropdown panel; items with children open a submenu to the right (recursive).
function Panel({ items, nested = false }) {
  return (
    <div
      className={`invisible absolute z-50 min-w-60 border-t-2 border-gold-500 bg-navy-900 opacity-0 shadow-xl transition duration-200
        group-hover/item:visible group-hover/item:opacity-100 ${nested ? 'left-full top-0' : 'left-0 top-full'}`}
    >
      {items.map((c) => (
        <div key={c.key ?? c.to} className="group/item relative border-b border-white/10 last:border-b-0">
          <MenuLink item={c} className={(s) => `flex items-center justify-between gap-4 px-5 py-3 ${linkCls(s)} hover:bg-white/5`}>
            <span className="whitespace-normal">{c.label}</span>
            {c.children && <ChevronRight size={14} />}
            {c.href && !c.children && <Download size={13} className="shrink-0 opacity-60" />}
          </MenuLink>
          {c.children && <Panel items={c.children} nested />}
        </div>
      ))}
    </div>
  );
}

// Mobile: accordion, one level at a time.
function MobileItem({ item, depth = 0, close }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className="flex items-center border-b border-white/5" style={{ paddingLeft: depth * 16 }}>
        {item.href
          ? <a href={item.href} target="_blank" rel="noopener noreferrer" onClick={close} className={`flex-1 py-3 ${linkCls({ isActive: false })} !whitespace-normal`}>{item.label}</a>
          : <NavLink to={item.to} end={item.to === '/'} onClick={close} className={(s) => `flex-1 py-3 ${linkCls(s)} !whitespace-normal`}>{item.label}</NavLink>}
        {item.children && (
          <button className="p-3" aria-label={`Toggle ${item.label}`} aria-expanded={open} onClick={() => setOpen(!open)}>
            <ChevronDown size={16} className={`transition ${open ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>
      {item.children && open && item.children.map((c) => <MobileItem key={c.key ?? c.to} item={c} depth={depth + 1} close={close} />)}
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const nav = useNav();

  const badges = (
    <>
      <span className="flex items-center gap-2 rounded-lg border border-gold-500/60 bg-black/30 px-3 py-1.5 text-xs font-semibold text-gold-400">
        <GraduationCap size={16} /> CBSE Affiliated
      </span>
      <button className="flex items-center gap-2 rounded-lg border border-gold-500/60 bg-black/30 px-3 py-1.5 text-xs font-semibold text-gold-400 transition hover:bg-gold-500 hover:text-navy-950">
        <Box size={16} /> 3D Virtual Tour
      </button>
    </>
  );

  return (
    <header className="sticky top-0 z-40 bg-navy-900/95 shadow-lg backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-4 py-2 lg:px-8">
        <Link to="/" onClick={close} className="shrink-0">
          <img src={avmlogo} alt="Adarsh Vidya Mandir" className="h-11 w-11 rounded-full object-cover" />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-4 xl:flex 2xl:gap-6">
          {nav.map((item) => (
            <div key={item.label} className="group/item relative py-3">
              <NavLink to={item.to} end={item.to === '/'} className={(s) => `${linkCls(s)} flex items-center gap-1`}>
                {item.label} {item.children && <ChevronDown size={12} />}
              </NavLink>
              {item.children && <Panel items={item.children} />}
            </div>
          ))}
        </nav>

        <div className="hidden items-center gap-3 2xl:flex">{badges}</div>

        <button className="xl:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <div className="max-h-[80vh] overflow-y-auto border-t border-white/10 bg-navy-900 px-4 pb-4 xl:hidden">
          {nav.map((item) => <MobileItem key={item.label} item={item} close={close} />)}
          <div className="mt-3 flex flex-wrap gap-2">{badges}</div>
        </div>
      )}
    </header>
  );
}
