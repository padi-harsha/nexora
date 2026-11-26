import { Outlet } from 'react-router-dom';
import Logo from '../components/Logo';
import RemoteImage from '../components/RemoteImage';
import Toasts from '../components/Toasts';

const tiles = ['auth-a', 'auth-b', 'auth-c', 'auth-d'];

export default function AuthLayout() {
  return (
    <div className="grid min-h-screen bg-bg text-ink lg:grid-cols-[1.05fr_1fr]">
      <aside className="hidden flex-col justify-between bg-[#101418] p-12 text-[#edf0f2] lg:flex">
        <span className="text-[#edf0f2]"><Logo size={38} /></span>
        <div>
          <h1 className="max-w-md text-5xl font-bold leading-[1.05]">Show the work behind the moment.</h1>
          <p className="mt-5 max-w-sm text-base text-[#8e99a3]">Follow people who make things, share what you are building, and keep the conversation going in one place.</p>
          <div className="mt-10 grid max-w-md grid-cols-4 gap-3">
            {tiles.map((t, i) => (
              <RemoteImage key={t} src={`https://picsum.photos/seed/${t}/300/420`} className={`aspect-[3/4] w-full rounded-xl ${i % 2 ? 'mt-6' : ''}`} />
            ))}
          </div>
        </div>
        <p className="text-sm text-[#8e99a3]">Nexora is a student project. All accounts and posts are demo content stored in your browser.</p>
      </aside>
      <main className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-[400px]">
          <div className="mb-8 lg:hidden"><Logo size={34} /></div>
          <Outlet />
        </div>
      </main>
      <Toasts />
    </div>
  );
}
