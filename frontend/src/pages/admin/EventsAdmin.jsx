import { useEffect, useRef, useState } from 'react';
import { Pencil, Trash2, Eye, EyeOff, Plus, ArrowLeft, ArrowRight, ImagePlus, Film, BookOpen, ExternalLink, Images } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import ImageUpload from '../../components/admin/ImageUpload';
import VideoUpload from '../../components/admin/VideoUpload';
import { useToast } from '../../components/admin/Toast';
import { eventsApi, eventMediaApi, uploadImage } from '../../api/admin';
import { errorMessage } from '../../api/axiosInstance';

const today = () => new Date().toISOString().slice(0, 10);
const blank = () => ({ title: '', event_date: today(), location: '', description: '', poster_url: '', sort_order: 0, is_active: true });

/* ---------- Media manager for one event ---------- */
function MediaManager({ event, onBack }) {
  const toast = useToast();
  const fileInput = useRef(null);
  const [rows, setRows] = useState([]);
  const [progress, setProgress] = useState(null);
  const [video, setVideo] = useState({ url: '', caption: '' });
  const [deleting, setDeleting] = useState(null);

  const load = () => eventMediaApi.list(event.id).then(setRows).catch((e) => toast.error(errorMessage(e, 'Failed to load media')));
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [event.id]);

  const nextOrder = () => rows.reduce((m, r) => Math.max(m, Number(r.sort_order)), 0) + 1;

  const uploadPhotos = async (e) => {
    const files = [...(e.target.files || [])];
    e.target.value = '';
    if (!files.length) return;
    let order = nextOrder(), done = 0, failed = 0;
    for (const f of files) {
      setProgress(`${done + failed + 1}/${files.length}`);
      try {
        const { url } = await uploadImage(f);
        await eventMediaApi.create({ event_id: event.id, type: 'photo', url, caption: '', sort_order: order++, in_album: true, is_active: true });
        done++;
      } catch (err) { failed++; toast.error(`${f.name}: ${errorMessage(err, 'upload failed')}`); }
    }
    setProgress(null);
    if (done) toast.success(`${done} photo${done > 1 ? 's' : ''} uploaded`);
    load();
  };

  const addVideo = async () => {
    if (!video.url) return toast.error('Upload a video or paste a YouTube link first');
    try {
      await eventMediaApi.create({ event_id: event.id, type: 'video', url: video.url, caption: video.caption, sort_order: nextOrder(), in_album: false, is_active: true });
      setVideo({ url: '', caption: '' });
      toast.success('Video added');
      load();
    } catch (err) { toast.error(errorMessage(err)); }
  };

  const patch = async (id, body, ok) => {
    try { await eventMediaApi.update(id, body); if (ok) toast.success(ok); load(); }
    catch (err) { toast.error(errorMessage(err)); }
  };

  // Swap sort positions with the neighbour (within the same type).
  const move = async (list, i, d) => {
    const a = list[i], b = list[i + d];
    if (!b) return;
    const sa = Number(a.sort_order), sb = Number(b.sort_order);
    // equal orders (legacy rows): fall back to index-based values
    const [na, nb] = sa === sb ? [b.id > a.id ? sb + 1 : sb - 1, sb] : [sb, sa];
    try { await Promise.all([eventMediaApi.update(a.id, { sort_order: na }), eventMediaApi.update(b.id, { sort_order: nb })]); load(); }
    catch (err) { toast.error(errorMessage(err)); }
  };

  const photos = rows.filter((r) => r.type === 'photo');
  const videos = rows.filter((r) => r.type === 'video');

  const Card = ({ r, list, i }) => (
    <div className={`overflow-hidden rounded-xl border bg-white shadow-sm ${Number(r.is_active) ? 'border-slate-200' : 'border-slate-200 opacity-60'}`}>
      <div className="relative aspect-square bg-slate-100">
        {r.type === 'photo'
          ? <img src={r.url} alt="" className="h-full w-full object-cover" />
          : /\/backend\/uploads\//.test(r.url)
            ? <video src={r.url} className="h-full w-full object-cover" muted />
            : <div className="flex h-full items-center justify-center text-slate-400"><Film size={36} /></div>}
        <div className="absolute left-1 top-1 flex gap-1">
          <button className="rounded bg-white/90 p-1 shadow disabled:opacity-30" disabled={i === 0} onClick={() => move(list, i, -1)} aria-label="Move earlier"><ArrowLeft size={14} /></button>
          <button className="rounded bg-white/90 p-1 shadow disabled:opacity-30" disabled={i === list.length - 1} onClick={() => move(list, i, 1)} aria-label="Move later"><ArrowRight size={14} /></button>
        </div>
      </div>
      <div className="space-y-2 p-2">
        <input
          className="field !py-1 text-xs" placeholder="Caption (optional)" defaultValue={r.caption}
          onBlur={(e) => e.target.value !== r.caption && patch(r.id, { caption: e.target.value })}
        />
        <div className="flex items-center justify-between">
          {r.type === 'photo'
            ? <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={!!Number(r.in_album)} onChange={(e) => patch(r.id, { in_album: e.target.checked })} /> <BookOpen size={12} /> Album</label>
            : <span />}
          <div className="flex gap-1">
            <button className="btn-ghost !px-2 !py-1" aria-label="Toggle visibility" onClick={() => patch(r.id, { is_active: !Number(r.is_active) })}>{Number(r.is_active) ? <Eye size={14} /> : <EyeOff size={14} />}</button>
            <button className="btn-ghost !px-2 !py-1 text-red-600" aria-label="Delete" onClick={() => setDeleting(r)}><Trash2 size={14} /></button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <button className="btn-ghost" onClick={onBack}><ArrowLeft size={16} /> All events</button>
        <h2 className="text-lg font-semibold">{event.title}</h2>
        <a href={`/events/${event.id}`} target="_blank" rel="noreferrer" className="btn-ghost ml-auto"><ExternalLink size={14} /> View on site</a>
      </div>

      <section className="rounded-xl bg-white p-5 shadow-sm">
        <h3 className="mb-1 font-semibold">Photos <span className="text-sm font-normal text-slate-500">({photos.length})</span></h3>
        <p className="mb-3 text-sm text-slate-500">Select many photos at once. Each photo appears in the gallery (with download); tick “Album” to include it as a page in the flip album, whose cover is the event poster.</p>
        <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple className="hidden" onChange={uploadPhotos} />
        <button className="btn-gold" disabled={progress !== null} onClick={() => fileInput.current.click()}>
          <ImagePlus size={16} /> {progress ? `Uploading ${progress}…` : 'Upload photos'}
        </button>
        <p className="mt-2 text-xs text-slate-500">JPG, PNG, WEBP or GIF, up to 50 MB each.</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {photos.map((r, i) => <Card key={r.id} r={r} list={photos} i={i} />)}
        </div>
      </section>

      <section className="rounded-xl bg-white p-5 shadow-sm">
        <h3 className="mb-3 font-semibold">Videos <span className="text-sm font-normal text-slate-500">({videos.length})</span></h3>
        <div className="max-w-xl space-y-2">
          <VideoUpload value={video.url} onChange={(url) => setVideo({ ...video, url })} />
          <input className="field" placeholder="Caption (optional)" value={video.caption} onChange={(e) => setVideo({ ...video, caption: e.target.value })} />
          <button className="btn-gold" onClick={addVideo}><Plus size={16} /> Add video</button>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {videos.map((r, i) => <Card key={r.id} r={r} list={videos} i={i} />)}
        </div>
      </section>

      <Modal open={!!deleting} title="Delete this item?" onClose={() => setDeleting(null)}
        footer={<>
          <button className="btn-ghost" onClick={() => setDeleting(null)}>Cancel</button>
          <button className="btn-danger" onClick={async () => { try { await eventMediaApi.remove(deleting.id); toast.success('Deleted'); load(); } catch (e) { toast.error(errorMessage(e)); } setDeleting(null); }}>Delete</button>
        </>}>
        This removes it from the event gallery{deleting?.type === 'photo' ? ' and album' : ''}.
      </Modal>
    </div>
  );
}

/* ---------- Events list ---------- */
export default function EventsAdmin() {
  const toast = useToast();
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [managing, setManaging] = useState(null);

  const load = () => eventsApi.list().then(setRows).catch((e) => toast.error(errorMessage(e, 'Failed to load events')));
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const run = async (fn, ok) => {
    try { await fn(); toast.success(ok); await load(); return true; }
    catch (e) { toast.error(errorMessage(e)); return false; }
  };
  const save = async (e) => {
    e.preventDefault();
    const ok = form.id ? await run(() => eventsApi.update(form.id, form), 'Event updated') : await run(() => eventsApi.create(form), 'Event added');
    if (ok) setForm(null);
  };
  const set = (k, v) => setForm({ ...form, [k]: v });

  if (managing) {
    return <AdminLayout title="Event Media"><MediaManager event={managing} onBack={() => { setManaging(null); load(); }} /></AdminLayout>;
  }

  return (
    <AdminLayout title="Events">
      <DataTable
        rows={rows}
        searchKeys={['title', 'location']}
        toolbar={<button className="btn-gold" onClick={() => setForm(blank())}><Plus size={16} /> Add Event</button>}
        columns={[
          { key: 'poster_url', label: 'Poster', render: (r) => r.poster_url ? <img src={r.poster_url} alt="" className="h-14 w-10 rounded object-cover" /> : '–' },
          { key: 'title', label: 'Title' },
          { key: 'event_date', label: 'Date', render: (r) => String(r.event_date).slice(0, 10) },
          { key: 'location', label: 'Location' },
          { key: 'is_active', label: 'Status', render: (r) => Number(r.is_active)
            ? <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">Active</span>
            : <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">Hidden</span> },
        ]}
        actions={(r) => (
          <div className="flex gap-2">
            <button className="btn-ghost !px-3 !py-1" onClick={() => setManaging(r)}><Images size={14} /> Photos & Videos</button>
            <button className="btn-ghost !px-2 !py-1" aria-label="Edit" onClick={() => setForm({ ...r, event_date: String(r.event_date).slice(0, 10), is_active: !!Number(r.is_active) })}><Pencil size={14} /></button>
            <button className="btn-ghost !px-2 !py-1" aria-label="Toggle" onClick={() => run(() => eventsApi.update(r.id, { is_active: !Number(r.is_active) }), 'Visibility updated')}>{Number(r.is_active) ? <Eye size={14} /> : <EyeOff size={14} />}</button>
            <button className="btn-ghost !px-2 !py-1 text-red-600" aria-label="Delete" onClick={() => setDeleting(r)}><Trash2 size={14} /></button>
          </div>
        )}
      />

      <Modal open={!!form} title={form?.id ? 'Edit Event' : 'Add Event'} onClose={() => setForm(null)} wide>
        {form && (
          <form onSubmit={save} className="space-y-3">
            <div><label className="label">Event name</label><input className="field" required value={form.title} onChange={(e) => set('title', e.target.value)} /></div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div><label className="label">Date</label><input type="date" required className="field" value={form.event_date} onChange={(e) => set('event_date', e.target.value)} /></div>
              <div><label className="label">Location / venue</label><input className="field" value={form.location ?? ''} onChange={(e) => set('location', e.target.value)} /></div>
            </div>
            <div><label className="label">Details</label><textarea rows={5} className="field" value={form.description ?? ''} onChange={(e) => set('description', e.target.value)} /></div>
            <div><label className="label">Poster (thumbnail &amp; album cover)</label><ImageUpload aspect={3 / 4} value={form.poster_url} onChange={(u) => set('poster_url', u)} /></div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.is_active} onChange={(e) => set('is_active', e.target.checked)} /> Active (visible on website)</label>
            <p className="text-xs text-slate-500">After saving, use “Photos &amp; Videos” on the event row to add the gallery and album.</p>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className="btn-ghost" onClick={() => setForm(null)}>Cancel</button>
              <button className="btn-gold">Save</button>
            </div>
          </form>
        )}
      </Modal>

      <Modal open={!!deleting} title="Delete event?" onClose={() => setDeleting(null)}
        footer={<>
          <button className="btn-ghost" onClick={() => setDeleting(null)}>Cancel</button>
          <button className="btn-danger" onClick={async () => { await run(() => eventsApi.remove(deleting.id), 'Event deleted'); setDeleting(null); }}>Delete</button>
        </>}>
        Delete <b>{deleting?.title}</b>? Its photo and video entries stay in the database but will no longer be shown.
      </Modal>
    </AdminLayout>
  );
}
