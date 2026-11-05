const loadImage = (src) => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = reject;
  img.src = src;
});

export const imageSize = async (src) => {
  const img = await loadImage(src);
  return { width: img.naturalWidth, height: img.naturalHeight };
};

/**
 * Crops `src` to `area` (pixels, from react-easy-crop) and returns a File.
 * JPEGs stay JPEG; everything else becomes WebP (keeps transparency) or PNG if the browser can't encode WebP.
 * The longest side is capped so uploads stay small.
 */
export async function cropToFile(src, area, original, maxSide = 2400) {
  const img = await loadImage(src);
  const scale = Math.min(1, maxSide / Math.max(area.width, area.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(area.width * scale);
  canvas.height = Math.round(area.height * scale);
  canvas.getContext('2d').drawImage(img, area.x, area.y, area.width, area.height, 0, 0, canvas.width, canvas.height);

  const wantJpeg = original.type === 'image/jpeg';
  const blob = await new Promise((res) => canvas.toBlob(res, wantJpeg ? 'image/jpeg' : 'image/webp', 0.92));
  if (!blob) throw new Error('Could not crop this image');
  const ext = { 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/png': 'png' }[blob.type] || 'png';
  const base = original.name.replace(/\.[^.]+$/, '') || 'image';
  return new File([blob], `${base}-cropped.${ext}`, { type: blob.type });
}
