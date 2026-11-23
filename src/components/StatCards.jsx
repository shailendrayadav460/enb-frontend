export default function StatCards({ stats, loading }) {
  const items = [
    { label: 'Total employees', value: stats.total },
    { label: 'Active', value: stats.Active, tone: 'active' },
    { label: 'Inactive', value: stats.Inactive, tone: 'inactive' },
  ];
  return (
    <section className="stats" aria-label="Summary">
      {items.map((i) => (
        <div key={i.label} className={`stat ${i.tone ? `stat-${i.tone}` : ''}`}>
          <span className="stat-label">{i.label}</span>
          <strong className="stat-value">{loading && !stats.total ? '-' : i.value}</strong>
        </div>
      ))}
    </section>
  );
}
