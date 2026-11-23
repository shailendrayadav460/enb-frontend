import { useState } from 'react';
import Modal from './Modal';

export default function ConfirmDialog({ employee, onConfirm, onClose }) {
  const [busy, setBusy] = useState(false);
  const go = async () => {
    setBusy(true);
    try { await onConfirm(); } finally { setBusy(false); }
  };
  return (
    <Modal title="Confirm delete" onClose={busy ? () => {} : onClose}>
      <div className="panel-body">
        <h2>Delete {employee.name}?</h2>
        <p className="muted confirm-text">This removes the employee record permanently. This action can’t be undone.</p>
      </div>
      <footer className="panel-foot">
        <button type="button" className="btn btn-ghost" onClick={onClose} disabled={busy}>Cancel</button>
        <button type="button" className="btn btn-danger" onClick={go} disabled={busy}>{busy ? 'Deleting…' : 'Delete employee'}</button>
      </footer>
    </Modal>
  );
}
