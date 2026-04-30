const StatCard = ({ label, value, tone = 'bg-paper' }) => (
  <div className={`${tone} rounded-3xl border border-ink/10 p-5 shadow-soft`}>
    <p className="text-sm font-medium text-ink/60">{label}</p>
    <p className="mt-2 font-display text-4xl font-bold text-ink">{value ?? 0}</p>
  </div>
);

export default StatCard;
