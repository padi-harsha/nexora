import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SearchX } from 'lucide-react';
import PostCard from '../components/PostCard';
import UserRow from '../components/UserRow';
import EmptyState from '../components/EmptyState';
import { TrendingTags } from './Home';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/seed';

export default function Explore() {
  const { me, users, posts, byId } = useApp();
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const cat = params.get('cat') || '';

  const update = (next) => {
    const p = new URLSearchParams(params);
    Object.entries(next).forEach(([k, v]) => (v ? p.set(k, v) : p.delete(k)));
    setParams(p, { replace: true });
  };

  const term = q.trim().toLowerCase();

  const popular = useMemo(
    () => users.filter((u) => u.id !== me.id).sort((a, b) => b.followersBase - a.followersBase).slice(0, 6),
    [users, me.id]
  );

  const peopleResults = useMemo(() => (term
    ? users.filter((u) => u.id !== me.id && [u.name, u.username, u.bio, u.location].some((v) => (v || '').toLowerCase().includes(term)))
    : []), [term, users, me.id]);

  const list = useMemo(() => {
    let l = posts;
    if (cat) l = l.filter((p) => p.category === cat);
    if (term) l = l.filter((p) => p.text.toLowerCase().includes(term) || (byId(p.userId)?.name || '').toLowerCase().includes(term) || (p.category || '').toLowerCase() === term);
    const score = (p) => p.likes.length * 2 + p.comments.length * 3 + p.shares;
    return term ? [...l].sort((a, b) => b.createdAt - a.createdAt) : [...l].sort((a, b) => score(b) - score(a));
  }, [posts, cat, term, byId]);

  const heading = term ? `Posts matching "${q.trim()}"` : cat ? `${cat} posts` : 'Trending posts';

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,640px)_300px] xl:justify-center">
      <div className="min-w-0 space-y-4">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input className="input !rounded-full pl-10" placeholder="Search people, posts and topics" value={q} onChange={(e) => update({ q: e.target.value })} aria-label="Search explore" />
        </div>

        <div className="no-scrollbar flex gap-2 overflow-x-auto" role="tablist" aria-label="Categories">
          {['', ...CATEGORIES].map((c) => (
            <button key={c || 'all'} role="tab" aria-selected={cat === c} onClick={() => update({ cat: c })}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${cat === c ? 'bg-ink text-bg' : 'border border-line bg-surface text-muted hover:text-ink'}`}>
              {c || 'All'}
            </button>
          ))}
        </div>

        {term && peopleResults.length > 0 && (
          <section className="card p-4">
            <h2 className="mb-3 text-base font-semibold">People</h2>
            <div className="space-y-3.5">{peopleResults.map((u) => <UserRow key={u.id} user={u} />)}</div>
          </section>
        )}

        {!term && (
          <section className="card p-4 xl:hidden">
            <h2 className="mb-3 text-base font-semibold">Popular people</h2>
            <div className="space-y-3.5">{popular.slice(0, 4).map((u) => <UserRow key={u.id} user={u} />)}</div>
          </section>
        )}

        <h2 className="pt-1 text-lg font-semibold">{heading}</h2>
        {list.length === 0 ? (
          <EmptyState icon={SearchX} title="No posts found" text="Try a different keyword or pick another category."
            action={<button className="btn btn-outline" onClick={() => setParams({}, { replace: true })}>Clear search</button>} />
        ) : list.map((p) => <PostCard key={p.id} post={p} />)}
      </div>
      <aside className="hidden xl:block">
        <div className="sticky top-20 space-y-4">
          <section className="card p-4">
            <h2 className="mb-3 text-base font-semibold">Popular people</h2>
            <div className="space-y-3.5">{popular.map((u) => <UserRow key={u.id} user={u} />)}</div>
          </section>
          <TrendingTags />
        </div>
      </aside>
    </div>
  );
}
