// Renders plain text: blank-line separated paragraphs; lines starting with "## " become headings.
export default function RichText({ text, className = '' }) {
  const blocks = (text || '').split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className={`space-y-4 ${className}`}>
      {blocks.map((b, i) =>
        b.startsWith('## ')
          ? <h2 key={i} className="pt-4 text-2xl font-semibold text-gold-400">{b.slice(3)}</h2>
          : <p key={i} className="whitespace-pre-line leading-relaxed text-white/90">{b}</p>
      )}
    </div>
  );
}
