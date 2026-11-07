import { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Download, X } from "lucide-react";

const fileName = (url = "") => url.split("?")[0].split("/").pop() || "photo.jpg";

// Full-screen photo viewer with next/prev, keyboard arrows, swipe and a download button.
export default function PhotoViewer({ photos, index, onIndex, onClose }) {
  const go = useCallback(
    (d) => onIndex((index + d + photos.length) % photos.length),
    [index, photos.length, onIndex],
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [go, onClose]);

  const p = photos[index];
  if (!p) return null;
  let startX = null;
  const btn = "rounded-full bg-white/15 p-2.5 text-white transition hover:bg-white/30";

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex animate-pop flex-col bg-black/95"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      onTouchStart={(e) => (startX = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (startX === null) return;
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        startX = null;
      }}
    >
      <div className="flex items-center justify-between p-4 text-white" onClick={(e) => e.stopPropagation()}>
        <span className="text-sm text-white/70">{index + 1} / {photos.length}</span>
        <div className="flex gap-2">
          <a href={p.url} download={fileName(p.url)} className={btn} aria-label="Download photo"><Download size={20} /></a>
          <button onClick={onClose} className={btn} aria-label="Close"><X size={20} /></button>
        </div>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 md:px-16">
        {photos.length > 1 && (
          <button onClick={(e) => { e.stopPropagation(); go(-1); }} className={`${btn} absolute left-2 z-10 md:left-5`} aria-label="Previous"><ChevronLeft size={24} /></button>
        )}
        <img
          key={p.url}
          src={p.url}
          alt={p.caption || ""}
          onClick={(e) => e.stopPropagation()}
          className="max-h-full max-w-full animate-pop rounded-lg object-contain shadow-2xl"
        />
        {photos.length > 1 && (
          <button onClick={(e) => { e.stopPropagation(); go(1); }} className={`${btn} absolute right-2 z-10 md:right-5`} aria-label="Next"><ChevronRight size={24} /></button>
        )}
      </div>
      <p className="min-h-[3rem] p-3 text-center text-sm text-white/80">{p.caption}</p>
    </div>,
    document.body,
  );
}
