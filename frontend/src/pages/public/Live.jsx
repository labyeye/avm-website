import { useEffect } from "react";
import SiteLayout from "../../components/public/SiteLayout";
import { youtubeId } from "../../components/public/Testimonials";
import useLive from "../../api/useLive";

export default function Live() {
  const live = useLive();
  const id = youtubeId(live.url);
  useEffect(() => { document.title = "Live | Adarsh Vidya Mandir"; }, []);
  return (
    <SiteLayout>
      <section className="bg-navy-900 px-4 pb-6 pt-10 md:px-10 lg:px-20">
        <div className="mx-auto max-w-6xl">
          {live.active && (
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-red-600 px-3 py-1 text-xs font-bold tracking-wider text-white">
              <span className="h-2 w-2 animate-pulse rounded-full bg-white" /> LIVE
            </span>
          )}
          <h1 className="text-3xl font-bold md:text-5xl">{live.title}</h1>
        </div>
      </section>
      <div className="section mx-auto max-w-6xl bg-navy-700">
        {live.active && id ? (
          <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl">
            <iframe
              src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`}
              title={live.title}
              className="h-full w-full"
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <p className="py-16 text-center text-white/80">
            There is no live broadcast right now. Please check back later.
          </p>
        )}
      </div>
    </SiteLayout>
  );
}
