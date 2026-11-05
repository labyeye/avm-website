import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import ImageUpload from './ImageUpload';
import FileUpload from './FileUpload';
import { useToast } from './Toast';
import { getPage, updatePage } from '../../api/admin';
import { errorMessage } from '../../api/axiosInstance';

// Edits title/subtitle/banner/body of one CMS page. `fields` limits which inputs are shown.
export default function PageForm({ slug, fields = ['title', 'subtitle', 'banner_url', 'body', 'is_active'], onLoaded, bannerLabel = 'Banner Image' }) {
  const toast = useToast();
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getPage(slug)
      .then((p) => { setForm({ ...p, is_active: !!Number(p.is_active) }); onLoaded?.(p); })
      .catch((e) => toast.error(errorMessage(e, 'Failed to load page')));
    // eslint-disable-next-line
  }, [slug]);

  if (!form) return <p className="text-slate-500">Loading…</p>;
  const set = (k, v) => setForm({ ...form, [k]: v });

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await updatePage(slug, Object.fromEntries(fields.map((k) => [k, form[k]])));
      toast.success('Page saved');
    } catch (err) {
      toast.error(errorMessage(err, 'Failed to save page'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={save} className="space-y-4 rounded-xl bg-white p-5 shadow-sm">
      {fields.includes('title') && <div><label className="label">Title</label><input className="field" required value={form.title} onChange={(e) => set('title', e.target.value)} /></div>}
      {fields.includes('subtitle') && <div><label className="label">Subtitle</label><input className="field" value={form.subtitle ?? ''} onChange={(e) => set('subtitle', e.target.value)} /></div>}
      {fields.includes('banner_url') && <div><label className="label">{bannerLabel}</label><ImageUpload aspect={1920 / 500} value={form.banner_url ?? ''} onChange={(u) => set('banner_url', u)} /></div>}
      {fields.includes('image_url') && (
        <div>
          <label className="label">Image / Logo beside the text (optional)</label>
          <ImageUpload aspect={1} value={form.image_url ?? ''} onChange={(u) => set('image_url', u)} />
        </div>
      )}
      {fields.includes('file_url') && (
        <div className="space-y-3 rounded-lg border border-slate-200 p-3">
          <div>
            <label className="label">Downloadable file (optional — shows a download button on the page)</label>
            <FileUpload value={form.file_url ?? ''} onChange={(u) => set('file_url', u)} />
          </div>
          {fields.includes('file_label') && (
            <div><label className="label">Button text</label><input className="field" placeholder="Download PDF" value={form.file_label ?? ''} onChange={(e) => set('file_label', e.target.value)} /></div>
          )}
        </div>
      )}
      {fields.includes('body') && (
        <div>
          <label className="label">Content</label>
          <textarea rows={12} className="field font-mono" value={form.body ?? ''} onChange={(e) => set('body', e.target.value)} />
          <p className="mt-1 text-xs text-slate-500">Separate paragraphs with a blank line. Start a line with <code>## </code> for a heading.</p>
        </div>
      )}
      {fields.includes('is_active') && <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_active} onChange={(e) => set('is_active', e.target.checked)} /> Published</label>}
      <button className="btn-gold" disabled={busy}><Save size={16} /> {busy ? 'Saving…' : 'Save'}</button>
    </form>
  );
}
