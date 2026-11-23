import { useCallback, useState } from 'react';
import { employeeApi } from './api/client';
import useEmployees from './hooks/useEmployees';
import useDebounce from './hooks/useDebounce';
import StatCards from './components/StatCards';
import Toolbar from './components/Toolbar';
import EmployeeTable from './components/EmployeeTable';
import Pagination from './components/Pagination';
import EmployeeForm from './components/EmployeeForm';
import EmployeeDetails from './components/EmployeeDetails';
import ConfirmDialog from './components/ConfirmDialog';
import Toasts from './components/Toasts';

const PAGE_SIZE = 8;

export default function App() {
  const [filters, setFilters] = useState({ search: '', status: '', department: '', page: 1, sort: '-createdAt' });
  const debouncedSearch = useDebounce(filters.search);
  const query = { ...filters, search: debouncedSearch, limit: PAGE_SIZE };

  const { data, pagination, stats, departments, loading, error, refetch } = useEmployees(query);

  const [formFor, setFormFor] = useState(null); // null | 'new' | employee
  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4500);
  }, []);

  const change = (patch) => setFilters((f) => ({ ...f, ...patch, page: patch.page ?? 1 }));

  const save = async (values) => {
    if (formFor === 'new') {
      await employeeApi.create(values);
      toast('Employee added');
    } else {
      const res = await employeeApi.update(formFor._id, values);
      if (viewing?._id === formFor._id) setViewing(res.data);
      toast('Changes saved');
    }
    setFormFor(null);
    refetch();
  };

  const remove = async () => {
    try {
      await employeeApi.remove(deleting._id);
      toast(`${deleting.name} deleted`);
      if (viewing?._id === deleting._id) setViewing(null);
      setDeleting(null);
      if (data.length === 1 && filters.page > 1) change({ page: filters.page - 1 });
      else refetch();
    } catch (err) {
      toast(err.message, 'error');
      setDeleting(null);
      refetch();
    }
  };

  const hasFilters = Boolean(filters.search || filters.status || filters.department);

  return (
    <div className="shell">
      <aside className="rail" aria-label="Primary">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">S</span>
          <span className="brand-name">Staffbook</span>
        </div>
        <nav>
          <a className="nav-item is-current" href="#employees" aria-current="page">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14a6.5 6.5 0 0 1 3.5 6" /></svg>
            Employees
          </a>
        </nav>
        <p className="rail-foot muted">Signed in as Admin</p>
      </aside>

      <main className="main" id="employees">
        <header className="page-head">
          <div>
            <h1>Employees</h1>
            <p className="muted">Manage records, status and details for everyone in the company.</p>
          </div>
        </header>

        <StatCards stats={stats} loading={loading} />

        <Toolbar filters={filters} departments={departments} onChange={change} onAdd={() => setFormFor('new')} />

        {error && (
          <div className="alert alert-row" role="alert">
            <span>{error}</span>
            <button type="button" className="btn btn-ghost" onClick={refetch}>Try again</button>
          </div>
        )}

        <EmployeeTable
          employees={error ? [] : data}
          loading={loading}
          sort={filters.sort}
          onSort={(sort) => change({ sort })}
          onView={setViewing}
          onEdit={setFormFor}
          onDelete={setDeleting}
          hasFilters={hasFilters}
          onAdd={() => setFormFor('new')}
        />

        {!error && <Pagination pagination={pagination} onPage={(page) => change({ page })} />}
      </main>

      {formFor && <EmployeeForm employee={formFor === 'new' ? null : formFor} departments={departments} onSubmit={save} onClose={() => setFormFor(null)} />}
      {viewing && !formFor && <EmployeeDetails employee={viewing} onClose={() => setViewing(null)} onEdit={setFormFor} onDelete={setDeleting} />}
      {deleting && <ConfirmDialog employee={deleting} onConfirm={remove} onClose={() => setDeleting(null)} />}
      <Toasts toasts={toasts} onDismiss={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />
    </div>
  );
}
