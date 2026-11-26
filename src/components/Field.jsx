import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function Field({ label, error, hint, right, ...props }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <div className="relative">
        <input {...props} className={`input ${right ? 'pr-11' : ''} ${error ? 'border-red-500' : ''}`} />
        {right && <div className="absolute inset-y-0 right-0 flex items-center pr-3">{right}</div>}
      </div>
      {error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function PasswordField(props) {
  const [show, setShow] = useState(false);
  return (
    <Field
      {...props}
      type={show ? 'text' : 'password'}
      right={
        <button type="button" onClick={() => setShow((s) => !s)} className="text-muted hover:text-ink" aria-label={show ? 'Hide password' : 'Show password'}>
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      }
    />
  );
}
