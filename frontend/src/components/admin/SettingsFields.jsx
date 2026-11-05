import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import ImageUpload from './ImageUpload';
import { useToast } from './Toast';
import { getAdminSettings, updateSettings } from '../../api/admin';
import { errorMessage } from '../../api/axiosInstance';

// Edits a subset of site_settings. fields: [{ key, label, textarea?, rows?, hint? }]
export default function SettingsFields({ fields }) {
  const toast = useToast();
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getAdminSettings()
      .then((s) => setForm(Object.fromEntries(fields.map((f) => [f.key, s[f.key] ?? '']))))
      .catch((e) => toast.error(errorMessage(e, 'Failed to load settings')));
    // eslint-disable-next-line
  }, []);

  if (!form) return <p className="text-slate-500">Loading…</p>;

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try { await updateSettings(form); toast.success('Saved'); }
    catch (err) { toast.error(errorMessage(err, 'Failed to save')); }
    finally { setBusy(false); }
  };

  return (
    <form onSubmit={save} className="max-w-3xl space-y-4 rounded-xl bg-white p-5 shadow-sm">
      {fields.map((f) => (
        <div key={f.key}>
          <label className="label" htmlFor={f.key}>{f.label}</label>
          {f.options
            ? <select id={f.key} className="field" value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}>{f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
            : f.image
            ? <ImageUpload id={f.key} aspect={f.aspect} value={form[f.key]} onChange={(u) => setForm({ ...form, [f.key]: u })} />
            : f.textarea
            ? <textarea id={f.key} rows={f.rows || 8} className="field" value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
            : <input id={f.key} className="field" value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />}
          {f.hint && <p className="mt-1 text-xs text-slate-500">{f.hint}</p>}
        </div>
      ))}
      <button className="btn-gold" disabled={busy}><Save size={16} /> {busy ? 'Saving…' : 'Save'}</button>
    </form>
  );
}
