import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import SettingsFields from '../../components/admin/SettingsFields';
import PageForm from '../../components/admin/PageForm';
import ItemsManager from '../../components/admin/ItemsManager';
import Gallery from './Gallery';
import Testimonials from './Testimonials';
import Notices from './Notices';

const TABS = [
  { id: 'hero', label: 'Hero', render: () => (
    <div className="space-y-3">
      <p className="text-sm text-slate-600">Each slide is an image with its own text. Add as many as you like; they slide in the order shown. Use Order to rearrange.</p>
      <ItemsManager slug="home-hero" layout="slides" />
    </div>) },
  { id: 'notices', label: 'Notice Ticker', render: () => <Notices embedded /> },
  { id: 'about', label: 'About', render: () => (
    <SettingsFields fields={[
      { key: 'about_heading', label: 'Heading' },
      { key: 'about_subheading', label: 'Subheading' },
      { key: 'about_text', label: 'Body Text', textarea: true, rows: 14, hint: 'Separate paragraphs with a blank line.' },
    ]} />) },
  { id: 'why', label: 'Why AVM', render: () => (
    <div className="space-y-6">
      <PageForm slug="home-why" fields={['title', 'subtitle', 'banner_url']} bannerLabel="Section Background Image" />
      <ItemsManager slug="home-why" layout="items" />
    </div>) },
  { id: 'gallery', label: 'Gallery', render: () => (
    <div className="space-y-6">
      <SettingsFields fields={[
        { key: 'gallery_heading', label: 'Heading' },
        { key: 'gallery_subheading', label: 'Subheading' },
        { key: 'gallery_columns', label: 'Columns (desktop)', options: [3, 4, 5, 6].map((n) => ({ value: String(n), label: `${n} columns` })) },
        { key: 'gallery_scroll', label: 'Auto-scroll', options: [{ value: 'true', label: 'On — columns drift up/down, fading at top and bottom' }, { value: 'false', label: 'Off — show the full masonry grid' }] },
        { key: 'gallery_height', label: 'Section height (when auto-scroll is on)', options: [{ value: 'compact', label: 'Compact (480px)' }, { value: 'medium', label: 'Medium (640px)' }, { value: 'tall', label: 'Tall (800px)' }] },
      ]} />
      <Gallery embedded />
    </div>) },
  { id: 'admission', label: 'Admission Form', render: () => (
    <SettingsFields fields={[{ key: 'admission_heading', label: 'Heading' }, { key: 'admission_subheading', label: 'Subheading' }]} />) },
  { id: 'testimonials', label: 'Testimonials', render: () => (
    <div className="space-y-6">
      <SettingsFields fields={[{ key: 'testimonials_heading', label: 'Heading' }, { key: 'testimonials_subheading', label: 'Subheading' }]} />
      <Testimonials embedded />
    </div>) },
];

export default function HomeAdmin() {
  const [tab, setTab] = useState('hero');
  const current = TABS.find((t) => t.id === tab);
  return (
    <AdminLayout title="Home Page">
      <div className="mb-5 flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${tab === t.id ? 'bg-gold-500 text-navy-950' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>
            {t.label}
          </button>
        ))}
      </div>
      <div key={tab}>{current.render()}</div>
    </AdminLayout>
  );
}
