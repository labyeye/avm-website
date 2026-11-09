import { useRef, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useToast } from './Toast';
import { uploadImage } from '../../api/admin';
import { errorMessage } from '../../api/axiosInstance';

// Gallery field: select several photos at once; value is a JSON array string of URLs.
export const parseGallery = (v) => { try { const a = JSON.parse(v || '[]'); return Array.isArray(a) ? a : []; } catch { return []; } };

export default function MultiImageField({ value, onChange }) {
  const toast = useToast();
  const input = useRef(null);
  const [busy, setBusy] = useState(false);
  const urls = parseGallery(value);
  const emit = (list) => onChange(JSON.stringify(list));

  const add = async (e) => {
    const files = [...(e.target.files || [])];
    e.target.value = '';
    if (!files.length) return;
    setBusy(true);
    const added = [];
    for (const f of files) {
      try { added.push((await uploadImage(f)).url); }
      catch (err) { toast.error(`${f.name}: ${errorMessage(err, 'Upload failed')}`); }
    }
    emit([...urls, ...added]);
    setBusy(false);
  };

  return (
    <div>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
        {urls.map((u, i) => (
          <div key={u + i} className="group relative">
            <img src={u} alt="" className="aspect-square w-full rounded object-cover" />
            <button type="button" aria-label="Remove photo" onClick={() => emit(urls.filter((_, j) => j !== i))}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white"><X size={12} /></button>
          </div>
        ))}
        <button type="button" disabled={busy} onClick={() => input.current.click()}
          className="flex aspect-square items-center justify-center rounded border-2 border-dashed border-slate-300 text-slate-500 hover:bg-slate-50">
          {busy ? <span className="text-xs">Uploading…</span> : <Plus size={20} />}
        </button>
      </div>
      <input ref={input} type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={add} />
    </div>
  );
}
