import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper } from 'lucide-react';
import Stories from '../components/Stories';
import CreatePostForm from '../components/CreatePostForm';
import PostCard from '../components/PostCard';
import UserRow from '../components/UserRow';
import EmptyState from '../components/EmptyState';
import { useApp } from '../context/AppContext';
import { extractTags } from '../utils/helpers';

export function Suggestions() {
  const { me, users } = useApp();
  const list = users
    .filter((u) => u.id !== me.id && !me.followingIds.includes(u.id) && !me.requested.includes(u.id))
    .sort((a, b) => b.followersBase - a.followersBase)
    .slice(0, 4);
  if (!list.length) return null;
  return (
    <section className="card p-4">
      <h2 className="mb-3 text-base font-semibold">People to follow</h2>
      <div className="space-y-3.5">{list.map((u) => <UserRow key={u.id} user={u} />)}</div>
    </section>
  );
}

export function TrendingTags() {
  const { posts } = useApp();
  const tags = useMemo(() => extractTags(posts), [posts]);
  if (!tags.length) return null;
  return (
    <section className="card p-4">
      <h2 className="mb-2 text-base font-semibold">Trending topics</h2>
      <ul>
        {tags.map(([tag, n]) => (
          <li key={tag}>
            <Link to={`/explore?q=${encodeURIComponent(tag)}`} className="flex items-center justify-between rounded-lg px-2 py-2 text-sm hover:bg-surface2">
              <span className="font-medium">{tag}</span>
              <span className="text-xs text-muted">{n} {n === 1 ? 'post' : 'posts'}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Home() {
  const { me, posts } = useApp();
  const feed = posts
    .filter((p) => p.userId === me.id || me.followingIds.includes(p.userId))
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,640px)_300px] xl:justify-center">
      <div className="min-w-0 space-y-4">
        <Stories />
        <div className="card hidden p-4 sm:block"><CreatePostForm compact /></div>
        {feed.length === 0 ? (
          <EmptyState
            icon={Newspaper}
            title="Your feed is quiet"
            text="Follow a few people to see their posts here, or publish your first post."
            action={<Link to="/explore" className="btn btn-primary">Discover people</Link>}
          />
        ) : feed.map((p) => <PostCard key={p.id} post={p} />)}
      </div>
      <aside className="hidden space-y-4 xl:block">
        <div className="sticky top-20 space-y-4">
          <Suggestions />
          <TrendingTags />
          <p className="px-2 text-xs text-muted">Nexora - student project. Demo data only.</p>
        </div>
      </aside>
    </div>
  );
}
