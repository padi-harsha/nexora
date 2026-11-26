import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, CheckCheck } from 'lucide-react';
import Avatar from '../components/Avatar';
import EmptyState from '../components/EmptyState';
import { useApp } from '../context/AppContext';
import { timeAgo } from '../utils/helpers';

const verb = {
  like: 'liked your post.',
  comment: 'commented on your post.',
  follow: 'started following you.',
  request: 'requested to follow you.',
  accepted: 'accepted your follow request.',
};

export default function Notifications() {
  const { notifications, byId, markNotifRead, markAllNotifsRead, respondRequest, unreadNotifs } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState('all');
  const list = tab === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  const open = (n, u) => {
    markNotifRead(n.id);
    if (n.postId) navigate(`/post/${n.postId}`);
    else navigate(`/u/${u.username}`);
  };

  return (
    <div className="mx-auto max-w-[640px] space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <button className="btn btn-outline !py-1.5 text-xs" onClick={markAllNotifsRead} disabled={unreadNotifs === 0}><CheckCheck size={15} /> Mark all as read</button>
      </div>
      <div className="flex gap-2" role="tablist">
        {[['all', 'All'], ['unread', `Unread${unreadNotifs ? ` (${unreadNotifs})` : ''}`]].map(([k, l]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${tab === k ? 'bg-ink text-bg' : 'border border-line bg-surface text-muted'}`}>{l}</button>
        ))}
      </div>
      {list.length === 0 ? (
        <EmptyState icon={Bell} title={tab === 'unread' ? 'You are all caught up' : 'No notifications yet'} text="Likes, comments and new followers will show up here." />
      ) : (
        <ul className="card divide-y divide-line overflow-hidden">
          {list.map((n) => {
            const u = byId(n.userId);
            if (!u) return null;
            return (
              <li key={n.id} className={`flex items-start gap-3 p-4 ${n.read ? '' : 'bg-brandsoft'}`}>
                <Link to={`/u/${u.username}`}><Avatar user={u} size={44} /></Link>
                <button className="min-w-0 flex-1 text-left" onClick={() => open(n, u)}>
                  <p className="text-sm"><b>{u.name}</b> {verb[n.type]}</p>
                  {n.type === 'comment' && n.text && <p className="mt-0.5 truncate text-sm text-muted">&ldquo;{n.text}&rdquo;</p>}
                  <p className="mt-0.5 text-xs text-muted">{timeAgo(n.at)}</p>
                  {n.type === 'request' && n.status && n.status !== 'pending' && <p className="mt-1 text-xs font-medium text-muted">Request {n.status}</p>}
                </button>
                {n.type === 'request' && n.status === 'pending' && (
                  <div className="flex gap-2">
                    <button className="btn btn-primary !px-3 !py-1.5 text-xs" onClick={() => respondRequest(n.id, true)}>Accept</button>
                    <button className="btn btn-outline !px-3 !py-1.5 text-xs" onClick={() => respondRequest(n.id, false)}>Decline</button>
                  </div>
                )}
                {!n.read && <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-brand" aria-label="Unread" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
