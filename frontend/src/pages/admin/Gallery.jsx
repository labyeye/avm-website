import { useEffect, useRef, useState } from 'react';
import { Pencil, Trash2, Eye, EyeOff, Upload, CheckSquare, Square } from 'lucide-react';
import { PageShell } from '../../components/admin/AdminLayout';
import Modal from '../../components/admin/Modal';
import { useToast } from '../../components/admin/Toast';
import { galleryApi, uploadImage } from '../../api/admin';
import { errorMessage } from '../../api/axiosInstance';
import ImageUpload from '../../components/admin/ImageUpload';
import ImageCropModal from '../../components/admin/ImageCropModal';
import { placeholder } from '../../api/assets';

function GalleryForm({ value, onChange }) {
  const set = (k, v) => onChange({ ...value, [k]: v });
  return (
    <div className="space-y-3">
      <div><label className="label">Image</label><ImageUpload value={value.image_url} onChange={(u) => set('image_url', u)} /></div>
      <div><label className="label">Caption</label><input className="field" value={value.caption} onChange={(e) => set('caption', e.target.value)} /></div>
      <div><label className="label">Sort Order</label><input type="number" className="field" value={value.sort_order} onChange={(e) => set('sort_order', e.target.value)} /></div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!value.is_active} onChange={(e) => set('is_active', e.target.checked)} /> Active</label>
    </div>
  );
}

export default function Gallery({ embedded = false }) {
  const toast = useToast();
  const picker = useRef(null);
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);       // single item
  const [bulkDelete, setBulkDelete] = useState(false);  // confirm modal for selected
  const [selected, setSelected] = useState(new Set());
  const [upload, setUpload] = useState(null);           // { done, total }
  const [dragging, setDragging] = useState(false);
  const [cropEach, setCropEach] = useState(false);       // optional: crop every image before it uploads
  const [cropReq, setCropReq] = useState(null);           // { file, resolve } while the crop dialog is open
  const askCrop = (file) => new Promise((resolve) => setCropReq({ file, resolve }));

  const load = () => galleryApi.list().then(setItems).catch((e) => toast.error(errorMessage(e, 'Failed to load gallery')));
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const run = async (fn, okMsg) => {
    try { await fn(); toast.success(okMsg); await load(); return true; }
    catch (e) { toast.error(errorMessage(e)); return false; }
  };

  // Upload several images in one go; each becomes its own gallery item, appended after the current last one.
  const uploadMany = async (fileList) => {
    const files = [...fileList].filter((f) => f.type.startsWith('image/'));
    if (!files.length) return toast.error('Please choose image files');
    let order = items.reduce((m, i) => Math.max(m, Number(i.sort_order) || 0), 0);
    let ok = 0;
    setUpload({ done: 0, total: files.length });
    for (const original of files) {
      let file = original;
      if (cropEach && original.type !== 'image/gif') {
        file = await askCrop(original);
        if (!file) { setUpload((u) => ({ ...u, done: u.done + 1 })); continue; } // cancelled → skip this image
      }
      try {
        const { url } = await uploadImage(file);
        order += 1;
        await galleryApi.create({ image_url: url, caption: '', sort_order: order, is_active: true });
        ok += 1;
      } catch (e) {
        toast.error(`${original.name}: ${errorMessage(e, 'upload failed')}`);
      }
      setUpload((u) => ({ ...u, done: u.done + 1 }));
    }
    setUpload(null);
    if (ok) toast.success(`${ok} image${ok > 1 ? 's' : ''} added`);
    await load();
  };

  const toggle = (id) => setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const allSelected = items.length > 0 && selected.size === items.length;

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!editing.image_url) return toast.error('Please upload an image');
    if (await run(() => galleryApi.update(editing.id, editing), 'Gallery item updated')) setEditing(null);
  };

  const confirmBulk = async () => {
    const ids = [...selected];
    if (await run(() => galleryApi.removeMany(ids), `${ids.length} image${ids.length > 1 ? 's' : ''} deleted`)) setSelected(new Set());
    setBulkDelete(false);
  };

  return (
    <PageShell embedded={embedded} title="Gallery">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); uploadMany(e.dataTransfer.files); }}
        className={`mb-6 rounded-xl border-2 border-dashed bg-white p-6 text-center shadow-sm transition ${dragging ? 'border-gold-500 bg-gold-500/10' : 'border-slate-300'}`}
      >
        <input ref={picker} type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" className="hidden"
          onChange={(e) => { uploadMany(e.target.files); e.target.value = ''; }} />
        <Upload className="mx-auto mb-2 text-slate-400" />
        <p className="text-sm text-slate-600">Drag & drop images here, or</p>
        <button className="btn-gold mt-3" disabled={!!upload} onClick={() => picker.current.click()}>
          {upload ? `Uploading ${upload.done}/${upload.total}…` : 'Select multiple images'}
        </button>
        <label className="mt-3 inline-flex cursor-pointer items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={cropEach} onChange={(e) => setCropEach(e.target.checked)} /> Crop each image before uploading
        </label>
        <p className="mt-2 text-xs text-slate-500">JPG, PNG, WEBP or GIF, up to 10 MB each. Add captions afterwards with Edit.</p>
      </div>

      {items.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <button className="btn-ghost" onClick={() => setSelected(allSelected ? new Set() : new Set(items.map((i) => i.id)))}>
            {allSelected ? <CheckSquare size={16} /> : <Square size={16} />} {allSelected ? 'Clear selection' : 'Select all'}
          </button>
          {selected.size > 0 && (
            <>
              <span className="text-sm text-slate-600">{selected.size} selected</span>
              <button className="btn-danger" onClick={() => setBulkDelete(true)}><Trash2 size={16} /> Delete selected</button>
            </>
          )}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((it) => {
          const on = selected.has(it.id);
          return (
            <div key={it.id} className={`relative overflow-hidden rounded-xl bg-white shadow-sm ring-2 transition ${on ? 'ring-gold-500' : 'ring-transparent'} ${Number(it.is_active) ? '' : 'opacity-60'}`}>
              <label className="absolute left-2 top-2 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-md bg-white/90 shadow">
                <input type="checkbox" className="h-4 w-4" checked={on} onChange={() => toggle(it.id)} aria-label="Select image" />
              </label>
              <img src={it.image_url} alt={it.caption} className="h-40 w-full object-cover" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = placeholder(400, 300, 'AVM Photo'); }} />
              <div className="p-3">
                <div className="truncate text-sm font-medium">{it.caption || 'No caption'}</div>
                <div className="text-xs text-slate-500">Order {it.sort_order} · {Number(it.is_active) ? 'Active' : 'Hidden'}</div>
                <div className="mt-3 flex gap-2">
                  <button className="btn-ghost !px-2 !py-1" onClick={() => setEditing({ ...it, is_active: !!Number(it.is_active) })} aria-label="Edit"><Pencil size={14} /></button>
                  <button className="btn-ghost !px-2 !py-1" onClick={() => run(() => galleryApi.update(it.id, { is_active: !Number(it.is_active) }), 'Visibility updated')} aria-label="Toggle active">{Number(it.is_active) ? <Eye size={14} /> : <EyeOff size={14} />}</button>
                  <button className="btn-ghost !px-2 !py-1 text-red-600" onClick={() => setDeleting(it)} aria-label="Delete"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          );
        })}
        {!items.length && <p className="text-slate-500">No gallery items yet.</p>}
      </div>

      {cropReq && (
        <ImageCropModal
          file={cropReq.file}
          title={`Crop: ${cropReq.file.name}`}
          onDone={(f) => { cropReq.resolve(f); setCropReq(null); }}
          onCancel={() => { cropReq.resolve(null); setCropReq(null); }}
        />
      )}

      <Modal open={!!editing} title="Edit Gallery Item" onClose={() => setEditing(null)}>
        {editing && (
          <form onSubmit={saveEdit}>
            <GalleryForm value={editing} onChange={setEditing} />
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" className="btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
              <button className="btn-gold">Save</button>
            </div>
          </form>
        )}
      </Modal>

      <Modal open={!!deleting} title="Delete gallery item?" onClose={() => setDeleting(null)}
        footer={<>
          <button className="btn-ghost" onClick={() => setDeleting(null)}>Cancel</button>
          <button className="btn-danger" onClick={async () => { await run(() => galleryApi.remove(deleting.id), 'Gallery item deleted'); setSelected((s) => { const n = new Set(s); n.delete(deleting.id); return n; }); setDeleting(null); }}>Delete</button>
        </>}>
        This cannot be undone.
      </Modal>

      <Modal open={bulkDelete} title={`Delete ${selected.size} images?`} onClose={() => setBulkDelete(false)}
        footer={<>
          <button className="btn-ghost" onClick={() => setBulkDelete(false)}>Cancel</button>
          <button className="btn-danger" onClick={confirmBulk}>Delete {selected.size}</button>
        </>}>
        The selected images will be removed from the gallery permanently.
      </Modal>
    </PageShell>
  );
}
