import { useState } from 'react';
import Sidebar from './Sidebar';
import AdminNavbar from './AdminNavbar';

export default function AdminLayout({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="admin min-h-screen text-navy-950">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="lg:pl-64">
        <AdminNavbar title={title} onMenu={() => setOpen(true)} />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

// Renders the full admin shell, or just the content when embedded in another admin page (e.g. Home tabs).
export function PageShell({ embedded, title, children }) {
  return embedded ? <>{children}</> : <AdminLayout title={title}>{children}</AdminLayout>;
}
