import Avatar from './Avatar';
import StatusBadge from './StatusBadge';
import { formatDate } from '../utils/format';

function SkeletonRows() {
  return Array.from({ length: 6 }).map((_, i) => (
    <tr key={i} className="skeleton-row" aria-hidden="true">
      {Array.from({ length: 6 }).map((__, j) => <td key={j}><span className="skeleton" /></td>)}
    </tr>
  ));
}

export default function EmployeeTable({ employees, loading, sort, onSort, onView, onEdit, onDelete, hasFilters, onAdd }) {
  const sortable = (key, label) => {
    const active = sort === key || sort === `-${key}`;
    const dir = sort === key ? 'asc' : 'desc';
    return (
      <button type="button" className="th-sort" onClick={() => onSort(sort === key ? `-${key}` : key)} aria-label={`Sort by ${label}`}>
        {label}
        <span className={`caret ${active ? `caret-${dir}` : ''}`} aria-hidden="true" />
      </button>
    );
  };

  const empty = !loading && employees.length === 0;

  return (
    <div className="table-card">
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>{sortable('name', 'Employee')}</th>
              <th>Contact</th>
              <th>{sortable('department', 'Department')}</th>
              <th>{sortable('joiningDate', 'Joined')}</th>
              <th>Status</th>
              <th className="th-actions"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className={loading && employees.length ? 'is-refreshing' : ''}>
            {loading && employees.length === 0 ? <SkeletonRows /> : employees.map((e) => (
              <tr key={e._id} onClick={() => onView(e)} tabIndex={0} onKeyDown={(ev) => ev.key === 'Enter' && onView(e)}>
                <td data-label="Employee">
                  <div className="person">
                    <Avatar name={e.name} />
                    <div>
                      <div className="person-name">{e.name}</div>
                      <div className="muted">{e.designation}</div>
                    </div>
                  </div>
                </td>
                <td data-label="Contact">
                  <div>{e.email}</div>
                  <div className="muted">{e.phone}</div>
                </td>
                <td data-label="Department">{e.department}</td>
                <td data-label="Joined">{formatDate(e.joiningDate)}</td>
                <td data-label="Status"><StatusBadge status={e.status} /></td>
                <td className="td-actions" onClick={(ev) => ev.stopPropagation()}>
                  <button type="button" className="icon-btn" title="Edit" aria-label={`Edit ${e.name}`} onClick={() => onEdit(e)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
                  </button>
                  <button type="button" className="icon-btn icon-danger" title="Delete" aria-label={`Delete ${e.name}`} onClick={() => onDelete(e)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v6M14 11v6" /></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {empty && (
        <div className="empty">
          <h3>{hasFilters ? 'No employees match these filters' : 'No employees yet'}</h3>
          <p>{hasFilters ? 'Try a different search term or clear the filters.' : 'Add your first employee to start building the directory.'}</p>
          {!hasFilters && <button type="button" className="btn btn-primary" onClick={onAdd}>Add employee</button>}
        </div>
      )}
    </div>
  );
}
