export default function Modal({ open, onClose, children, title }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg border">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div className="text-emerald-700 font-semibold">{title}</div>
          <button onClick={onClose} className="text-gray-600">✕</button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
