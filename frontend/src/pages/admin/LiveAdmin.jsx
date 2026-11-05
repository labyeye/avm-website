import { useEffect, useState } from 'react';
import { Save, Radio } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useToast } from '../../components/admin/Toast';
import { getAdminSettings, updateSettings } from '../../api/admin';
import { errorMessage } from '../../api/axiosInstance';

const ID_RE = /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/;

export default function LiveAdmin() {
  const toast = useToast();
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getAdminSettings()
      .then((s) => setForm({ live_url: s.live_url || '', live_title: s.live_title || 'AVM Live', live_active: s.live_active === 'true' }))
      .catch((e) => toast.error(errorMessage(e, 'Failed to load')));
  }, [toast]);

  if (!form) return <AdminLayout title="YouTube Live"><p className="text-slate-500">Loading…</p></AdminLayout>;

  const set = (k, v) => setForm({ ...form, [k]: v });
  const valid = ID_RE.test(form.live_url);

  const save = async (e) => {
    e.preventDefault();
    if (form.live_active && !valid) return toast.error('Enter a valid YouTube link before going live');
    setBusy(true);
    try {
      await updateSettings({ ...form, live_active: String(form.live_active) });
      toast.success(form.live_active ? 'You are live — LIVE tag is now on the website' : 'Saved (not live)');
    } catch (err) { toast.error(errorMessage(err, 'Failed to save')); }
    finally { setBusy(false); }
  };

  return (
    <AdminLayout title="YouTube Live">
      <form onSubmit={save} className="max-w-3xl space-y-4 rounded-xl bg-white p-5 shadow-sm">
        <div>
          <label className="label" htmlFor="live_title">Title</label>
          <input id="live_title" className="field" value={form.live_title} onChange={(e) => set('live_title', e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="live_url">YouTube live link</label>
          <input id="live_url" className="field" placeholder="https://www.youtube.com/watch?v=… or https://youtube.com/live/…" value={form.live_url} onChange={(e) => set('live_url', e.target.value)} />
          {form.live_url && !valid && <p className="mt-1 text-xs text-red-600">This doesn't look like a YouTube video / live link.</p>}
        </div>
        {valid && (
          <div className="aspect-video max-w-md overflow-hidden rounded-lg bg-black">
            <iframe title="Preview" className="h-full w-full" src={`https://www.youtube.com/embed/${form.live_url.match(ID_RE)[1]}`} allowFullScreen />
          </div>
        )}
        <label className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 text-sm">
          <input type="checkbox" checked={form.live_active} onChange={(e) => set('live_active', e.target.checked)} />
          <span><b>Go Live</b> — shows a red <b>LIVE</b> tag after “Contact Us” in the website menu and opens the Live page.</span>
        </label>
        <div className="flex items-center gap-3">
          <button className="btn-gold" disabled={busy}><Save size={16} /> {busy ? 'Saving…' : 'Save'}</button>
          <a href="/live" target="_blank" rel="noreferrer" className="btn-ghost"><Radio size={14} /> View live page</a>
        </div>
      </form>
    </AdminLayout>
  );
}
