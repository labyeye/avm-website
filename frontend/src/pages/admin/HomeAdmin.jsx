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
  { id: 'parent', label: 'Parent Info', render: () => (
    <SettingsFields fields={[
      { key: 'admission_button_visible', toggle: true, label: 'Show the red blinking "Admissions Open" button on the website', hint: 'Turn off to hide the button (and its popup form) on every page.' },
      { key: 'enquire_button_visible', toggle: true, defaultOn: true, label: 'Show the gold "Enquire Now" button in the website menu bar', hint: 'Turn off to hide it from the top menu (desktop and mobile).' },
      { key: 'admission_banner', label: 'Admissions banner text', hint: 'Shown on every page, e.g. "Admissions open for 2027-28". Leave empty to hide.' },
      { key: 'parent_portal_url', label: 'Parent Login link', hint: 'Full URL of your ERP / parent portal. Leave empty to hide the button.' },
      ...[1, 2, 3, 4, 5].flatMap((n) => [
        { key: `stat${n}_value`, label: `Number ${n} (e.g. 1966)` },
        { key: `stat${n}_label`, label: `Number ${n} label (e.g. Established)` },
      ]),
    ]} />) },
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
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${tab === t.id ? 'font-semibold text-navy-900 [box-shadow:var(--inset)]' : 'bg-white text-slate-600 hover:text-navy-950'}`}>
            {t.label}
          </button>
        ))}
      </div>
      <div key={tab}>{current.render()}</div>
    </AdminLayout>
  );
}
