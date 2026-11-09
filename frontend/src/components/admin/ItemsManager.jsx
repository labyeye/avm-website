import { useEffect, useState } from 'react';
import { Pencil, Trash2, Eye, EyeOff, Plus } from 'lucide-react';
import DataTable from './DataTable';
import Modal from './Modal';
import ImageUpload from './ImageUpload';
import FileUpload from './FileUpload';
import MultiImageField from './MultiImageField';
import { ICONS, iconByName } from '../../api/icons';
import { useToast } from './Toast';
import { pageItemsApi } from '../../api/admin';
import { errorMessage } from '../../api/axiosInstance';

const ALL = {
  title: { label: 'Title', required: true },
  subtitle: { label: 'Subtitle / Role / Category' },
  description: { label: 'Description', textarea: true },
  captain: { label: 'Captain name' },
  captain_photo_url: { label: 'Captain photo', upload: true },
  captain_message: { label: 'Captain message', textarea: true },
  gallery: { label: 'Gallery photos (shown as a masonry grid — select many at once)', gallery: true },
  incharge: { label: 'In-charge name (teacher / coach)' },
  incharge_photo_url: { label: 'In-charge photo', upload: true },
  image_url: { label: 'Image', upload: true },
  team_photo_url: { label: 'Team photo', upload: true },
  file_url: { label: 'Document (PDF)', file: true },
  sort_order: { label: 'Sort Order', type: 'number' },
};

const SLIDE_LABELS = { title: { label: 'Slide Heading' }, subtitle: { label: 'Slide Sub-text' }, image_url: { label: 'Slide Image', upload: true } };

// Why AVM cards: subtitle holds the chosen icon name; image_url is an optional custom icon.
const ICON_LABELS = {
  subtitle: { label: 'Icon', icon: true },
  image_url: { label: 'Custom icon image (optional — replaces the chosen icon)', upload: true },
};

// Recommended crop shape for each layout's image.
const ASPECT = { slides: 16 / 9, achievements: 3 / 2, sports: 3 / 2, leadership: 1, cards: 3 / 2, tabs: 3 / 2, members: 1, profile: 1, items: 1 };

// Per-layout label overrides.
const LAYOUT_LABELS = {
  tabs: { title: { label: 'Tab name (e.g. Library)' }, image_url: { label: 'Photo', upload: true } },
  profile: { title: { label: 'Name' }, subtitle: { label: 'Designation' }, image_url: { label: 'Photo', upload: true } },
  sports: { title: { label: 'Name (e.g. Cricket)' }, subtitle: { label: 'Short tagline' }, description: { label: 'About this sport / activity', textarea: true }, image_url: { label: 'Card photo', upload: true } },
  achievements: { title: { label: 'Achievement (e.g. State Level Gold — Kabaddi)' }, subtitle: { label: 'Year / Level (e.g. 2026 · State)' }, description: { label: 'Details', textarea: true }, image_url: { label: 'Photo', upload: true } },
  leadership: { title: { label: 'Student name' }, subtitle: { label: 'Position (e.g. Head Boy)' }, description: { label: 'Student details (class, house, about)', textarea: true }, image_url: { label: 'Student photo', upload: true } },
  embed: { title: { label: 'Title' }, file_url: { label: 'Tour / video link (YouTube or 360° tour URL)', file: true } },
};

// Which fields each page layout needs.
export const FIELDS_BY_LAYOUT = {
  items: ['title', 'subtitle', 'image_url', 'sort_order'],
  profile: ['title', 'subtitle', 'image_url'],
  tabs: ['title', 'description', 'image_url', 'sort_order'],
  embed: ['title', 'file_url'],
  slides: ['title', 'subtitle', 'image_url', 'sort_order'],
  sports: ['title', 'subtitle', 'description', 'image_url', 'captain', 'captain_photo_url', 'captain_message', 'incharge', 'incharge_photo_url', 'team_photo_url', 'gallery', 'sort_order'],
  leadership: ['title', 'subtitle', 'description', 'image_url', 'sort_order'],
  achievements: ['title', 'subtitle', 'description', 'image_url', 'sort_order'],
  cards: ['title', 'subtitle', 'description', 'image_url', 'sort_order'],
  members: ['title', 'subtitle', 'description', 'image_url', 'sort_order'],
  downloads: ['title', 'subtitle', 'file_url', 'sort_order'],
};

export default function ItemsManager({ slug, layout = 'cards' }) {
  const toast = useToast();
  const fields = FIELDS_BY_LAYOUT[layout] || FIELDS_BY_LAYOUT.cards;
  const blank = () => ({ page_slug: slug, title: '', subtitle: '', description: '', captain: '', captain_message: '', gallery: '', incharge: '', captain_photo_url: '', incharge_photo_url: '', team_photo_url: '', image_url: '', file_url: '', sort_order: 0, is_active: true });
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = () => pageItemsApi.list(slug).then(setRows).catch((e) => toast.error(errorMessage(e, 'Failed to load items')));
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [slug]);

  const run = async (fn, ok) => {
    try { await fn(); toast.success(ok); await load(); return true; }
    catch (e) { toast.error(errorMessage(e)); return false; }
  };

  const save = async (e) => {
    e.preventDefault();
    const ok = form.id
      ? await run(() => pageItemsApi.update(form.id, form), 'Item updated')
      : await run(() => pageItemsApi.create(form), 'Item added');
    if (ok) setForm(null);
  };

  const set = (k, v) => setForm({ ...form, [k]: v });

  return (
    <>
      <DataTable
        rows={rows}
        searchKeys={['title', 'subtitle']}
        toolbar={<button className="btn-gold" onClick={() => setForm(blank())}><Plus size={16} /> Add Item</button>}
        columns={[
          { key: 'sort_order', label: 'Order' },
          ...(layout === 'items' ? [{ key: 'icon', label: 'Icon', render: (r) => { const I = iconByName(r.subtitle); return r.image_url ? <img src={r.image_url} alt="" className="h-8 w-8 object-contain" /> : <I size={24} className="text-slate-700" />; } }] : []),
          ...(layout !== 'items' && fields.includes('image_url') ? [{ key: 'image_url', label: 'Image', render: (r) => r.image_url ? <img src={r.image_url} alt="" className="h-10 w-14 rounded object-cover" /> : '–' }] : []),
          { key: 'title', label: 'Title' },
          ...(layout !== 'items' && fields.includes('subtitle') ? [{ key: 'subtitle', label: 'Subtitle' }] : []),
          ...(layout === 'downloads' ? [{ key: 'file_url', label: 'File', render: (r) => r.file_url && r.file_url !== '#'
            ? <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">Uploaded</span>
            : <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">Missing</span> }] : []),
          { key: 'is_active', label: 'Status', render: (r) => Number(r.is_active)
            ? <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">Active</span>
            : <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">Hidden</span> },
        ]}
        actions={(r) => (
          <div className="flex gap-2">
            <button className="btn-ghost !px-2 !py-1" aria-label="Edit" onClick={() => setForm({ ...r, is_active: !!Number(r.is_active) })}><Pencil size={14} /></button>
            <button className="btn-ghost !px-2 !py-1" aria-label="Toggle" onClick={() => run(() => pageItemsApi.update(r.id, { is_active: !Number(r.is_active) }), 'Visibility updated')}>{Number(r.is_active) ? <Eye size={14} /> : <EyeOff size={14} />}</button>
            <button className="btn-ghost !px-2 !py-1 text-red-600" aria-label="Delete" onClick={() => setDeleting(r)}><Trash2 size={14} /></button>
          </div>
        )}
      />

      <Modal open={!!form} title={form?.id ? 'Edit Item' : 'Add Item'} onClose={() => setForm(null)} wide>
        {form && (
          <form onSubmit={save} className="space-y-3">
            {fields.map((k) => {
              const f = layout === 'slides' ? { ...ALL[k], ...SLIDE_LABELS[k] } : layout === 'items' ? { ...ALL[k], ...ICON_LABELS[k] } : { ...ALL[k], ...LAYOUT_LABELS[layout]?.[k] };
              return (
                <div key={k}>
                  <label className="label">{f.label}</label>
                  {f.icon
                    ? (
                      <div className="grid max-h-48 grid-cols-6 gap-2 overflow-y-auto rounded-lg border border-slate-200 p-2 sm:grid-cols-9">
                        {Object.entries(ICONS).map(([name, I]) => (
                          <button type="button" key={name} title={name} onClick={() => set(k, name)}
                            className={`flex h-10 items-center justify-center rounded-lg border ${form[k] === name ? 'border-gold-500 bg-gold-500/20' : 'border-transparent hover:bg-slate-100'}`}>
                            <I size={20} />
                          </button>
                        ))}
                      </div>
                    )
                    : f.gallery
                    ? <MultiImageField value={form[k]} onChange={(v) => set(k, v)} />
                    : f.file
                    ? <FileUpload value={form[k]} onChange={(u) => set(k, u)} />
                    : f.upload
                    ? <ImageUpload aspect={k === 'captain_photo_url' || k === 'incharge_photo_url' ? 1 : k === 'team_photo_url' ? undefined : ASPECT[layout]} value={form[k]} onChange={(u) => set(k, u)} />
                    : f.textarea
                    ? <textarea rows={4} className="field" value={form[k] ?? ''} onChange={(e) => set(k, e.target.value)} />
                    : <input type={f.type || 'text'} className="field" required={f.required} value={form[k] ?? ''} onChange={(e) => set(k, e.target.value)} />}
                </div>
              );
            })}
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.is_active} onChange={(e) => set('is_active', e.target.checked)} /> Active</label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className="btn-ghost" onClick={() => setForm(null)}>Cancel</button>
              <button className="btn-gold">Save</button>
            </div>
          </form>
        )}
      </Modal>

      <Modal open={!!deleting} title="Delete item?" onClose={() => setDeleting(null)}
        footer={<>
          <button className="btn-ghost" onClick={() => setDeleting(null)}>Cancel</button>
          <button className="btn-danger" onClick={async () => { await run(() => pageItemsApi.remove(deleting.id), 'Item deleted'); setDeleting(null); }}>Delete</button>
        </>}>
        Delete <b>{deleting?.title}</b>?
      </Modal>
    </>
  );
}
