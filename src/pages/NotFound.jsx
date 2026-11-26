import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 text-center text-ink">
      <Logo size={36} />
      <p className="font-display mt-12 text-8xl font-bold text-brand">404</p>
      <h1 className="mt-3 text-2xl font-bold">This page does not exist</h1>
      <p className="mt-2 max-w-sm text-sm text-muted">The link may be broken, or the page may have been removed.</p>
      <div className="mt-8 flex gap-3">
        <button onClick={() => navigate(-1)} className="btn btn-outline">Go back</button>
        <Link to="/" className="btn btn-primary">Back to home</Link>
      </div>
    </div>
  );
}
