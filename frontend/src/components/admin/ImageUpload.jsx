import { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { useToast } from './Toast';
import ImageCropModal from './ImageCropModal';
import { uploadImage } from '../../api/admin';
import { errorMessage } from '../../api/axiosInstance';

// Image picker with a crop step: choose a file → crop (or use original) → upload. Returns the URL via onChange.
// aspect: recommended width/height for where the image is shown (e.g. 16/9, 1, 9/16). GIFs skip cropping to stay animated.
export default function ImageUpload({ value, onChange, id, aspect }) {
  const toast = useToast();
  const input = useRef(null);
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState(null);

  const upload = async (file) => {
    setPending(null);
    setBusy(true);
    try { onChange((await uploadImage(file)).url); }
    catch (err) { toast.error(errorMessage(err, 'Upload failed')); }
    finally { setBusy(false); }
  };

  const pick = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.type === 'image/gif') upload(file); // cropping would flatten the animation
    else setPending(file);
  };

  return (
    <div className="flex items-center gap-3">
      {value && <img src={value} alt="" className="h-16 w-24 rounded object-cover" />}
      <input ref={input} id={id} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={pick} />
      <button type="button" className="btn-ghost" disabled={busy} onClick={() => input.current.click()}>
        <Upload size={16} /> {busy ? 'Uploading…' : value ? 'Replace image' : 'Upload image'}
      </button>
      {value && <button type="button" className="btn-ghost !px-2 text-red-600" aria-label="Remove image" onClick={() => onChange('')}><X size={16} /></button>}
      {pending && <ImageCropModal file={pending} aspect={aspect} onDone={upload} onCancel={() => setPending(null)} />}
    </div>
  );
}
