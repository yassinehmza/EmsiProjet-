export default function Sparkline({ data = [], max, className = '' }) {
  const m = max ?? Math.max(1, ...data);
  return (
    <div className={`flex items-end gap-1 h-12 ${className}`}>
      {data.map((v, i) => (
        <div key={i} className="w-3 bg-emerald-600 rounded" style={{ height: `${(v / m) * 100}%` }} />
      ))}
    </div>
  );
}
