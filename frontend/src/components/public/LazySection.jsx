import { Suspense, useEffect, useRef, useState } from 'react';

// Renders children (and therefore fetches their data, images and code) only when the
// placeholder gets near the viewport. Keeps the first load to just the hero.
export default function LazySection({ children, minHeight = 480, margin = '500px' }) {
  const ref = useRef(null);
  const [show, setShow] = useState(typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    if (show || !ref.current) return undefined;
    const io = new IntersectionObserver(
      (entries) => { if (entries.some((e) => e.isIntersecting)) { setShow(true); io.disconnect(); } },
      { rootMargin: `${margin} 0px` },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [show, margin]);

  return (
    <div ref={ref} style={show ? undefined : { minHeight }}>
      {show && <Suspense fallback={<div style={{ minHeight }} />}>{children}</Suspense>}
    </div>
  );
}
