import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Image as ImageIcon, MapPin, Video } from "lucide-react";
import SiteLayout from "../../components/public/SiteLayout";
import Reveal from "../../components/public/Reveal";
import { getEvents } from "../../api/public";
import { placeholder } from "../../api/assets";

export const fmtDate = (d) =>
  d ? new Date(`${String(d).slice(0, 10)}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "";

const FROM = ["left", "up", "right"];

export default function Events() {
  const [events, setEvents] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    document.title = "Events | Adarsh Vidya Mandir";
    getEvents().then(setEvents).catch(() => setError(true));
  }, []);

  return (
    <SiteLayout>
      <section className="relative flex h-48 items-end bg-gradient-to-br from-navy-900 to-navy-700 md:h-64">
        <div className="relative px-4 pb-6 md:px-10 lg:px-20">
          <Reveal from="left" distance={160}><h1 className="text-3xl font-bold md:text-5xl">Events</h1></Reveal>
          <Reveal from="right" distance={160} delay={120}><p className="mt-1 text-white/90">Celebrations, competitions and memories from AVM</p></Reveal>
        </div>
      </section>

      <div className="section mx-auto max-w-6xl bg-navy-700">
        {error && <p className="text-center text-white/80">Could not load events.</p>}
        {!error && !events && <p className="text-center text-white/80">Loading…</p>}
        {events && !events.length && <p className="text-center text-white/80">No events yet. Please check back soon.</p>}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {(events || []).map((e, i) => (
            <Reveal key={e.id} from={FROM[i % 3]} delay={(i % 3) * 90} distance={90}>
              <Link to={`/events/${e.id}`} className="lift group block overflow-hidden rounded-2xl bg-white/10">
                <div className="relative aspect-[3/4] overflow-hidden bg-navy-900">
                  <img
                    src={e.poster_url || placeholder(600, 800, e.title, "16346b")}
                    alt={e.title}
                    loading="lazy"
                    onError={(ev) => { ev.currentTarget.onerror = null; ev.currentTarget.src = placeholder(600, 800, e.title, "16346b"); }}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                  <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-gold-500 px-3 py-1 text-xs font-semibold text-navy-950">
                    <CalendarDays size={13} /> {fmtDate(e.event_date)}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 transition duration-300 group-hover:translate-y-0">
                    <h3 className="text-lg font-semibold leading-snug">{e.title}</h3>
                    {e.location && <p className="mt-1 flex items-center gap-1 text-xs text-white/80"><MapPin size={12} /> {e.location}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-4 px-4 py-3 text-xs text-white/70">
                  <span className="flex items-center gap-1"><ImageIcon size={14} /> {e.photo_count} photos</span>
                  <span className="flex items-center gap-1"><Video size={14} /> {e.video_count} videos</span>
                  <span className="ml-auto font-semibold text-gold-400 transition group-hover:translate-x-1">View →</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}
