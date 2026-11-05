import { useEffect, useRef, useState } from 'react';

const reduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Slides its children in from the left/right (or up) each time they scroll into view,
 * and resets when they leave so the animation plays again on the next visit.
 * clip: crop the sideways travel inside this box (use for full-width sections).
 */
export default function Reveal({ from = 'left', delay = 0, distance = 120, clip = false, className = '', children }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(() => reduced() || typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    if (reduced() || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setShown(e.isIntersecting), { threshold: 0, rootMargin: '0px 0px -10% 0px' });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const hidden = from === 'up' ? `translateY(${distance / 2}px)` : `translateX(${from === 'left' ? -distance : distance}px)`;

  return (
    <div ref={ref} className={clip ? 'overflow-x-clip' : undefined}>
      <div
        className={className}
        style={{
          opacity: shown ? 1 : 0,
          transform: shown ? 'none' : hidden,
          transition: `opacity .7s ease ${delay}ms, transform .8s cubic-bezier(.22,.8,.3,1) ${delay}ms`,
          willChange: 'transform, opacity',
        }}
      >
        {children}
      </div>
    </div>
  );
}
