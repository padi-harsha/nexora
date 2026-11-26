import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MessageCircle, PenSquare, Search, Send } from 'lucide-react';
import Avatar from '../components/Avatar';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { useApp } from '../context/AppContext';
import { chatTime, clock } from '../utils/helpers';

export default function Messages() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { me, users, conversations, byId, sendMessage, markConvoRead, openConversation, activeConvo } = useApp();
  const [q, setQ] = useState('');
  const [text, setText] = useState('');
  const [newOpen, setNewOpen] = useState(false);
  const endRef = useRef(null);

  const convo = conversations.find((c) => c.id === id);
  const other = convo ? byId(convo.userId) : null;
  const msgCount = convo?.messages.length || 0;

  useEffect(() => {
    activeConvo.current = convo ? convo.id : null;
    if (convo && convo.unread) markConvoRead(convo.id);
    return () => { activeConvo.current = null; };
  }, [convo?.id, convo?.unread]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end' }); }, [convo?.id, msgCount]);

  if (id && !convo) return <Navigate to="/messages" replace />;

  const filtered = conversations.filter((c) => {
    const u = byId(c.userId);
    return u && (`${u.name} ${u.username}`.toLowerCase().includes(q.trim().toLowerCase()));
  });

  const send = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage(convo.id, text);
    setText('');
  };

  const startWith = (u) => {
    const cid = openConversation(u.id);
    setNewOpen(false);
    navigate(`/messages/${cid}`);
  };

  const contacts = users.filter((u) => u.demo && u.id !== me.id);

  return (
    <div className="card flex h-[calc(100dvh-9.5rem)] overflow-hidden md:h-[calc(100dvh-8.5rem)]">
      <section className={`${convo ? 'hidden md:flex' : 'flex'} w-full flex-col border-r border-line md:w-80 md:shrink-0`}>
        <div className="flex items-center justify-between p-4 pb-2">
          <h1 className="text-xl font-bold">Messages</h1>
          <button className="icon-btn" onClick={() => setNewOpen(true)} aria-label="New message"><PenSquare size={19} /></button>
        </div>
        <div className="relative px-4 pb-3">
          <Search size={15} className="absolute left-7 top-1/2 -translate-y-[70%] text-muted" />
          <input className="input !rounded-full pl-9" placeholder="Search conversations" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search conversations" />
        </div>
        <ul className="flex-1 overflow-y-auto">
          {filtered.length === 0 && <li className="px-4 py-8 text-center text-sm text-muted">{q ? 'No conversations match your search.' : 'No conversations yet.'}</li>}
          {filtered.map((c) => {
            const u = byId(c.userId);
            const last = c.messages.at(-1);
            return (
              <li key={c.id}>
                <Link to={`/messages/${c.id}`} className={`flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface2 ${c.id === id ? 'bg-brandsoft' : ''}`}>
                  <Avatar user={u} size={46} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className={`truncate text-sm ${c.unread ? 'font-bold' : 'font-semibold'}`}>{u.name}</p>
                      {last && <span className="shrink-0 text-xs text-muted">{chatTime(last.at)}</span>}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className={`truncate text-sm ${c.unread ? 'font-medium text-ink' : 'text-muted'}`}>{last ? `${last.from === me.id ? 'You: ' : ''}${last.text}` : 'Say hello'}</p>
                      {c.unread > 0 && <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-brand px-1 text-[11px] font-bold text-brandink">{c.unread}</span>}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={`${convo ? 'flex' : 'hidden md:flex'} min-w-0 flex-1 flex-col`}>
        {convo && other ? (
          <>
            <header className="flex items-center gap-3 border-b border-line px-4 py-3">
              <Link to="/messages" className="icon-btn md:hidden" aria-label="Back to conversations"><ArrowLeft size={19} /></Link>
              <Link to={`/u/${other.username}`} className="flex items-center gap-3">
                <Avatar user={other} size={38} />
                <div><p className="text-sm font-semibold leading-tight">{other.name}</p><p className="text-xs text-muted">@{other.username}</p></div>
              </Link>
            </header>
            <div className="flex-1 space-y-2 overflow-y-auto p-4">
              {convo.messages.length === 0 && <p className="py-10 text-center text-sm text-muted">No messages yet. Write the first one.</p>}
              {convo.messages.map((m) => {
                const mine = m.from === me.id;
                return (
                  <div key={m.id} className={`flex flex-col ${mine ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[80%] break-words rounded-2xl px-3.5 py-2 text-sm ${mine ? 'rounded-br-md bg-brand text-brandink' : 'rounded-bl-md bg-surface2'}`}>{m.text}</div>
                    <span className="mt-0.5 px-1 text-[11px] text-muted">{clock(m.at)}</span>
                  </div>
                );
              })}
              <div ref={endRef} />
            </div>
            <form onSubmit={send} className="flex items-center gap-2 border-t border-line p-3">
              <input className="input !rounded-full" placeholder="Write a message" value={text} onChange={(e) => setText(e.target.value)} aria-label="Message" maxLength={1000} />
              <button className="btn btn-primary !px-3.5" disabled={!text.trim()} aria-label="Send message"><Send size={17} /></button>
            </form>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center p-6">
            <EmptyState icon={MessageCircle} title="Select a conversation" text="Choose a chat from the list or start a new one."
              action={<button className="btn btn-primary" onClick={() => setNewOpen(true)}>New message</button>} />
          </div>
        )}
      </section>

      <Modal open={newOpen} onClose={() => setNewOpen(false)} title="New message" size="max-w-md">
        <ul className="space-y-1">
          {contacts.map((u) => (
            <li key={u.id}>
              <button onClick={() => startWith(u)} className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-surface2">
                <Avatar user={u} size={40} />
                <span><span className="block text-sm font-semibold">{u.name}</span><span className="block text-xs text-muted">@{u.username}</span></span>
              </button>
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  );
}
