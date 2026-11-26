import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, MessageCircle, Moon, Search, Settings, Sun, User } from 'lucide-react';
import Avatar from '../components/Avatar';
import Logo from '../components/Logo';
import useOutsideClick from '../hooks/useOutsideClick';
import { useApp } from '../context/AppContext';

export default function TopBar() {
  const { me, logout, theme, toggleTheme, unreadMessages } = useApp();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [menu, setMenu] = useState(false);
  const ref = useRef(null);
  useOutsideClick(ref, () => setMenu(false), menu);

  const search = (e) => {
    e.preventDefault();
    navigate(q.trim() ? `/explore?q=${encodeURIComponent(q.trim())}` : '/explore');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg">
      <div className="mx-auto flex h-14 max-w-[1040px] items-center gap-3 px-4 md:px-6">
        <Link to="/" className="md:hidden" aria-label="Nexora home"><Logo size={28} /></Link>
        <form onSubmit={search} className="hidden max-w-md flex-1 md:block" role="search">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input className="input !rounded-full pl-10" placeholder="Search people and posts" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" />
          </div>
        </form>
        <div className="ml-auto flex items-center gap-1">
          <Link to="/explore" className="icon-btn md:hidden" aria-label="Search"><Search size={19} /></Link>
          <Link to="/messages" className="icon-btn md:hidden" aria-label="Messages">
            <MessageCircle size={19} />
            {unreadMessages > 0 && <span className="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full bg-brand" />}
          </Link>
          <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">{theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}</button>
          <div className="relative ml-1" ref={ref}>
            <button onClick={() => setMenu((m) => !m)} aria-label="Account menu" aria-expanded={menu}><Avatar user={me} size={34} /></button>
            {menu && (
              <div className="card anim-fade absolute right-0 top-11 w-56 p-1.5 shadow-lg">
                <div className="px-3 py-2">
                  <p className="truncate text-sm font-semibold">{me.name}</p>
                  <p className="truncate text-xs text-muted">@{me.username}</p>
                </div>
                <hr className="my-1" />
                <Link to={`/u/${me.username}`} onClick={() => setMenu(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm hover:bg-surface2"><User size={16} /> Profile</Link>
                <Link to="/settings" onClick={() => setMenu(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm hover:bg-surface2"><Settings size={16} /> Settings</Link>
                <button onClick={logout} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-surface2"><LogOut size={16} /> Log out</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
