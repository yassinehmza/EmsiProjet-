export default function Card({ title, actions, children, className = '' }) {
  return (
    <div className={`bg-white border rounded-xl shadow-sm ${className}`}>
      {(title || actions) && (
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div className="text-lg font-semibold text-[#05A66B]">{title}</div>
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}
