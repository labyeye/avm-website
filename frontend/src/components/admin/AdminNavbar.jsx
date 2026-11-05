import { useNavigate } from 'react-router-dom';
import { Menu, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminNavbar({ title, onMenu }) {
  const { adminUser, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 text-slate-800 md:px-6">
      <div className="flex items-center gap-3">
        <button className="lg:hidden" onClick={onMenu} aria-label="Open menu"><Menu size={22} /></button>
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <span className="hidden items-center gap-1.5 text-slate-600 sm:flex"><UserCircle size={18} /> {adminUser?.username}</span>
        <button
          className="btn-ghost !py-1.5"
          onClick={async () => { await logout(); navigate('/admin/login'); }}
        >
          <LogOut size={14} /> Logout
        </button>
      </div>
    </header>
  );
}
