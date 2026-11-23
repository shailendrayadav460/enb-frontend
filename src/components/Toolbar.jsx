export default function Toolbar({ filters, departments, onChange, onAdd }) {
  const hasFilters = filters.search || filters.status || filters.department;
  return (
    <div className="toolbar">
      <div className="search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        <input
          type="search"
          placeholder="Search by name, email, phone or role"
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          aria-label="Search employees"
        />
      </div>

      <div className="segmented" role="group" aria-label="Filter by status">
        {['', 'Active', 'Inactive'].map((s) => (
          <button
            key={s || 'all'}
            type="button"
            className={filters.status === s ? 'is-on' : ''}
            aria-pressed={filters.status === s}
            onClick={() => onChange({ status: s })}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      <select value={filters.department} onChange={(e) => onChange({ department: e.target.value })} aria-label="Filter by department">
        <option value="">All departments</option>
        {departments.map((d) => <option key={d} value={d}>{d}</option>)}
      </select>

      {hasFilters && (
        <button type="button" className="btn btn-text" onClick={() => onChange({ search: '', status: '', department: '' })}>
          Clear filters
        </button>
      )}

      <button type="button" className="btn btn-primary toolbar-add" onClick={onAdd}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
        Add employee
      </button>
    </div>
  );
}
