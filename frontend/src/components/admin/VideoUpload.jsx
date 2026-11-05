import { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { useToast } from './Toast';
import { uploadVideo } from '../../api/admin';
import { errorMessage } from '../../api/axiosInstance';

// Video source: paste a YouTube link OR upload an MP4/WEBM/MOV file. Returns the URL via onChange.
export default function VideoUpload({ value, onChange }) {
  const toast = useToast();
  const input = useRef(null);
  const [progress, setProgress] = useState(null);

  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) return toast.error('Video must be 50 MB or smaller');
    setProgress(0);
    try { onChange((await uploadVideo(file, setProgress)).url); toast.success('Video uploaded'); }
    catch (err) { toast.error(errorMessage(err, 'Video upload failed')); }
    finally { setProgress(null); }
  };

  const uploaded = /\/backend\/uploads\//.test(value || '');

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input className="field" placeholder="Paste a YouTube link, or upload a video →" value={value} onChange={(e) => onChange(e.target.value)} />
        {value && <button type="button" className="btn-ghost !px-2 text-red-600" aria-label="Clear video" onClick={() => onChange('')}><X size={16} /></button>}
      </div>
      <input ref={input} type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden" onChange={pick} />
      <button type="button" className="btn-ghost" disabled={progress !== null} onClick={() => input.current.click()}>
        <Upload size={16} /> {progress !== null ? `Uploading… ${progress}%` : uploaded ? 'Replace video file' : 'Upload video file'}
      </button>
      {uploaded && <video src={value} controls className="mt-2 max-h-48 rounded-lg bg-black" />}
      <p className="text-xs text-slate-500">MP4, WEBM or MOV, up to 50 MB (also limited by your PHP upload settings).</p>
    </div>
  );
}
