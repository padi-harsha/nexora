import { useState } from 'react';
import { Link } from 'react-router-dom';
import Field, { PasswordField } from '../components/Field';
import { useApp } from '../context/AppContext';
import { isEmail, isUsername, passwordError } from '../utils/helpers';

export default function Register() {
  const { register } = useApp();
  const [f, setF] = useState({ name: '', username: '', email: '', password: '', confirm: '' });
  const [err, setErr] = useState({});
  const set = (k) => (e) => { setF({ ...f, [k]: e.target.value }); setErr((x) => ({ ...x, [k]: '', form: '' })); };

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (f.name.trim().length < 2) er.name = 'Enter your full name.';
    if (!isUsername(f.username)) er.username = 'Use 3-20 letters, numbers, dots or underscores.';
    if (!isEmail(f.email)) er.email = 'Enter a valid email address.';
    const pe = passwordError(f.password);
    if (pe) er.password = pe;
    if (f.confirm !== f.password) er.confirm = 'Passwords do not match.';
    setErr(er);
    if (Object.keys(er).length) return;
    const r = register(f);
    if (r.error) setErr({ [r.field || 'form']: r.error });
  };

  return (
    <>
      <h1 className="text-3xl font-bold">Create your account</h1>
      <p className="mt-1 text-sm text-muted">Join Nexora and start sharing.</p>
      <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
        {err.form && <p role="alert" className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">{err.form}</p>}
        <Field label="Full name" autoComplete="name" value={f.name} onChange={set('name')} error={err.name} />
        <Field label="Username" autoComplete="username" value={f.username} onChange={set('username')} error={err.username} placeholder="e.g. riya.sharma" />
        <Field label="Email" type="email" autoComplete="email" value={f.email} onChange={set('email')} error={err.email} />
        <PasswordField label="Password" autoComplete="new-password" value={f.password} onChange={set('password')} error={err.password} hint="At least 8 characters with a letter and a number." />
        <PasswordField label="Confirm password" autoComplete="new-password" value={f.confirm} onChange={set('confirm')} error={err.confirm} />
        <button className="btn btn-primary w-full !py-3">Create account</button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">Already have an account? <Link to="/login" className="font-semibold text-brand hover:underline">Log in</Link></p>
    </>
  );
}
