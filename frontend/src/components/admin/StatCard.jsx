const TONES = {
  navy: 'text-navy-900',
  gold: 'text-gold-600',
  blue: 'text-navy-600',
  slate: 'text-slate-600',
};

// Soft raised tile: icon in a pressed-in disc, big figure, label.
export default function StatCard({ icon: Icon, label, value, tone = 'navy' }) {
  return (
    <div className="tile flex items-center gap-4 rounded-2xl p-5">
      <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full [box-shadow:var(--inset)] ${TONES[tone]}`}>
        <Icon size={22} strokeWidth={1.75} />
      </span>
      <div>
        <div className="text-3xl font-semibold tabular-nums leading-none text-navy-950">{value ?? '–'}</div>
        <div className="mt-1.5 text-sm text-slate-600">{label}</div>
      </div>
    </div>
  );
}
