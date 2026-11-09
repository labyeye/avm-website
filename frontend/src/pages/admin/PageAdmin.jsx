import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import PageForm from '../../components/admin/PageForm';
import ItemsManager from '../../components/admin/ItemsManager';
import SettingsFields from '../../components/admin/SettingsFields';
import Messages from './Messages';
import Testimonials from './Testimonials';
import Admissions from './Admissions';
import { getPage } from '../../api/admin';
import { useToast } from '../../components/admin/Toast';
import { errorMessage } from '../../api/axiosInstance';

// What the items tab is called for each page.
const ITEM_LABEL = {
  sports: 'Sports / Activities', achievements: 'Achievements', leadership: 'Students', profile: 'Person', embed: 'Tour / Video', tabs: 'Facilities (tabs)',
  academics: 'Programmes', 'sports-and-activities': 'Activities', pastoral: 'Programmes',
  'governing-body': 'Members', alumni: 'Alumni', downloads: 'Files', 'public-disclosure': 'Documents',
};

const CONTACT_FIELDS = [
  { key: 'address', label: 'Address' },
  { key: 'contact_email', label: 'Email' },
  { key: 'contact_phone', label: 'Phone' },
  { key: 'facebook_url', label: 'Facebook URL' },
  { key: 'instagram_url', label: 'Instagram URL' },
  { key: 'youtube_url', label: 'YouTube URL' },
];

function buildTabs(slug, layout) {
  const tabs = [
    { id: 'header', label: 'Header', render: () => <PageForm slug={slug} fields={['title', 'subtitle', 'banner_url', 'image_url', 'file_url', 'file_label', 'is_active']} /> },
    { id: 'content', label: 'Content', render: () => <PageForm slug={slug} fields={['body']} /> },
  ];
  if (['cards', 'members', 'downloads', 'profile', 'embed', 'tabs', 'sports', 'leadership', 'achievements'].includes(layout)) {
    tabs.push({ id: 'items', label: ITEM_LABEL[slug] || ITEM_LABEL[layout] || 'Items', render: () => <ItemsManager slug={slug} layout={layout} /> });
  }
  if (layout === 'sports') {
    tabs.splice(2, 0, { id: 'incharge', label: 'In-charge Message', render: () => <PageForm slug={slug} fields={['incharge_message']} /> });
  }
  if (layout === 'leadership') {
    tabs.splice(2, 0, { id: 'messages', label: 'Leader Messages & Team Photo', render: () => <PageForm slug={slug} fields={['leaders']} /> });
  }
  if (layout === 'contact') {
    tabs.push({ id: 'details', label: 'Contact Details', render: () => (
      <div className="space-y-2">
        <p className="text-sm text-slate-500">These details are shared with the site footer.</p>
        <SettingsFields fields={CONTACT_FIELDS} />
      </div>) });
    tabs.push({ id: 'messages', label: 'Messages', render: () => <Messages embedded /> });
  }
  if (layout === 'testimonials') {
    tabs.push({ id: 'testimonials', label: 'Testimonials', render: () => <Testimonials embedded /> });
  }
  if (layout === 'admission') {
    tabs.push({ id: 'enquiries', label: 'Enquiries', render: () => <Admissions embedded /> });
  }
  return tabs;
}

export default function PageAdmin() {
  // Page slug is the rest of the path after /admin/pages/ (nested pages contain slashes).
  const slug = decodeURIComponent(useLocation().pathname).replace(/^\/admin\/pages\//, '').replace(/\/+$/, '');
  const toast = useToast();
  const [page, setPage] = useState(null);
  const [tab, setTab] = useState('header');

  useEffect(() => {
    setPage(null);
    setTab('header');
    getPage(slug).then(setPage).catch((e) => toast.error(errorMessage(e, 'Failed to load page')));
  }, [slug, toast]);

  const tabs = page ? buildTabs(slug, page.layout) : [];
  const current = tabs.find((t) => t.id === tab) || tabs[0];

  return (
    <AdminLayout title={page?.title || 'Page'}>
      {!page ? <p className="text-slate-500">Loading…</p> : (
        <>
          <div className="mb-5 flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${current.id === t.id ? 'font-semibold text-navy-900 [box-shadow:var(--inset)]' : 'bg-white text-slate-600 hover:text-navy-950'}`}>
                {t.label}
              </button>
            ))}
            <a href={`/${slug}`} target="_blank" rel="noreferrer" className="btn-ghost ml-auto !py-1.5"><ExternalLink size={14} /> View page</a>
          </div>
          <div key={`${slug}-${current.id}`}>{current.render()}</div>
        </>
      )}
    </AdminLayout>
  );
}
