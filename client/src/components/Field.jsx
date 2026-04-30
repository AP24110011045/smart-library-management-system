const Field = ({ label, error, ...props }) => (
  <label className="block">
    <span className="text-sm font-bold text-ink/70">{label}</span>
    <input className="mt-2 w-full rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 outline-none ring-clay/30 transition focus:ring-4" {...props} />
    {error && <span className="mt-1 block text-sm text-red-600">{error}</span>}
  </label>
);

export default Field;
