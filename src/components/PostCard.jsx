import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Heart, Link2, MessageCircle, MoreHorizontal, Send, Share2, Trash2, X } from 'lucide-react';
import Avatar from './Avatar';
import RemoteImage from './RemoteImage';
import Modal from './Modal';
import ConfirmDialog from './ConfirmDialog';
import UserHoverCard from './UserHoverCard';
import useOutsideClick from '../hooks/useOutsideClick';
import { useApp } from '../context/AppContext';
import { formatCount, timeAgo } from '../utils/helpers';

function PostText({ text }) {
  const parts = text.split(/(#[\p{L}\d_]+)/gu);
  return (
    <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">
      {parts.map((p, i) => (p.startsWith('#')
        ? <Link key={i} to={`/explore?q=${encodeURIComponent(p)}`} className="font-medium text-brand hover:underline">{p}</Link>
        : <span key={i}>{p}</span>))}
    </p>
  );
}

export default function PostCard({ post, defaultOpen = false }) {
  const { me, byId, toggleLike, toggleBookmark, addComment, deleteComment, deletePost, sharePost, conversations, sendMessage, toast } = useApp();
  const [open, setOpen] = useState(defaultOpen);
  const [text, setText] = useState('');
  const [menu, setMenu] = useState(false);
  const [share, setShare] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const menuRef = useRef(null);
  useOutsideClick(menuRef, () => setMenu(false), menu);

  const author = byId(post.userId);
  if (!author) return null;
  const mine = post.userId === me.id;
  const liked = post.likes.includes(me.id);
  const saved = me.bookmarks.includes(post.id);
  const link = `${window.location.origin}/post/${post.id}`;

  const copy = () => {
    sharePost(post.id);
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(link).then(() => toast('Link copied')).catch(() => toast('Could not copy the link'));
    } else toast('Copy is not supported in this browser');
  };

  const submitComment = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    addComment(post.id, text);
    setText('');
  };

  const sendTo = (c) => {
    sendMessage(c.id, `Shared a post: ${link}`);
    sharePost(post.id);
    toast(`Sent to ${byId(c.userId)?.name || 'chat'}`);
  };

  return (
    <article className="card p-4 sm:p-5">
      <header className="flex items-start gap-3">
        <UserHoverCard user={author}>
          <Link to={`/u/${author.username}`}><Avatar user={author} size={44} /></Link>
        </UserHoverCard>
        <div className="min-w-0 flex-1">
          <UserHoverCard user={author}>
            <Link to={`/u/${author.username}`} className="truncate text-sm font-semibold hover:underline">{author.name}</Link>
          </UserHoverCard>
          <p className="truncate text-xs text-muted">
            @{author.username} - <time title={new Date(post.createdAt).toLocaleString()}>{timeAgo(post.createdAt)}</time>
          </p>
        </div>
        <div className="relative" ref={menuRef}>
          <button className="icon-btn" aria-label="Post options" onClick={() => setMenu((m) => !m)}><MoreHorizontal size={18} /></button>
          {menu && (
            <div className="card anim-fade absolute right-0 top-10 z-20 w-44 overflow-hidden p-1 shadow-lg">
              <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-surface2" onClick={() => { copy(); setMenu(false); }}>
                <Link2 size={16} /> Copy link
              </button>
              {mine && (
                <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-surface2" onClick={() => { setConfirm(true); setMenu(false); }}>
                  <Trash2 size={16} /> Delete post
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      {post.text && <div className="mt-3"><PostText text={post.text} /></div>}
      {post.image && <RemoteImage src={post.image} alt="Post attachment" className="mt-3 max-h-[480px] w-full rounded-xl" />}
      {post.category && <span className="mt-3 inline-block rounded-full bg-surface2 px-2.5 py-0.5 text-xs font-medium text-muted">{post.category}</span>}

      <div className="mt-3 flex items-center gap-1 border-t border-line pt-2">
        <button onClick={() => toggleLike(post.id)} aria-pressed={liked} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors hover:bg-surface2 ${liked ? 'text-red-600' : 'text-muted'}`}>
          <Heart size={18} className={liked ? 'fill-current' : ''} /> {formatCount(post.likes.length)}
        </button>
        <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors hover:bg-surface2 ${open ? 'text-brand' : 'text-muted'}`}>
          <MessageCircle size={18} /> {formatCount(post.comments.length)}
        </button>
        <button onClick={() => setShare(true)} className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted transition-colors hover:bg-surface2">
          <Share2 size={18} /> {post.shares > 0 && formatCount(post.shares)}
        </button>
        <button onClick={() => toggleBookmark(post.id)} aria-pressed={saved} aria-label={saved ? 'Remove from saved' : 'Save post'} className={`ml-auto rounded-full p-2 transition-colors hover:bg-surface2 ${saved ? 'text-brand' : 'text-muted'}`}>
          <Bookmark size={18} className={saved ? 'fill-current' : ''} />
        </button>
      </div>

      {open && (
        <div className="anim-fade mt-3 space-y-3">
          {post.comments.length === 0 && <p className="text-sm text-muted">No comments yet. Start the conversation.</p>}
          {post.comments.map((c) => {
            const u = byId(c.userId);
            if (!u) return null;
            return (
              <div key={c.id} className="flex gap-2.5">
                <Link to={`/u/${u.username}`}><Avatar user={u} size={32} /></Link>
                <div className="min-w-0 flex-1 rounded-2xl bg-surface2 px-3.5 py-2">
                  <div className="flex items-center gap-2">
                    <Link to={`/u/${u.username}`} className="text-sm font-semibold hover:underline">{u.name}</Link>
                    <span className="text-xs text-muted">{timeAgo(c.createdAt)}</span>
                    {(c.userId === me.id || mine) && (
                      <button className="ml-auto text-muted hover:text-red-600" aria-label="Delete comment" onClick={() => deleteComment(post.id, c.id)}><X size={14} /></button>
                    )}
                  </div>
                  <p className="break-words text-sm">{c.text}</p>
                </div>
              </div>
            );
          })}
          <form onSubmit={submitComment} className="flex items-center gap-2.5">
            <Avatar user={me} size={32} />
            <input className="input !rounded-full" placeholder="Write a comment" value={text} onChange={(e) => setText(e.target.value)} maxLength={300} />
            <button className="btn btn-primary !px-3" disabled={!text.trim()} aria-label="Send comment"><Send size={16} /></button>
          </form>
        </div>
      )}

      <Modal open={share} onClose={() => setShare(false)} title="Share post" size="max-w-md">
        <div className="flex items-center gap-2 rounded-xl border border-line bg-surface2 p-2">
          <input readOnly value={link} className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none" onFocus={(e) => e.target.select()} />
          <button className="btn btn-primary !py-1.5" onClick={copy}>Copy link</button>
        </div>
        <p className="mb-2 mt-5 text-sm font-semibold">Send in a message</p>
        {conversations.length === 0 && <p className="text-sm text-muted">Start a conversation from the Messages page to send posts directly.</p>}
        <ul className="space-y-1">
          {conversations.map((c) => {
            const u = byId(c.userId);
            return u && (
              <li key={c.id} className="flex items-center gap-3 rounded-xl p-2 hover:bg-surface2">
                <Avatar user={u} size={36} />
                <span className="flex-1 truncate text-sm font-medium">{u.name}</span>
                <button className="btn btn-outline !px-3 !py-1 text-xs" onClick={() => sendTo(c)}>Send</button>
              </li>
            );
          })}
        </ul>
      </Modal>
      <ConfirmDialog open={confirm} onClose={() => setConfirm(false)} onConfirm={() => deletePost(post.id)} title="Delete this post?" message="This removes the post and its comments. This cannot be undone." />
    </article>
  );
}
