import { initials, toneFor } from '../utils/format';

export default function Avatar({ name, size = 36 }) {
  return (
    <span className="avatar" style={{ width: size, height: size, background: toneFor(name), fontSize: size * 0.38 }} aria-hidden="true">
      {initials(name)}
    </span>
  );
}
