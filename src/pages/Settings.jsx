import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import Field, { PasswordField } from '../components/Field';
import Toggle from '../components/Toggle';
import ConfirmDialog from '../components/ConfirmDialog';
import { useApp } from '../context/AppContext';
import { isEmail, isUsername, passwordError } from '../utils/helpers';

function Section({ title, description, children }) {
  return (
    <section className="card p-5">
      <h2 className="text-lg font-semibold">{title}</h2>
      {description && <p className="mb-4 text-sm text-muted">{description}</p>}
      {children}
    </section>
  );
}

export default function Settings() {
  const { me, myEmail, theme, setTheme, updateProfile, updateAccount, changePassword, logout, resetDemo, deleteAccount, toast } = useApp();
  const navigate = useNavigate();
  const [acct, setAcct] = useState({ name: me.name, username: me.username, email: myEmail });
  const [aErr, setAErr] = useState({});
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [pErr, setPErr] = useState({});
  const [confirm, setConfirm] = useState(null);

  const saveAccount = (e) => {
    e.preventDefault();
    const er = {};
    if (acct.name.trim().length < 2) er.name = 'Enter your name.';
    if (!isUsername(acct.username)) er.username = 'Use 3-20 letters, numbers, dots or underscores.';
    if (!isEmail(acct.email)) er.email = 'Enter a valid email address.';
    setAErr(er);
    if (Object.keys(er).length) return;
    const r1 = updateProfile({ name: acct.name.trim(), username: acct.username });
    if (r1.error) { setAErr({ [r1.field]: r1.error }); return; }
    const r2 = updateAccount({ email: acct.email });
    if (r2.error) { setAErr({ [r2.field]: r2.error }); return; }
    toast('Account details saved');
  };

  const savePassword = (e) => {
    e.preventDefault();
    const er = {};
    if (!pw.current) er.current = 'Enter your current password.';
    const pe = passwordError(pw.next);
    if (pe) er.next = pe;
    if (pw.confirm !== pw.next) er.confirm = 'Passwords do not match.';
    setPErr(er);
    if (Object.keys(er).length) return;
    const r = changePassword(pw.current, pw.next);
    if (r.error) { setPErr({ [r.field]: r.error }); return; }
    setPw({ current: '', next: '', confirm: '' });
    toast('Password updated');
  };

  const priv = (k) => (v) => { updateProfile({ [k]: v }); toast('Privacy setting updated'); };

  return (
    <div className="mx-auto max-w-[680px] space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Section title="Account" description="Update how you appear and how you log in.">
        <form onSubmit={saveAccount} className="space-y-4" noValidate>
          <Field label="Full name" value={acct.name} onChange={(e) => setAcct({ ...acct, name: e.target.value })} error={aErr.name} />
          <Field label="Username" value={acct.username} onChange={(e) => setAcct({ ...acct, username: e.target.value })} error={aErr.username} />
          <Field label="Email" type="email" value={acct.email} onChange={(e) => setAcct({ ...acct, email: e.target.value })} error={aErr.email} />
          <button className="btn btn-primary">Save changes</button>
        </form>
      </Section>

      <Section title="Password">
        <form onSubmit={savePassword} className="space-y-4" noValidate>
          <PasswordField label="Current password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} error={pErr.current} />
          <PasswordField label="New password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} error={pErr.next} />
          <PasswordField label="Confirm new password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} error={pErr.confirm} />
          <button className="btn btn-primary">Update password</button>
        </form>
      </Section>

      <Section title="Privacy">
        <div className="divide-y divide-line">
          <Toggle checked={me.private} onChange={priv('private')} label="Private account" description="People must send a request before they can follow you." />
          <Toggle checked={me.showActivity} onChange={priv('showActivity')} label="Show activity status" description="Let people see when you were last active." />
          <Toggle checked={me.allowMessages} onChange={priv('allowMessages')} label="Allow messages from anyone" description="Turn off to limit messages to people you follow." />
        </div>
      </Section>

      <Section title="Appearance">
        <div className="flex gap-3">
          {[['light', 'Light', Sun], ['dark', 'Dark', Moon]].map(([k, l, Icon]) => (
            <button key={k} onClick={() => setTheme(k)} aria-pressed={theme === k}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium ${theme === k ? 'border-brand bg-brandsoft text-brand' : 'border-line text-muted hover:text-ink'}`}>
              <Icon size={17} /> {l}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Session and data">
        <div className="flex flex-wrap gap-3">
          <button className="btn btn-outline" onClick={logout}>Log out</button>
          <button className="btn btn-outline" onClick={() => setConfirm('reset')}>Restore demo data</button>
          <button className="btn btn-danger" onClick={() => setConfirm('delete')}>Delete account</button>
        </div>
      </Section>

      <ConfirmDialog open={confirm === 'reset'} onClose={() => setConfirm(null)} onConfirm={() => { resetDemo(); navigate('/login'); }} title="Restore demo data?"
        message="This replaces everything stored in this browser with the original sample data and logs you out." confirmLabel="Restore" />
      <ConfirmDialog open={confirm === 'delete'} onClose={() => setConfirm(null)} onConfirm={deleteAccount} title="Delete your account?"
        message="Your profile, posts, messages and notifications will be removed from this browser." confirmLabel="Delete account" />
    </div>
  );
}
