// Semantic asset paths — drop real files into /public/assets with the same names.
// If a file is missing, the <img onError> handler swaps in a placehold.co image.
export const asset = (name) => `/assets/${name}`;

export const placeholder = (w, h, text, bg = '0a1628') =>
  `https://placehold.co/${w}x${h}/${bg}/white?text=${encodeURIComponent(text)}`;

export const withFallback = (w, h, text, bg) => (e) => {
  const img = e.currentTarget;
  img.onerror = null;
  img.src = placeholder(w, h, text, bg);
};
