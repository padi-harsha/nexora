import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import PostCard from '../components/PostCard';
import EmptyState from '../components/EmptyState';
import { useApp } from '../context/AppContext';

export default function Saved() {
  const { me, posts } = useApp();
  const saved = me.bookmarks.map((id) => posts.find((p) => p.id === id)).filter(Boolean);
  return (
    <div className="mx-auto max-w-[640px] space-y-4">
      <h1 className="text-2xl font-bold">Saved</h1>
      {saved.length === 0 ? (
        <EmptyState icon={Bookmark} title="Nothing saved yet" text="Use the bookmark on any post to keep it here for later."
          action={<Link to="/explore" className="btn btn-primary">Browse posts</Link>} />
      ) : saved.map((p) => <PostCard key={p.id} post={p} />)}
    </div>
  );
}
