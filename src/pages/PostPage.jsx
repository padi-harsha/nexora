import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, FileQuestion } from 'lucide-react';
import PostCard from '../components/PostCard';
import EmptyState from '../components/EmptyState';
import { useApp } from '../context/AppContext';

export default function PostPage() {
  const { id } = useParams();
  const { posts } = useApp();
  const post = posts.find((p) => p.id === id);
  return (
    <div className="mx-auto max-w-[640px] space-y-4">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink"><ArrowLeft size={16} /> Back to feed</Link>
      {post ? <PostCard post={post} defaultOpen /> : (
        <EmptyState icon={FileQuestion} title="Post not available" text="It may have been deleted by its author." action={<Link to="/" className="btn btn-primary">Back to home</Link>} />
      )}
    </div>
  );
}
