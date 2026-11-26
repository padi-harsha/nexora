import { NavLink } from 'react-router-dom';
import { Bell, Compass, Home, Plus, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function BottomNav({ onCompose }) {
  const { me, unreadNotifs } = useApp();
  const link = ({ isActive }) => `relative flex h-12 w-12 items-center justify-center rounded-full transition-colors ${isActive ? 'text-brand' : 'text-muted'}`;
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] md:hidden" aria-label="Mobile">
      <NavLink to="/" end className={link} aria-label="Home"><Home size={24} /></NavLink>
      <NavLink to="/explore" className={link} aria-label="Explore"><Compass size={24} /></NavLink>
      <button onClick={onCompose} className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-brandink" aria-label="Create post"><Plus size={22} /></button>
      <NavLink to="/notifications" className={link} aria-label="Notifications">
        <Bell size={24} />
        {unreadNotifs > 0 && <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-brandink">{unreadNotifs}</span>}
      </NavLink>
      <NavLink to={`/u/${me.username}`} className={link} aria-label="Profile"><User size={24} /></NavLink>
    </nav>
  );
}
