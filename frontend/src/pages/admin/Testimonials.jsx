import { useEffect, useState } from 'react';
import { Pencil, Trash2, Eye, EyeOff, Plus } from 'lucide-react';
import { PageShell } from '../../components/admin/AdminLayout';
import Modal from '../../components/admin/Modal';
import { useToast } from '../../components/admin/Toast';
import { testimonialsApi } from '../../api/admin';
import { errorMessage } from '../../api/axiosInstance';
import { placeholder } from '../../api/assets';
import ImageUpload from '../../components/admin/ImageUpload';
import VideoUpload from '../../components/admin/VideoUpload';

const EMPTY = { title: '', video_url: '', thumbnail_url: '', is_active: true };

function TForm({ value, onChange }) {
  const set = (k, v) => onChange({ ...value, [k]: v });
  return (
    <div className="space-y-3">
      <div><label className="label">Title</label><input className="field" required value={value.title} onChange={(e) => set('title', e.target.value)} /></div>
      <div><label className="label">Video</label><VideoUpload value={value.video_url} onChange={(u) => set('video_url', u)} /></div>
      <div><label className="label">Thumbnail Image</label><ImageUpload aspect={9 / 16} value={value.thumbnail_url} onChange={(u) => set('thumbnail_url', u)} /></div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!value.is_active} onChange={(e) => set('is_active', e.target.checked)} /> Active</label>
    </div>
  );
}

export default function Testimonials({ embedded = false }) {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = () => testimonialsApi.list().then(setItems).catch((e) => toast.error(errorMessage(e, 'Failed to load testimonials')));
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const run = async (fn, okMsg) => {
    try { await fn(); toast.success(okMsg); await load(); return true; }
    catch (e) { toast.error(errorMessage(e)); return false; }
  };

  return (
    <PageShell embedded={embedded} title="Testimonials">
      <form onSubmit={async (e) => { e.preventDefault(); if (await run(() => testimonialsApi.create(form), 'Testimonial added')) setForm(EMPTY); }} className="mb-6 rounded-xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold">Add New</h2>
        <TForm value={form} onChange={setForm} />
        <button className="btn-gold mt-4"><Plus size={16} /> Add Testimonial</button>
      </form>

      <div className="space-y-3">
        {items.map((it) => {
          const active = !!Number(it.is_active);
          return (
            <div key={it.id} className="flex flex-wrap items-center gap-4 rounded-xl bg-white p-3 shadow-sm">
              <img src={it.thumbnail_url} alt="" className="h-20 w-14 rounded object-cover" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = placeholder(112, 160, 'Video', '1e3a6e'); }} />
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">{it.title}</div>
                <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>{active ? 'Active' : 'Inactive'}</span>
              </div>
              <div className="flex gap-2">
                <button className="btn-ghost !px-2 !py-1" onClick={() => setEditing({ ...it, is_active: active })} aria-label="Edit"><Pencil size={14} /></button>
                <button className="btn-ghost !px-2 !py-1" onClick={() => run(() => testimonialsApi.update(it.id, { is_active: !active }), 'Visibility updated')} aria-label="Toggle active">{active ? <Eye size={14} /> : <EyeOff size={14} />}</button>
                <button className="btn-ghost !px-2 !py-1 text-red-600" onClick={() => setDeleting(it)} aria-label="Delete"><Trash2 size={14} /></button>
              </div>
            </div>
          );
        })}
        {!items.length && <p className="text-slate-500">No testimonials yet.</p>}
      </div>

      <Modal open={!!editing} title="Edit Testimonial" onClose={() => setEditing(null)}>
        {editing && (
          <form onSubmit={async (e) => { e.preventDefault(); if (await run(() => testimonialsApi.update(editing.id, editing), 'Testimonial updated')) setEditing(null); }}>
            <TForm value={editing} onChange={setEditing} />
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" className="btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
              <button className="btn-gold">Save</button>
            </div>
          </form>
        )}
      </Modal>

      <Modal open={!!deleting} title="Delete testimonial?" onClose={() => setDeleting(null)}
        footer={<>
          <button className="btn-ghost" onClick={() => setDeleting(null)}>Cancel</button>
          <button className="btn-danger" onClick={async () => { await run(() => testimonialsApi.remove(deleting.id), 'Testimonial deleted'); setDeleting(null); }}>Delete</button>
        </>}>
        Delete <b>{deleting?.title}</b>? This cannot be undone.
      </Modal>
    </PageShell>
  );
}
