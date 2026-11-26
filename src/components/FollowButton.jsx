import { useApp } from '../context/AppContext';

export default function FollowButton({ user, className = '' }) {
  const { me, toggleFollow } = useApp();
  if (!me || user.id === me.id) return null;
  const following = me.followingIds.includes(user.id);
  const requested = me.requested.includes(user.id);
  const label = following ? 'Following' : requested ? 'Requested' : 'Follow';
  return (
    <button onClick={() => toggleFollow(user.id)} className={`btn ${following || requested ? 'btn-outline' : 'btn-primary'} ${className}`}>
      {label}
    </button>
  );
}
