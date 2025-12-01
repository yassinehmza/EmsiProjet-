export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 transition-colors duration-150 disabled:opacity-70';
  const variants = {
    primary: 'bg-[#05A66B] hover:bg-[#04905c] text-white focus:ring-[#05A66B]',
    secondary: 'bg-white text-gray-800 border border-gray-300 hover:border-[#05A66B] focus:ring-[#05A66B]',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-600',
  };
  const cls = `${base} ${variants[variant] || variants.primary} ${className}`;
  return (
    <button className={cls} {...props}>{children}</button>
  );
}
