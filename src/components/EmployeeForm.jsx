import { useState } from 'react';
import Modal from './Modal';
import { toInputDate } from '../utils/format';

const DEPARTMENTS = ['Engineering', 'Design', 'Marketing', 'Sales', 'Finance', 'Human Resources', 'Operations', 'Support'];

const blank = { name: '', email: '', phone: '', department: '', designation: '', joiningDate: '', status: 'Active' };

const validate = (v) => {
  const e = {};
  if (v.name.trim().length < 2) e.name = 'Enter the employee’s full name (at least 2 characters).';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = 'Enter a valid email address, like name@company.com.';
  if (!/^[+]?[\d\s-]{7,15}$/.test(v.phone.trim())) e.phone = 'Enter a phone number with 7-15 digits.';
  if (!v.department.trim()) e.department = 'Choose or enter a department.';
  if (!v.designation.trim()) e.designation = 'Enter the job title.';
  if (!v.joiningDate) e.joiningDate = 'Pick the joining date.';
  return e;
};

export default function EmployeeForm({ employee, departments, onSubmit, onClose }) {
  const editing = Boolean(employee);
  const [values, setValues] = useState(editing ? { ...blank, ...employee, joiningDate: toInputDate(employee.joiningDate) } : blank);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const deptOptions = [...new Set([...DEPARTMENTS, ...departments])].sort();

  const set = (k) => (e) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    setFormError('');
    if (Object.keys(found).length) return;
    setSaving(true);
    try {
      await onSubmit({
        name: values.name.trim(), email: values.email.trim(), phone: values.phone.trim(),
        department: values.department.trim(), designation: values.designation.trim(),
        joiningDate: values.joiningDate, status: values.status,
      });
    } catch (err) {
      // Map server-side field errors (e.g. duplicate email) back onto the form.
      const fieldErrs = {};
      (err.errors || []).forEach((x) => { if (x.field) fieldErrs[x.field] = x.message; });
      setErrors(fieldErrs);
      setFormError(Object.keys(fieldErrs).length ? '' : err.message);
      setSaving(false);
    }
  };

  const field = (key, label, props = {}) => (
    <div className={`field ${errors[key] ? 'has-error' : ''}`}>
      <label htmlFor={`f-${key}`}>{label}</label>
      <input id={`f-${key}`} value={values[key]} onChange={set(key)} aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `e-${key}` : undefined} {...props} />
      {errors[key] && <span className="field-error" id={`e-${key}`}>{errors[key]}</span>}
    </div>
  );

  return (
    <Modal title={editing ? 'Edit employee' : 'Add employee'} onClose={saving ? () => {} : onClose}>
      <form onSubmit={submit} noValidate>
        <header className="panel-head">
          <h2>{editing ? 'Edit employee' : 'Add employee'}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close" disabled={saving}>✕</button>
        </header>

        <div className="panel-body form-grid">
          <div className="span-2">{field('name', 'Full name', { autoComplete: 'off', autoFocus: true })}</div>
          {field('email', 'Email', { type: 'email', autoComplete: 'off' })}
          {field('phone', 'Phone number', { type: 'tel', placeholder: '+91 98765 43210' })}

          <div className={`field ${errors.department ? 'has-error' : ''}`}>
            <label htmlFor="f-department">Department</label>
            <input id="f-department" list="dept-list" value={values.department} onChange={set('department')} aria-invalid={Boolean(errors.department)} />
            <datalist id="dept-list">{deptOptions.map((d) => <option key={d} value={d} />)}</datalist>
            {errors.department && <span className="field-error">{errors.department}</span>}
          </div>
          {field('designation', 'Designation')}
          {field('joiningDate', 'Joining date', { type: 'date' })}

          <div className="field">
            <label htmlFor="f-status">Status</label>
            <select id="f-status" value={values.status} onChange={set('status')}>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          {formError && <div className="alert span-2" role="alert">{formError}</div>}
        </div>

        <footer className="panel-foot">
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={saving}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Save changes' : 'Add employee'}
          </button>
        </footer>
      </form>
    </Modal>
  );
}
