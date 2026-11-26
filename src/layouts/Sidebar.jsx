import { NavLink, Link } from 'react-router-dom';
import { Bell, Bookmark, Compass, Home, MessageCircle, Plus, Settings, User } from 'lucide-react';
import Logo from '../components/Logo';
import { useApp } from '../context/AppContext';

export default function Sidebar({ onCompose }) {
  const { me, unreadNotifs, unreadMessages } = useApp();
  const items = [
    { to: '/', label: 'Home', icon: Home, end: true },
    { to: '/explore', label: 'Explore', icon: Compass },
    { to: '/messages', label: 'Messages', icon: MessageCircle, badge: unreadMessages },
    { to: '/notifications', label: 'Notifications', icon: Bell, badge: unreadNotifs },
    { to: '/saved', label: 'Saved', icon: Bookmark },
    { to: `/u/${me.username}`, label: 'Profile', icon: User },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[76px] flex-col border-r border-line bg-surface px-3 py-5 md:flex lg:w-64 lg:px-4">
      <Link to="/" className="mb-6 flex justify-center px-1 lg:justify-start lg:px-2" aria-label="Nexora home">
        <span className="lg:hidden"><Logo size={36} text={false} /></span>
        <span className="hidden lg:inline"><Logo size={34} /></span>
      </Link>
      <nav className="flex flex-1 flex-col gap-1" aria-label="Main">
        {items.map(({ to, label, icon: Icon, end, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={label}
            className={({ isActive }) => `relative flex items-center justify-center gap-3.5 rounded-xl px-3 py-2.5 text-[15px] font-medium transition-colors lg:justify-start ${isActive ? 'bg-brandsoft text-brand' : 'text-muted hover:bg-surface2 hover:text-ink'}`}
          >
            <Icon size={22} />
            <span className="hidden lg:inline">{label}</span>
            {badge > 0 && (
              <span className="absolute right-2 top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[11px] font-bold text-brandink lg:static lg:ml-auto">{badge}</span>
            )}
          </NavLink>
        ))}
      </nav>
      <button onClick={onCompose} className="btn btn-primary w-full !py-3" aria-label="Create post">
        <Plus size={20} /> <span className="hidden lg:inline">New post</span>
      </button>
    </aside>
  );
}
