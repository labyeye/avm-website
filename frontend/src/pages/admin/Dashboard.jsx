import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Image, Video, Bell, Settings } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import StatCard from '../../components/admin/StatCard';
import DataTable from '../../components/admin/DataTable';
import { useToast } from '../../components/admin/Toast';
import { getStats } from '../../api/admin';
import { errorMessage } from '../../api/axiosInstance';

const LINKS = [
  { to: '/admin/pages/admission', label: 'Admissions', icon: UserPlus },
  { to: '/admin/home', label: 'Home Page', icon: Image },
  { to: '/admin/pages/contact-us', label: 'Messages', icon: Video },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function Dashboard() {
  const toast = useToast();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getStats().then(setStats).catch((e) => toast.error(errorMessage(e, 'Failed to load stats')));
  }, [toast]);

  return (
    <AdminLayout title="Dashboard">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={UserPlus} label="Total Admissions" value={stats?.total_admissions} color="blue" />
        <StatCard icon={Image} label="Active Gallery Items" value={stats?.active_gallery} color="green" />
        <StatCard icon={Video} label="Active Testimonials" value={stats?.active_testimonials} color="purple" />
        <StatCard icon={Bell} label="Published Notices" value={stats?.published_notices} color="orange" />
      </div>

      <h2 className="mb-3 mt-8 font-semibold">Recent Admissions</h2>
      <DataTable
        pageSize={5}
        rows={stats?.recent_admissions || []}
        columns={[
          { key: 'student_name', label: 'Student Name' },
          { key: 'class_applied', label: 'Class' },
          { key: 'phone', label: 'Phone' },
          { key: 'submitted_at', label: 'Submitted At' },
        ]}
      />

      <h2 className="mb-3 mt-8 font-semibold">Quick Links</h2>
      <div className="flex flex-wrap gap-3">
        {LINKS.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} className="btn-gold"><Icon size={16} /> {label}</Link>
        ))}
      </div>
    </AdminLayout>
  );
}
