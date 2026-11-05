import { useEffect, useState } from 'react';
import { Pencil, Trash2, Eye, EyeOff, Plus } from 'lucide-react';
import { PageShell } from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import { useToast } from '../../components/admin/Toast';
import { noticesApi } from '../../api/admin';
import { errorMessage } from '../../api/axiosInstance';

const today = () => new Date().toISOString().slice(0, 10);
const empty = () => ({ title: '', content: '', published_at: today(), is_active: true });

function NForm({ value, onChange }) {
  const set = (k, v) => onChange({ ...value, [k]: v });
  return (
    <div className="space-y-3">
      <div><label className="label">Title</label><input className="field" required value={value.title} onChange={(e) => set('title', e.target.value)} /></div>
      <div><label className="label">Content</label><textarea rows={4} className="field" value={value.content ?? ''} onChange={(e) => set('content', e.target.value)} /></div>
      <div><label className="label">Published Date</label><input type="date" required className="field" value={value.published_at} onChange={(e) => set('published_at', e.target.value)} /></div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!value.is_active} onChange={(e) => set('is_active', e.target.checked)} /> Active</label>
    </div>
  );
}

export default function Notices({ embedded = false }) {
  const toast = useToast();
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(empty());
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = () => noticesApi.list().then(setRows).catch((e) => toast.error(errorMessage(e, 'Failed to load notices')));
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const run = async (fn, okMsg) => {
    try { await fn(); toast.success(okMsg); await load(); return true; }
    catch (e) { toast.error(errorMessage(e)); return false; }
  };

  return (
    <PageShell embedded={embedded} title="Notices">
      <form onSubmit={async (e) => { e.preventDefault(); if (await run(() => noticesApi.create(form), 'Notice added')) setForm(empty()); }} className="mb-6 rounded-xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold">Add New</h2>
        <NForm value={form} onChange={setForm} />
        <button className="btn-gold mt-4"><Plus size={16} /> Add Notice</button>
      </form>

      <DataTable
        rows={rows}
        searchKeys={['title']}
        columns={[
          { key: 'title', label: 'Title' },
          { key: 'published_at', label: 'Published Date' },
          { key: 'is_active', label: 'Status', render: (r) => Number(r.is_active)
            ? <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">Active</span>
            : <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">Inactive</span> },
        ]}
        actions={(r) => (
          <div className="flex gap-2">
            <button className="btn-ghost !px-2 !py-1" onClick={() => setEditing({ ...r, is_active: !!Number(r.is_active) })} aria-label="Edit"><Pencil size={14} /></button>
            <button className="btn-ghost !px-2 !py-1" onClick={() => run(() => noticesApi.update(r.id, { is_active: !Number(r.is_active) }), 'Status updated')} aria-label="Toggle">{Number(r.is_active) ? <Eye size={14} /> : <EyeOff size={14} />}</button>
            <button className="btn-ghost !px-2 !py-1 text-red-600" onClick={() => setDeleting(r)} aria-label="Delete"><Trash2 size={14} /></button>
          </div>
        )}
      />

      <Modal open={!!editing} title="Edit Notice" onClose={() => setEditing(null)}>
        {editing && (
          <form onSubmit={async (e) => { e.preventDefault(); if (await run(() => noticesApi.update(editing.id, editing), 'Notice updated')) setEditing(null); }}>
            <NForm value={editing} onChange={setEditing} />
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" className="btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
              <button className="btn-gold">Save</button>
            </div>
          </form>
        )}
      </Modal>

      <Modal open={!!deleting} title="Delete notice?" onClose={() => setDeleting(null)}
        footer={<>
          <button className="btn-ghost" onClick={() => setDeleting(null)}>Cancel</button>
          <button className="btn-danger" onClick={async () => { await run(() => noticesApi.remove(deleting.id), 'Notice deleted'); setDeleting(null); }}>Delete</button>
        </>}>
        Delete <b>{deleting?.title}</b>?
      </Modal>
    </PageShell>
  );
}
