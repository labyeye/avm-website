import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

// Full-screen photo viewer. Click backdrop / X / Esc to close.
export function Lightbox({ src, alt, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={alt || "Photo"}
      onClick={onClose}
    >
      <button
        aria-label="Close photo"
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-white/15 p-2 text-white transition hover:bg-white/30"
      >
        <X size={24} />
      </button>
      <img
        src={src}
        alt={alt || ""}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] max-w-[95vw] rounded-lg object-contain shadow-2xl"
      />
    </div>,
    document.body,
  );
}

// Drop-in <img> that opens in a Lightbox when clicked. Accepts the usual img props.
export default function ZoomImage({ src, alt, className = "", onError, ...rest }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(src);
  useEffect(() => setCurrent(src), [src]);
  return (
    <>
      <img
        {...rest}
        src={current}
        alt={alt}
        onError={(e) => {
          onError?.(e);
          setCurrent(e.currentTarget.src);
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (current) setOpen(true);
        }}
        className={`cursor-zoom-in ${className}`}
      />
      {open && <Lightbox src={current} alt={alt} onClose={() => setOpen(false)} />}
    </>
  );
}
