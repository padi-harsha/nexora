import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Field, { PasswordField } from '../components/Field';
import { useApp } from '../context/AppContext';
import { isEmail, passwordError } from '../utils/helpers';

export default function ForgotPassword() {
  const { resetPassword } = useApp();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState({ next: '', confirm: '' });
  const [err, setErr] = useState({});

  const verify = (e) => {
    e.preventDefault();
    if (!isEmail(email)) { setErr({ email: 'Enter a valid email address.' }); return; }
    const r = resetPassword(email);
    if (r.error) { setErr({ email: r.error }); return; }
    setErr({});
    setStep(2);
  };

  const save = (e) => {
    e.preventDefault();
    const er = {};
    const pe = passwordError(pw.next);
    if (pe) er.next = pe;
    if (pw.confirm !== pw.next) er.confirm = 'Passwords do not match.';
    setErr(er);
    if (Object.keys(er).length) return;
    resetPassword(email, pw.next);
    setStep(3);
  };

  return (
    <>
      <Link to="/login" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink"><ArrowLeft size={16} /> Back to log in</Link>
      {step === 1 && (
        <>
          <h1 className="text-3xl font-bold">Reset your password</h1>
          <p className="mt-1 text-sm text-muted">Enter the email you registered with.</p>
          <form onSubmit={verify} className="mt-8 space-y-4" noValidate>
            <Field label="Email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErr({}); }} error={err.email} />
            <button className="btn btn-primary w-full !py-3">Continue</button>
          </form>
        </>
      )}
      {step === 2 && (
        <>
          <h1 className="text-3xl font-bold">Choose a new password</h1>
          <p className="mt-1 text-sm text-muted">This is a demo, so no email is sent. You can set the new password right away.</p>
          <form onSubmit={save} className="mt-8 space-y-4" noValidate>
            <PasswordField label="New password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} error={err.next} />
            <PasswordField label="Confirm new password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} error={err.confirm} />
            <button className="btn btn-primary w-full !py-3">Save password</button>
          </form>
        </>
      )}
      {step === 3 && (
        <div className="text-center">
          <CheckCircle2 size={44} className="mx-auto text-brand" />
          <h1 className="mt-4 text-2xl font-bold">Password updated</h1>
          <p className="mt-1 text-sm text-muted">You can now log in with your new password.</p>
          <Link to="/login" className="btn btn-primary mt-6 w-full !py-3">Go to log in</Link>
        </div>
      )}
    </>
  );
}
