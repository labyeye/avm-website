import { lazy, Suspense, useEffect, useState } from 'react';
import { X } from 'lucide-react';

const AdmissionForm = lazy(() => import('./AdmissionForm'));

// Red blinking "Admissions Open" button (bottom-left). Click opens the admission form in a popup.
export default function AdmissionsOpenButton() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-30 flex items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-lg animate-admBlink hover:bg-red-700 print:hidden"
      >
        <span className="h-2.5 w-2.5 rounded-full bg-white" /> Admissions Open
      </button>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-3" role="dialog" aria-modal="true" aria-label="Admission enquiry" onClick={() => setOpen(false)}>
          <div className="relative max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-navy-700 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button aria-label="Close" onClick={() => setOpen(false)} className="absolute right-3 top-3 z-10 rounded-full bg-white/15 p-2 transition hover:bg-white/30"><X size={20} /></button>
            <Suspense fallback={<p className="p-10 text-center text-white/80">Loading…</p>}>
              <AdmissionForm />
            </Suspense>
          </div>
        </div>
      )}
    </>
  );
}
