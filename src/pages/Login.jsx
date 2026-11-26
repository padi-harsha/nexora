import { useState } from 'react';
import { Link } from 'react-router-dom';
import Field, { PasswordField } from '../components/Field';
import { useApp } from '../context/AppContext';
import { isEmail } from '../utils/helpers';

export default function Login() {
  const { login } = useApp();
  const [f, setF] = useState({ email: '', password: '' });
  const [err, setErr] = useState({});
  const set = (k) => (e) => { setF({ ...f, [k]: e.target.value }); setErr({}); };

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!isEmail(f.email)) er.email = 'Enter a valid email address.';
    if (!f.password) er.password = 'Enter your password.';
    setErr(er);
    if (Object.keys(er).length) return;
    const r = login(f.email, f.password);
    if (r.error) setErr({ form: r.error });
  };

  return (
    <>
      <h1 className="text-3xl font-bold">Welcome back</h1>
      <p className="mt-1 text-sm text-muted">Log in to continue to Nexora.</p>
      <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
        {err.form && <p role="alert" className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">{err.form}</p>}
        <Field label="Email" type="email" autoComplete="email" value={f.email} onChange={set('email')} error={err.email} placeholder="you@example.com" />
        <PasswordField label="Password" autoComplete="current-password" value={f.password} onChange={set('password')} error={err.password} placeholder="Your password" />
        <div className="text-right"><Link to="/forgot-password" className="text-sm font-medium text-brand hover:underline">Forgot password?</Link></div>
        <button className="btn btn-primary w-full !py-3">Log in</button>
      </form>
      <button type="button" className="btn btn-outline mt-3 w-full !py-3" onClick={() => { setF({ email: 'demo@nexora.app', password: 'Demo@1234' }); setErr({}); }}>
        Fill demo account details
      </button>
      <p className="mt-6 text-center text-sm text-muted">New to Nexora? <Link to="/register" className="font-semibold text-brand hover:underline">Create an account</Link></p>
    </>
  );
}
