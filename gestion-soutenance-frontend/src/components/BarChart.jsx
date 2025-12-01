export default function BarChart({ series = [], labels = [], className = '' }) {
  const max = Math.max(1, ...series);
  return (
    <div className={`flex items-end gap-3 h-24 ${className}`}>
      {series.map((v, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <div className="w-6 bg-emerald-600 rounded" style={{ height: `${(v / max) * 100}%` }} />
          <div className="text-xs text-gray-600">{labels[i]}</div>
          <div className="text-xs text-emerald-700">{v}</div>
        </div>
      ))}
    </div>
  );
}
