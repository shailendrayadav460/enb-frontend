import Modal from './Modal';
import Avatar from './Avatar';
import StatusBadge from './StatusBadge';
import { formatDate, tenure } from '../utils/format';

export default function EmployeeDetails({ employee: e, onClose, onEdit, onDelete }) {
  const rows = [
    ['Email', <a href={`mailto:${e.email}`}>{e.email}</a>],
    ['Phone', <a href={`tel:${e.phone.replace(/\s/g, '')}`}>{e.phone}</a>],
    ['Department', e.department],
    ['Designation', e.designation],
    ['Joining date', formatDate(e.joiningDate)],
    ['Time with company', tenure(e.joiningDate)],
    ['Record created', formatDate(e.createdAt)],
    ['Last updated', formatDate(e.updatedAt)],
  ];
  return (
    <Modal title={`${e.name} details`} onClose={onClose} variant="drawer">
      <header className="panel-head">
        <span className="muted">Employee details</span>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
      </header>
      <div className="panel-body">
        <div className="profile">
          <Avatar name={e.name} size={64} />
          <div>
            <h2>{e.name}</h2>
            <p className="muted">{e.designation}, {e.department}</p>
            <StatusBadge status={e.status} />
          </div>
        </div>
        <dl className="detail-list">
          {rows.map(([k, v]) => (
            <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
          ))}
        </dl>
      </div>
      <footer className="panel-foot">
        <button type="button" className="btn btn-danger-ghost" onClick={() => onDelete(e)}>Delete</button>
        <button type="button" className="btn btn-primary" onClick={() => onEdit(e)}>Edit employee</button>
      </footer>
    </Modal>
  );
}
