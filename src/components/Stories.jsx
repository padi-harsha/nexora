import { useEffect, useMemo, useRef, useState } from 'react';
import { Plus, X } from 'lucide-react';
import Avatar from './Avatar';
import RemoteImage from './RemoteImage';
import { useApp } from '../context/AppContext';
import { fileToDataUrl, timeAgo } from '../utils/helpers';

function StoryViewer({ groups, start, onClose }) {
  const { viewStory } = useApp();
  const [gi, setGi] = useState(start);
  const [si, setSi] = useState(0);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const g = groups[gi];
  const item = g.items[si];

  const next = () => {
    if (si < g.items.length - 1) setSi(si + 1);
    else if (gi < groups.length - 1) { setGi(gi + 1); setSi(0); } else closeRef.current();
  };
  const prev = () => {
    if (si > 0) setSi(si - 1);
    else if (gi > 0) { setGi(gi - 1); setSi(0); }
  };

  useEffect(() => { viewStory(g.user.id); }, [gi]); // eslint-disable-line react-hooks/exhaustive-deps
  const nextRef = useRef(next);
  nextRef.current = next;
  useEffect(() => {
    const t = setTimeout(() => nextRef.current(), 5000);
    return () => clearTimeout(t);
  }, [gi, si]);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closeRef.current();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="anim-fade fixed inset-0 z-[60] flex items-center justify-center bg-black">
      <div className="relative h-full max-h-[780px] w-full max-w-[440px] overflow-hidden bg-neutral-900 sm:rounded-2xl">
        <RemoteImage src={item.image} alt="Story" className="h-full w-full" />
        <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/60 to-transparent p-3">
          <div className="flex gap-1">
            {g.items.map((it, i) => (
              <div key={`${gi}-${it.id}`} className="h-0.5 flex-1 overflow-hidden rounded bg-white/30">
                <div
                  className="h-full bg-white"
                  style={i < si ? { width: '100%' } : i === si ? { animation: 'story 5s linear forwards' } : { width: 0 }}
                />
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 text-white">
            <Avatar user={g.user} size={32} />
            <span className="text-sm font-semibold">{g.user.name}</span>
            <span className="text-xs text-white/70">{timeAgo(item.createdAt)}</span>
            <button onClick={onClose} className="ml-auto rounded-full p-1.5 hover:bg-white/20" aria-label="Close story"><X size={20} /></button>
          </div>
        </div>
        <button className="absolute inset-y-16 left-0 w-1/3" onClick={prev} aria-label="Previous story" />
        <button className="absolute inset-y-16 right-0 w-2/3" onClick={next} aria-label="Next story" />
      </div>
    </div>
  );
}

export default function Stories() {
  const { me, users, stories, viewedStories, addStory, toast } = useApp();
  const fileRef = useRef(null);
  const [view, setView] = useState(null);

  const groups = useMemo(() => {
    const ids = [me.id, ...me.followingIds];
    return ids
      .map((id) => ({ user: users.find((u) => u.id === id), items: stories.filter((s) => s.userId === id).sort((a, b) => a.createdAt - b.createdAt) }))
      .filter((g) => g.user && g.items.length)
      .sort((a, b) => (a.user.id === me.id ? -1 : b.user.id === me.id ? 1 : Number(viewedStories.includes(a.user.id)) - Number(viewedStories.includes(b.user.id))));
  }, [me, users, stories, viewedStories]);

  const mineIndex = groups.findIndex((g) => g.user.id === me.id);

  const onFile = async (e) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    if (!f.type.startsWith('image/')) { toast('Please choose an image file'); return; }
    try { addStory(await fileToDataUrl(f, 900)); } catch { toast('That image could not be read'); }
  };

  return (
    <section aria-label="Stories" className="card p-4">
      <div className="no-scrollbar flex gap-4 overflow-x-auto">
        <div className="flex w-16 shrink-0 flex-col items-center gap-1.5">
          <div className="relative">
            <button onClick={() => (mineIndex >= 0 ? setView({ groups, start: mineIndex }) : fileRef.current?.click())} aria-label="Your story">
              <Avatar user={me} size={60} ring={mineIndex >= 0} />
            </button>
            <button onClick={() => fileRef.current?.click()} className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-surface bg-brand text-brandink" aria-label="Add to your story"><Plus size={14} /></button>
          </div>
          <span className="w-full truncate text-center text-xs text-muted">Your story</span>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
        </div>
        {groups.filter((g) => g.user.id !== me.id).map((g) => {
          const seen = viewedStories.includes(g.user.id);
          return (
            <button key={g.user.id} onClick={() => setView({ groups, start: groups.indexOf(g) })} className="flex w-16 shrink-0 flex-col items-center gap-1.5">
              <span className={`rounded-full p-[3px] ${seen ? 'bg-line' : 'bg-brand'}`}>
                <span className="block rounded-full border-2 border-surface"><Avatar user={g.user} size={54} /></span>
              </span>
              <span className={`w-full truncate text-center text-xs ${seen ? 'text-muted' : 'font-medium'}`}>{g.user.name.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
      {view && <StoryViewer groups={view.groups} start={view.start} onClose={() => setView(null)} />}
    </section>
  );
}
