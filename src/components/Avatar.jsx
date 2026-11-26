import { useEffect, useState } from 'react';

const initials = (n = '') => n.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

export default function Avatar({ user, size = 40, ring = false, className = '' }) {
  const [bad, setBad] = useState(false);
  useEffect(() => setBad(false), [user?.avatar]);
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-brandsoft font-semibold text-brand ${ring ? 'ring-2 ring-brand ring-offset-2 ring-offset-surface' : ''} ${className}`}
      style={{ width: size, height: size, fontSize: Math.max(11, size * 0.38) }}
    >
      {user?.avatar && !bad ? (
        <img src={user.avatar} alt="" className="h-full w-full object-cover" loading="lazy" onError={() => setBad(true)} />
      ) : (
        initials(user?.name)
      )}
    </span>
  );
}
