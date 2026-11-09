// "AVM in numbers" strip. Values: Admin → Home Page → Parent Info (stat1_value / stat1_label … stat5). Empty pairs are skipped.
export default function StatsStrip({ settings }) {
  const stats = [1, 2, 3, 4, 5]
    .map((n) => ({ value: settings[`stat${n}_value`], label: settings[`stat${n}_label`] }))
    .filter((s) => s.value && s.label);
  if (!stats.length) return null;
  return (
    <section className="bg-navy-900 py-8 text-white">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 text-center md:grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="text-3xl font-bold text-gold-400 md:text-4xl">{s.value}</div>
            <div className="mt-1 text-xs uppercase tracking-wider text-white/80">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
