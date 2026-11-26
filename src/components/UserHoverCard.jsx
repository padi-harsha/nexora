import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import FollowButton from './FollowButton';
import { useApp } from '../context/AppContext';
import { formatCount } from '../utils/helpers';

export default function UserHoverCard({ user, children }) {
  const { followersOf, followingOf, posts } = useApp();
  const count = posts.filter((p) => p.userId === user.id).length;
  return (
    <span className="group relative inline-flex">
      {children}
      <span className="invisible absolute left-0 top-full z-30 w-72 pt-2 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 max-md:hidden">
        <span className="card block p-4 shadow-lg">
          <span className="flex items-start gap-3">
            <Avatar user={user} size={48} />
            <span className="min-w-0 flex-1">
              <Link to={`/u/${user.username}`} className="block truncate text-sm font-semibold hover:underline">{user.name}</Link>
              <span className="block truncate text-xs text-muted">@{user.username}</span>
            </span>
            <FollowButton user={user} className="!px-3 !py-1 text-xs" />
          </span>
          {user.bio && <span className="mt-3 line-clamp-2 block text-sm">{user.bio}</span>}
          <span className="mt-3 flex gap-4 text-xs text-muted">
            <span><b className="text-ink">{count}</b> posts</span>
            <span><b className="text-ink">{formatCount(followersOf(user))}</b> followers</span>
            <span><b className="text-ink">{formatCount(followingOf(user))}</b> following</span>
          </span>
        </span>
      </span>
    </span>
  );
}
