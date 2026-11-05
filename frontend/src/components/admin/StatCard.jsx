const COLORS = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-emerald-100 text-emerald-600',
  purple: 'bg-purple-100 text-purple-600',
  orange: 'bg-orange-100 text-orange-600',
};

export default function StatCard({ icon: Icon, label, value, color = 'blue' }) {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm">
      <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${COLORS[color]}`}>
        <Icon size={24} />
      </div>
      <div>
        <div className="text-2xl font-bold text-slate-800">{value ?? '–'}</div>
        <div className="text-sm text-slate-500">{label}</div>
      </div>
    </div>
  );
}
