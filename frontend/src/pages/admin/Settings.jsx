import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useToast } from '../../components/admin/Toast';
import { getAdminSettings, updateSettings } from '../../api/admin';
import { errorMessage } from '../../api/axiosInstance';

const FIELDS = [
  { key: 'contact_email', label: 'Contact Email', type: 'email' },
  { key: 'contact_phone', label: 'Phone' },
  { key: 'address', label: 'Address' },
  { key: 'facebook_url', label: 'Facebook URL' },
  { key: 'instagram_url', label: 'Instagram URL' },
  { key: 'youtube_url', label: 'YouTube URL' },
];

export default function Settings() {
  const toast = useToast();
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getAdminSettings()
      .then((s) => setForm(Object.fromEntries(FIELDS.map((f) => [f.key, s[f.key] ?? '']))))
      .catch((e) => toast.error(errorMessage(e, 'Failed to load settings')));
  }, [toast]);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await updateSettings(form);
      toast.success('Settings saved');
    } catch (err) {
      toast.error(errorMessage(err, 'Failed to save settings'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AdminLayout title="Site Settings">
      {!form ? <p className="text-slate-500">Loading…</p> : (
        <form onSubmit={save} className="max-w-3xl space-y-4 rounded-xl bg-white p-5 shadow-sm">
          {FIELDS.map((f) => (
            <div key={f.key}>
              <label className="label" htmlFor={f.key}>{f.label}</label>
              {f.textarea
                ? <textarea id={f.key} rows={10} className="field" value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
                : <input id={f.key} type={f.type || 'text'} className="field" value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />}
            </div>
          ))}
          <button className="btn-gold" disabled={busy}><Save size={16} /> {busy ? 'Saving…' : 'Save All Settings'}</button>
        </form>
      )}
    </AdminLayout>
  );
}
