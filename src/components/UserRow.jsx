import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import FollowButton from './FollowButton';
import { useApp } from '../context/AppContext';
import { formatCount } from '../utils/helpers';

export default function UserRow({ user, showFollow = true }) {
  const { followersOf } = useApp();
  return (
    <div className="flex items-center gap-3">
      <Link to={`/u/${user.username}`}><Avatar user={user} size={42} /></Link>
      <Link to={`/u/${user.username}`} className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{user.name}</p>
        <p className="truncate text-xs text-muted">@{user.username} - {formatCount(followersOf(user))} followers</p>
      </Link>
      {showFollow && <FollowButton user={user} className="!px-3 !py-1.5 text-xs" />}
    </div>
  );
}
