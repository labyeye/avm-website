import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, ChevronRight, Home, Image, MessageSquare, Quote, Settings, UserPlus } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import StatCard from '../../components/admin/StatCard';
import DataTable from '../../components/admin/DataTable';
import { useToast } from '../../components/admin/Toast';
import { getStats } from '../../api/admin';
import { errorMessage } from '../../api/axiosInstance';

const LINKS = [
  { to: '/admin/pages/admission', label: 'Admissions', icon: UserPlus },
  { to: '/admin/home', label: 'Home page', icon: Home },
  { to: '/admin/pages/contact-us', label: 'Messages', icon: MessageSquare },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

const DAY = 24 * 60 * 60 * 1000;
// Enquiries from the last 24 hours get a small gold dot, the thing staff check first.
const isNew = (ts) => {
  const t = Date.parse(String(ts).replace(' ', 'T'));
  return Number.isFinite(t) && Date.now() - t < DAY;
};

export default function Dashboard() {
  const toast = useToast();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getStats().then(setStats).catch((e) => toast.error(errorMessage(e, 'Failed to load stats')));
  }, [toast]);

  return (
    <AdminLayout title="Dashboard">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={UserPlus} tone="navy" label="Admissions received" value={stats?.total_admissions} />
        <StatCard icon={Image} tone="gold" label="Gallery items shown" value={stats?.active_gallery} />
        <StatCard icon={Quote} tone="blue" label="Testimonials shown" value={stats?.active_testimonials} />
        <StatCard icon={Bell} tone="slate" label="Notices published" value={stats?.published_notices} />
      </div>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_256px]">
        <section>
          <h2 className="mb-3 text-base font-medium">Recent admissions</h2>
          <DataTable
            pageSize={5}
            rows={stats?.recent_admissions || []}
            columns={[
              { key: 'student_name', label: 'Student', render: (r) => (
                <span className="flex items-center gap-2">
                  {isNew(r.submitted_at) && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" title="Received in the last 24 hours" />}
                  {r.student_name}
                </span>) },
              { key: 'class_applied', label: 'Class' },
              { key: 'phone', label: 'Phone' },
              { key: 'submitted_at', label: 'Received' },
            ]}
          />
        </section>

        <section>
          <h2 className="mb-3 text-base font-medium">Quick links</h2>
          <ul className="overflow-hidden rounded-2xl bg-white">
            {LINKS.map(({ to, label, icon: Icon }) => (
              <li key={to} className="border-t border-navy-950/10 first:border-t-0">
                <Link to={to} className="group flex h-12 items-center gap-3 px-4 text-sm font-medium transition-shadow duration-200 hover:[box-shadow:var(--inset)]">
                  <Icon size={16} strokeWidth={1.5} className="text-slate-600 group-hover:text-navy-950" />
                  <span className="flex-1">{label}</span>
                  <ChevronRight size={14} className="text-slate-500 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-navy-950" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AdminLayout>
  );
}
