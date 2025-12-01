export default function Breadcrumbs({ items = [] }) {
  return (
    <nav className="text-sm text-gray-600" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2">
        {items.map((it, idx) => (
          <li key={idx} className="flex items-center gap-2">
            {it.href ? (
              <a href={it.href} className="hover:text-emerald-700">{it.label}</a>
            ) : (
              <span className="text-emerald-700">{it.label}</span>
            )}
            {idx < items.length - 1 && <span>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
