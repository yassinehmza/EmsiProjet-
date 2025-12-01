export default function Table({ headers = [], children }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-white">
          <tr className="border-b">
            {headers.map((h, i) => (
              <th key={i} className="text-left px-4 py-3 text-sm text-gray-800">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {children}
        </tbody>
      </table>
    </div>
  );
}
