import { useRef, useState } from 'react';
import { Upload, X, ExternalLink } from 'lucide-react';
import { useToast } from './Toast';
import { uploadFile } from '../../api/admin';
import { errorMessage } from '../../api/axiosInstance';

// Document picker: upload a PDF/JPG/PNG, or paste any link (e.g. a YouTube video). Returns the URL via onChange.
export default function FileUpload({ value, onChange }) {
  const toast = useToast();
  const input = useRef(null);
  const [busy, setBusy] = useState(false);
  const has = value && value !== '#';

  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) return toast.error('File must be 20 MB or smaller');
    setBusy(true);
    try { onChange((await uploadFile(file)).url); toast.success('File uploaded'); }
    catch (err) { toast.error(errorMessage(err, 'Upload failed')); }
    finally { setBusy(false); }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input className="field" placeholder="Upload a file, or paste a link →" value={has ? value : ''} onChange={(e) => onChange(e.target.value)} />
        {has && <a href={value} target="_blank" rel="noreferrer" className="btn-ghost !px-2" aria-label="Open file"><ExternalLink size={16} /></a>}
        {has && <button type="button" className="btn-ghost !px-2 text-red-600" aria-label="Remove file" onClick={() => onChange('')}><X size={16} /></button>}
      </div>
      <input ref={input} type="file" accept="application/pdf,image/jpeg,image/png" className="hidden" onChange={pick} />
      <button type="button" className="btn-ghost" disabled={busy} onClick={() => input.current.click()}>
        <Upload size={16} /> {busy ? 'Uploading…' : has ? 'Replace file' : 'Upload PDF'}
      </button>
      <p className="text-xs text-slate-500">PDF, JPG or PNG, up to 20 MB.</p>
    </div>
  );
}
