import { useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import Avatar from './Avatar';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/seed';
import { fileToDataUrl } from '../utils/helpers';

const MAX = 500;

export default function CreatePostForm({ onDone, compact = false, autoFocus = false }) {
  const { me, createPost } = useApp();
  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [err, setErr] = useState('');
  const fileRef = useRef(null);

  const pick = async (e) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    if (!f.type.startsWith('image/')) { setErr('Please choose an image file.'); return; }
    try { setImage(await fileToDataUrl(f)); setErr(''); } catch { setErr('That image could not be read.'); }
  };

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim() && !image) { setErr('Write something or add a photo first.'); return; }
    if (text.length > MAX) return;
    createPost({ text, image, category });
    setText(''); setImage(''); setCategory(''); setErr('');
    onDone?.();
  };

  return (
    <form onSubmit={submit} className="flex gap-3">
      <Avatar user={me} size={44} />
      <div className="min-w-0 flex-1">
        <textarea
          autoFocus={autoFocus}
          value={text}
          onChange={(e) => { setText(e.target.value); setErr(''); }}
          rows={compact ? 2 : 4}
          placeholder="Share something with your network"
          aria-label="Post text"
          className="w-full resize-none bg-transparent py-2 text-[15px] outline-none placeholder:text-muted"
        />
        {image && (
          <div className="relative mt-1">
            <img src={image} alt="Selected upload" className="max-h-72 w-full rounded-xl object-cover" />
            <button type="button" onClick={() => setImage('')} className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white" aria-label="Remove photo"><X size={14} /></button>
          </div>
        )}
        {err && <p className="mt-2 text-xs text-red-600">{err}</p>}
        <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-line pt-2">
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={pick} />
          <button type="button" className="icon-btn" onClick={() => fileRef.current?.click()} aria-label="Add photo"><ImagePlus size={19} /></button>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs text-muted outline-none focus:border-brand" aria-label="Category">
            <option value="">No category</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <span className={`ml-auto text-xs ${text.length > MAX ? 'text-red-600' : 'text-muted'}`}>{text.length}/{MAX}</span>
          <button className="btn btn-primary" disabled={(!text.trim() && !image) || text.length > MAX}>Post</button>
        </div>
      </div>
    </form>
  );
}
