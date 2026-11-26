import { useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Calendar, Camera, Grid3x3, Heart, ImageIcon, Link as LinkIcon, Lock, MapPin, UserX } from 'lucide-react';
import Avatar from '../components/Avatar';
import RemoteImage from '../components/RemoteImage';
import Modal from '../components/Modal';
import Field from '../components/Field';
import PostCard from '../components/PostCard';
import FollowButton from '../components/FollowButton';
import EmptyState from '../components/EmptyState';
import { useApp } from '../context/AppContext';
import { fileToDataUrl, formatCount, isUsername } from '../utils/helpers';

function EditProfile({ open, onClose, user }) {
  const { updateProfile, toast } = useApp();
  const navigate = useNavigate();
  const [f, setF] = useState({ name: user.name, username: user.username, bio: user.bio, location: user.location, website: user.website, avatar: user.avatar, cover: user.cover });
  const [err, setErr] = useState({});
  const avRef = useRef(null);
  const cvRef = useRef(null);

  const pickImage = (key, max) => async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast('Please choose an image file'); return; }
    try { const url = await fileToDataUrl(file, max); setF((x) => ({ ...x, [key]: url })); } catch { toast('That image could not be read'); }
  };

  const save = (e) => {
    e.preventDefault();
    const er = {};
    if (f.name.trim().length < 2) er.name = 'Enter your name.';
    if (!isUsername(f.username)) er.username = 'Use 3-20 letters, numbers, dots or underscores.';
    if (f.bio.length > 160) er.bio = 'Keep your bio under 160 characters.';
    setErr(er);
    if (Object.keys(er).length) return;
    const r = updateProfile({ ...f, name: f.name.trim(), bio: f.bio.trim(), location: f.location.trim(), website: f.website.trim(), avatar: f.avatar || '', cover: f.cover || '' });
    if (r.error) { setErr({ [r.field]: r.error }); return; }
    toast('Profile updated');
    onClose();
    if (f.username.trim().toLowerCase() !== user.username) navigate(`/u/${f.username.trim().toLowerCase()}`, { replace: true });
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit profile">
      <form onSubmit={save} className="space-y-4" noValidate>
        <div>
          <RemoteImage src={f.cover} className="h-28 w-full rounded-xl" />
          <div className="mt-2 flex items-center gap-3">
            <Avatar user={{ ...user, name: f.name, avatar: f.avatar }} size={56} />
            <input ref={avRef} type="file" accept="image/*" className="hidden" onChange={pickImage('avatar', 400)} />
            <input ref={cvRef} type="file" accept="image/*" className="hidden" onChange={pickImage('cover', 1200)} />
            <button type="button" className="btn btn-outline !py-1.5 text-xs" onClick={() => avRef.current?.click()}>Change photo</button>
            <button type="button" className="btn btn-outline !py-1.5 text-xs" onClick={() => cvRef.current?.click()}>Change cover</button>
            {(f.avatar || f.cover) && <button type="button" className="text-xs text-muted hover:text-ink" onClick={() => setF({ ...f, avatar: '', cover: '' })}>Remove both</button>}
          </div>
        </div>
        <Field label="Name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} error={err.name} />
        <Field label="Username" value={f.username} onChange={(e) => setF({ ...f, username: e.target.value })} error={err.username} />
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Bio</span>
          <textarea className="input resize-none" rows={3} value={f.bio} onChange={(e) => setF({ ...f, bio: e.target.value })} />
          <span className={`mt-1 block text-right text-xs ${f.bio.length > 160 ? 'text-red-600' : 'text-muted'}`}>{f.bio.length}/160</span>
          {err.bio && <span className="block text-xs text-red-600">{err.bio}</span>}
        </label>
        <Field label="Location" value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })} />
        <Field label="Website" value={f.website} onChange={(e) => setF({ ...f, website: e.target.value })} placeholder="example.com" />
        <div className="flex justify-end gap-2">
          <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary">Save changes</button>
        </div>
      </form>
    </Modal>
  );
}

export default function Profile() {
  const { username } = useParams();
  const { me, posts, byUsername, byId, followersOf, followingOf, openConversation } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState('posts');
  const [edit, setEdit] = useState(false);
  const user = byUsername(username);

  if (!user) {
    return <EmptyState icon={UserX} title="Profile not found" text={`There is no account with the username @${username}.`} action={<Link to="/explore" className="btn btn-primary">Find people</Link>} />;
  }

  const isMe = user.id === me.id;
  const locked = user.private && !isMe && !me.followingIds.includes(user.id);
  const own = posts.filter((p) => p.userId === user.id).sort((a, b) => b.createdAt - a.createdAt);
  const media = own.filter((p) => p.image);
  const liked = posts.filter((p) => p.likes.includes(user.id)).sort((a, b) => b.createdAt - a.createdAt);
  const tabs = [['posts', 'Posts', Grid3x3, own], ['media', 'Media', ImageIcon, media], ['liked', 'Liked', Heart, liked]];
  const current = tabs.find((t) => t[0] === tab) || tabs[0];

  const message = () => navigate(`/messages/${openConversation(user.id)}`);

  return (
    <div className="mx-auto max-w-[720px] space-y-4">
      <div className="card overflow-hidden">
        <RemoteImage src={user.cover} className="h-36 w-full sm:h-52" />
        <div className="px-5 pb-5">
          <div className="-mt-12 flex items-end justify-between">
            <Avatar user={user} size={96} className="border-4 border-surface" />
            <div className="flex gap-2 pb-1">
              {isMe ? (
                <button className="btn btn-outline" onClick={() => setEdit(true)}><Camera size={16} /> Edit profile</button>
              ) : (
                <>
                  <button className="btn btn-outline" onClick={message}>Message</button>
                  <FollowButton user={user} />
                </>
              )}
            </div>
          </div>
          <h1 className="mt-3 text-2xl font-bold leading-tight">{user.name}</h1>
          <p className="text-sm text-muted">@{user.username}{user.private && <Lock size={12} className="ml-1.5 inline" aria-label="Private account" />}</p>
          {user.bio && <p className="mt-3 max-w-prose text-[15px]">{user.bio}</p>}
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
            {user.location && <span className="inline-flex items-center gap-1.5"><MapPin size={14} /> {user.location}</span>}
            {user.website && <span className="inline-flex items-center gap-1.5"><LinkIcon size={14} /> <a className="text-brand hover:underline" href={`https://${user.website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer">{user.website}</a></span>}
            <span className="inline-flex items-center gap-1.5"><Calendar size={14} /> Joined {new Date(user.joined).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
          </div>
          <div className="mt-4 flex gap-6 text-sm">
            <span><b className="text-base">{own.length}</b> <span className="text-muted">posts</span></span>
            <span><b className="text-base">{formatCount(followersOf(user))}</b> <span className="text-muted">followers</span></span>
            <span><b className="text-base">{formatCount(followingOf(user))}</b> <span className="text-muted">following</span></span>
          </div>
        </div>
        {!locked && (
          <div className="flex border-t border-line" role="tablist">
            {tabs.map(([k, label, Icon]) => (
              <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
                className={`flex flex-1 items-center justify-center gap-2 border-b-2 py-3 text-sm font-medium transition-colors ${tab === k ? 'border-brand text-brand' : 'border-transparent text-muted hover:text-ink'}`}>
                <Icon size={16} /> {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {locked ? (
        <EmptyState icon={Lock} title="This account is private" text={`Follow @${user.username} to see their posts.`} />
      ) : current[3].length === 0 ? (
        <EmptyState icon={current[2]} title={tab === 'posts' ? 'No posts yet' : tab === 'media' ? 'No photos yet' : 'No liked posts yet'}
          text={isMe && tab === 'posts' ? 'Share your first post from the home page.' : 'Nothing to show here right now.'}
          action={isMe && tab === 'posts' ? <Link to="/" className="btn btn-primary">Create a post</Link> : null} />
      ) : tab === 'media' ? (
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          {media.map((p) => (
            <Link key={p.id} to={`/post/${p.id}`} className="group relative aspect-square overflow-hidden rounded-xl">
              <RemoteImage src={p.image} alt={p.text.slice(0, 60)} className="h-full w-full transition-transform group-hover:scale-105" />
              <span className="absolute inset-0 flex items-center justify-center gap-1 bg-black/45 text-sm font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
                <Heart size={15} className="fill-current" /> {p.likes.length}
              </span>
            </Link>
          ))}
        </div>
      ) : current[3].map((p) => <PostCard key={p.id} post={p} />)}

      {isMe && edit && <EditProfile key={String(edit)} open={edit} onClose={() => setEdit(false)} user={user} />}
    </div>
  );
}
