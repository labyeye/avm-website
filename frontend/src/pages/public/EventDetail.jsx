import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BookOpen, CalendarDays, ChevronLeft, Download, Image as ImageIcon, MapPin, Video } from "lucide-react";
import SiteLayout from "../../components/public/SiteLayout";
import Reveal from "../../components/public/Reveal";
import PhotoViewer from "../../components/public/PhotoViewer";
import FlipAlbum from "../../components/public/FlipAlbum";
import ZoomImage from "../../components/public/ZoomImage";
import { youtubeId } from "../../components/public/Testimonials";
import { getEvent, eventZipUrl, ZIP_BATCH } from "../../api/public";
import { placeholder } from "../../api/assets";
import { fmtDate } from "./Events";

const fileName = (url = "") => url.split("?")[0].split("/").pop() || "file";
const isLocal = (url = "") => /\/backend\/uploads\//.test(url);

// Download in batches (ZIP of ZIP_BATCH files each) so big events don't time out or exhaust memory.
function BatchDownloads({ eventId, total, type }) {
  const parts = Math.ceil(total / ZIP_BATCH);
  if (!parts) return null;
  return (
    <div className="mb-6 rounded-xl bg-white/10 p-4">
      <p className="mb-3 flex items-center gap-2 text-sm font-medium"><Download size={16} className="text-gold-400" /> Download all {type}s in batches of {ZIP_BATCH}</p>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: parts }, (_, i) => (
          <a key={i} href={eventZipUrl(eventId, type, i + 1)} className="btn-gold !px-3 !py-1.5">
            Part {i + 1} <span className="text-xs font-normal opacity-70">({i * ZIP_BATCH + 1}–{Math.min(total, (i + 1) * ZIP_BATCH)})</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function Photos({ photos, eventId }) {
  const [view, setView] = useState(null);
  if (!photos.length) return <p className="py-10 text-center text-white/70">No photos yet.</p>;
  return (
    <>
      <p className="mb-4 text-sm text-white/70">{photos.length} photos — click a photo to view, or download it.</p>
      <BatchDownloads eventId={eventId} total={photos.length} type="photo" />
      <div className="columns-2 gap-3 md:columns-3 lg:columns-4">
        {photos.map((p, i) => (
          <Reveal key={p.id} from="up" delay={(i % 4) * 70} distance={60}>
            <div className="group relative mb-3 break-inside-avoid overflow-hidden rounded-xl bg-navy-900 shadow-lg">
              <button onClick={() => setView(i)} className="block w-full" aria-label={p.caption || `Open photo ${i + 1}`}>
                <img src={p.url} alt={p.caption || ""} loading="lazy" className="block h-auto min-h-[6rem] w-full cursor-zoom-in transition duration-500 group-hover:scale-105" />
              </button>
              <a
                href={p.url}
                download={fileName(p.url)}
                aria-label="Download photo"
                className="absolute right-2 top-2 rounded-full bg-black/60 p-2 text-white opacity-100 transition hover:bg-gold-500 hover:text-navy-950 md:opacity-0 md:group-hover:opacity-100"
              >
                <Download size={16} />
              </a>
              {p.caption && (
                <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/80 to-transparent p-3 text-xs transition group-hover:translate-y-0">{p.caption}</span>
              )}
            </div>
          </Reveal>
        ))}
      </div>
      {view !== null && <PhotoViewer photos={photos} index={view} onIndex={setView} onClose={() => setView(null)} />}
    </>
  );
}

function Videos({ videos, eventId }) {
  if (!videos.length) return <p className="py-10 text-center text-white/70">No videos yet.</p>;
  const local = videos.filter((v) => isLocal(v.url)).length;
  return (
    <>
      <BatchDownloads eventId={eventId} total={local} type="video" />
      <div className="grid gap-6 md:grid-cols-2">
        {videos.map((v, i) => {
          const yt = youtubeId(v.url);
          return (
            <Reveal key={v.id} from={i % 2 ? "right" : "left"} distance={80}>
              <div className="overflow-hidden rounded-2xl bg-white/10">
                <div className="aspect-video bg-black">
                  {yt ? (
                    <iframe src={`https://www.youtube.com/embed/${yt}`} title={v.caption || "Event video"} className="h-full w-full" allow="fullscreen; encrypted-media" allowFullScreen />
                  ) : (
                    <video src={v.url} controls preload="metadata" className="h-full w-full" />
                  )}
                </div>
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <p className="text-sm font-medium">{v.caption || "Event video"}</p>
                  {isLocal(v.url) && (
                    <a href={v.url} download={fileName(v.url)} className="btn-gold !px-3 !py-1.5"><Download size={14} /> Download</a>
                  )}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </>
  );
}

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [state, setState] = useState("loading");
  const [tab, setTab] = useState(null);

  useEffect(() => {
    setState("loading");
    getEvent(id)
      .then((e) => { setEvent(e); setState("ok"); document.title = `${e.title} | Adarsh Vidya Mandir`; })
      .catch((e) => setState(e.response?.status === 404 ? "missing" : "error"));
  }, [id]);

  const photos = useMemo(() => (event?.media || []).filter((m) => m.type === "photo"), [event]);
  const videos = useMemo(() => (event?.media || []).filter((m) => m.type === "video"), [event]);
  const album = useMemo(() => photos.filter((p) => Number(p.in_album)), [photos]);

  if (state !== "ok") {
    return (
      <SiteLayout>
        <div className="section min-h-[50vh] text-center text-white/80">
          {state === "loading" ? "Loading…" : state === "missing" ? "Event not found." : "Could not load this event."}
          <div className="mt-4"><Link to="/events" className="text-gold-400 underline">Back to events</Link></div>
        </div>
      </SiteLayout>
    );
  }

  const tabs = [
    { id: "photos", label: "Photos", icon: ImageIcon, count: photos.length },
    { id: "videos", label: "Videos", icon: Video, count: videos.length },
    { id: "album", label: "Album", icon: BookOpen, count: album.length },
  ];
  const current = tab || (photos.length || !videos.length ? "photos" : "videos");
  const poster = event.poster_url || placeholder(600, 800, event.title, "16346b");

  return (
    <SiteLayout>
      <section className="relative overflow-hidden bg-navy-900">
        <img src={poster} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-110 object-cover opacity-30 blur-2xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 md:grid-cols-[260px_1fr] md:px-10">
          <Reveal from="left">
            <ZoomImage src={poster} alt={event.title} className="mx-auto aspect-[3/4] w-56 rounded-2xl object-cover shadow-2xl md:w-full" />
          </Reveal>
          <Reveal from="right">
            <div>
              <Link to="/events" className="mb-3 inline-flex items-center gap-1 text-xs text-white/80 hover:text-gold-400"><ChevronLeft size={14} /> All events</Link>
              <h1 className="text-3xl font-bold md:text-5xl">{event.title}</h1>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-gold-400">
                <span className="flex items-center gap-1.5"><CalendarDays size={16} /> {fmtDate(event.event_date)}</span>
                {event.location && <span className="flex items-center gap-1.5"><MapPin size={16} /> {event.location}</span>}
              </div>
              {event.description && <p className="mt-4 whitespace-pre-line leading-7 text-white/85">{event.description}</p>}
            </div>
          </Reveal>
        </div>
      </section>

      <div className="section mx-auto max-w-6xl bg-navy-700">
        <div className="mb-8 flex flex-wrap gap-2 border-b border-white/10 pb-3">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${current === t.id ? "bg-gold-500 text-navy-950" : "bg-white/10 hover:bg-white/20"}`}
            >
              <t.icon size={16} /> {t.label} <span className="text-xs opacity-70">({t.count})</span>
            </button>
          ))}
        </div>
        <div key={current} className="animate-fadeUp">
          {current === "photos" && <Photos photos={photos} eventId={event.id} />}
          {current === "videos" && <Videos videos={videos} eventId={event.id} />}
          {current === "album" && (album.length
            ? <FlipAlbum title={event.title} subtitle={fmtDate(event.event_date)} poster={event.poster_url} photos={album} />
            : <p className="py-10 text-center text-white/70">The album will be available once photos are added.</p>)}
        </div>
      </div>
    </SiteLayout>
  );
}
