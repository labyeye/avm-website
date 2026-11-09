import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import Cropper from 'react-easy-crop';
import { Crop, ZoomIn } from 'lucide-react';
import { cropToFile, imageSize } from '../../lib/cropImage';

const PRESETS = [
  { label: 'Original', value: 'original' },
  { label: '1:1', value: 1 },
  { label: '4:3', value: 4 / 3 },
  { label: '3:2', value: 3 / 2 },
  { label: '16:9', value: 16 / 9 },
  { label: '9:16', value: 9 / 16 },
];
const same = (a, b) => typeof a === 'number' && typeof b === 'number' && Math.abs(a - b) < 0.01;

/**
 * Crop dialog for one image file. Drag to move, slider/scroll to zoom, pick a shape.
 * onDone(file) gets the cropped file (or the original via "Use original"); onCancel() abandons it.
 * aspect: recommended width/height for the place this image is used (optional).
 */
export default function ImageCropModal({ file, aspect, title = 'Crop image', onDone, onCancel }) {
  // Object URL is created inside the effect (not in render) so React StrictMode's double-run can't revoke a URL we still show.
  const [src, setSrc] = useState(null);
  useEffect(() => {
    const url = URL.createObjectURL(file);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const [natural, setNatural] = useState(null);
  const [failed, setFailed] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState(null);
  const [busy, setBusy] = useState(false);
  const [choice, setChoice] = useState(aspect ?? 'original');

  useEffect(() => {
    if (!src) return;
    let live = true;
    imageSize(src).then((n) => live && setNatural(n)).catch(() => live && setFailed(true));
    return () => { live = false; };
  }, [src]);

  const presets = useMemo(() => {
    const list = [...PRESETS];
    if (aspect && !list.some((p) => same(p.value, aspect))) list.splice(1, 0, { label: 'Recommended', value: aspect });
    return list;
  }, [aspect]);

  const ratio = choice === 'original' ? (natural ? natural.width / natural.height : 1) : choice;

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onCancel();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onCancel]);

  const onComplete = useCallback((_, pixels) => setArea(pixels), []);

  const apply = async () => {
    if (!area) return;
    setBusy(true);
    try { onDone(await cropToFile(src, area, file)); }
    finally { setBusy(false); }
  };

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/70" onClick={onCancel} />
      <div className="relative w-full max-w-2xl overflow-hidden rounded-xl bg-white text-slate-800 shadow-2xl">
        <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-3 font-semibold"><Crop size={18} /> {title}</div>

        <div className="relative h-[55vh] min-h-[280px] bg-slate-900">
          {natural && src && (
            <Cropper image={src} crop={crop} zoom={zoom} aspect={ratio} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onComplete} />
          )}
          {!natural && (
            <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-white/70">
              {failed ? 'This image could not be read. Choose a different file, or press Cancel.' : 'Loading image…'}
            </div>
          )}
        </div>

        <div className="space-y-3 px-5 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Shape</span>
            {presets.map((p) => {
              const on = choice === p.value || same(choice, p.value);
              return (
                <button key={p.label} type="button" onClick={() => { setChoice(p.value); setCrop({ x: 0, y: 0 }); }}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${on ? 'bg-navy-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {p.label}
                </button>
              );
            })}
          </div>
          <label className="flex items-center gap-3 text-xs font-semibold text-slate-500">
            <ZoomIn size={16} /> Zoom
            <input type="range" min={1} max={4} step={0.01} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="flex-1" />
          </label>
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 px-5 py-3">
          <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>
          <button type="button" className="btn-ghost" onClick={() => onDone(file)}>Use original</button>
          <button type="button" className="btn-gold" disabled={!area || busy} onClick={apply}>{busy ? 'Cropping…' : 'Crop & use'}</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
