import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Settings, LogOut, X, Home, FileText, ChevronDown, Radio } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import avmlogo from '../../assets/logo-256.png';

import { NAV as SITE_NAV } from '../../api/navConfig';

// Every public page gets its own tabbed editor at /admin/pages/<slug> (Home has /admin/home); nested pages expand under their parent.
const toAdmin = (to) => (to === '/' ? '/admin/home' : to === '/events' ? '/admin/events' : `/admin/pages/${to.slice(1)}`);
const toTree = (nodes) => nodes.map((n) => ({
  label: n.label,
  to: toAdmin(n.to),
  icon: n.to === '/' ? Home : FileText,
  children: n.children ? toTree(n.children) : null,
}));
const PAGE_TREE = toTree(SITE_NAV);

const GROUPS = [
  { items: [{ to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true }] },
  { title: 'Website Pages', tree: PAGE_TREE },
  { title: 'Site', items: [{ to: '/admin/live', label: 'YouTube Live', icon: Radio }, { to: '/admin/settings', label: 'Settings', icon: Settings }] },
];

const itemCls = (isActive, depth) =>
  `flex flex-1 items-center gap-3 rounded-lg py-2 text-sm font-medium transition ${depth ? 'pl-3 pr-2 text-[13px]' : 'px-3'} ${
    isActive ? 'bg-gold-500 text-navy-950' : 'text-slate-300 hover:bg-white/10'
  }`;

function TreeNode({ node, depth = 0, onClose }) {
  const { pathname } = useLocation();
  const inside = pathname === node.to || pathname.startsWith(`${node.to}/`);
  const [open, setOpen] = useState(inside);
  const Icon = node.icon;
  return (
    <div>
      <div className="flex items-center" style={{ paddingLeft: depth * 14 }}>
        <NavLink to={node.to} end={!!node.children} onClick={onClose} className={({ isActive }) => itemCls(isActive, depth)}>
          {depth === 0 && <Icon size={18} />} <span className="truncate">{node.label}</span>
        </NavLink>
        {node.children && (
          <button className="p-2 text-slate-400 hover:text-white" aria-label={`Toggle ${node.label}`} aria-expanded={open} onClick={() => setOpen(!open)}>
            <ChevronDown size={14} className={`transition ${open ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>
      {node.children && open && node.children.map((c) => <TreeNode key={c.to} node={c} depth={depth + 1} onClose={onClose} />)}
    </div>
  );
}

export default function Sidebar({ open, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-navy-950 text-white transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
          <img src={avmlogo} alt="AVM logo" className="h-10 w-10 rounded-full object-cover" />
          <div className="flex-1 leading-tight">
            <div className="text-sm font-semibold">Adarsh Vidya Mandir</div>
            <div className="text-xs text-gold-400">Admin Panel</div>
          </div>
          <button className="lg:hidden" onClick={onClose} aria-label="Close menu"><X size={18} /></button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {GROUPS.map((g, gi) => (
            <div key={gi} className={gi ? 'pt-3' : ''}>
              {g.title && <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">{g.title}</div>}
              {g.tree
                ? g.tree.map((n) => <TreeNode key={n.to} node={n} onClose={onClose} />)
                : g.items.map(({ to, label, icon: Icon, end }) => (
                  <NavLink key={to} to={to} end={end} onClick={onClose} className={({ isActive }) => itemCls(isActive, 0)}>
                    <Icon size={18} /> {label}
                  </NavLink>
                ))}
            </div>
          ))}
        </nav>
        <button onClick={handleLogout} className="m-3 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/10">
          <LogOut size={18} /> Logout
        </button>
      </aside>
    </>
  );
}
