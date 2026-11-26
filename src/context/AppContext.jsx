import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { buildSeed, REPLIES } from '../data/seed';
import { uid } from '../utils/helpers';

const Ctx = createContext(null);
const KEY = 'nexora_v1';

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw);
      if (p && p.users && p.posts && p.accounts) return p;
    }
  } catch { /* ignore corrupted storage */ }
  return buildSeed();
}

export const useApp = () => useContext(Ctx);

const pushNotif = (s, n) => ({ ...s, notifications: [{ id: uid('n'), at: Date.now(), read: false, ...n }, ...s.notifications] });
const isOwner = (s, userId) => s.accounts.some((a) => a.userId === userId);

export function AppProvider({ children }) {
  const [state, setState] = useState(load);
  const [toasts, setToasts] = useState([]);
  const activeConvo = useRef(null);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage full */ }
  }, [state]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
  }, [state.theme]);

  const meId = state.session?.userId || null;
  const me = state.users.find((u) => u.id === meId) || null;

  const toast = useCallback((message) => {
    const id = uid('t');
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  const patchUser = (id, fn) => setState((s) => ({ ...s, users: s.users.map((u) => (u.id === id ? fn(u) : u)) }));

  /* ---------- auth ---------- */
  const login = (email, password) => {
    const acc = state.accounts.find((a) => a.email === email.trim().toLowerCase() && a.password === password);
    if (!acc) return { error: 'Incorrect email or password.' };
    setState((s) => ({ ...s, session: { userId: acc.userId } }));
    return { ok: true };
  };

  const register = ({ name, username, email, password }) => {
    const em = email.trim().toLowerCase();
    const un = username.trim().toLowerCase();
    if (state.accounts.some((a) => a.email === em)) return { error: 'An account with this email already exists.', field: 'email' };
    if (state.users.some((u) => u.username === un)) return { error: 'That username is taken.', field: 'username' };
    const id = uid('usr');
    const suggested = state.users.filter((u) => u.demo && u.id !== 'me' && !u.private).slice(0, 4).map((u) => u.id);
    const user = {
      id, name: name.trim(), username: un, bio: '', location: '', website: '', avatar: '', cover: '',
      private: false, showActivity: true, allowMessages: true, followingIds: suggested, bookmarks: [], requested: [],
      demo: false, followersBase: 0, followingBase: 0, joined: Date.now(),
    };
    setState((s) => ({
      ...s, users: [...s.users, user], accounts: [...s.accounts, { userId: id, email: em, password }], session: { userId: id },
    }));
    return { ok: true };
  };

  const logout = () => { setState((s) => ({ ...s, session: null })); };

  const resetPassword = (email, next) => {
    const em = email.trim().toLowerCase();
    if (!state.accounts.some((a) => a.email === em)) return { error: 'No account found with that email.' };
    if (next) setState((s) => ({ ...s, accounts: s.accounts.map((a) => (a.email === em ? { ...a, password: next } : a)) }));
    return { ok: true };
  };

  const changePassword = (current, next) => {
    const acc = state.accounts.find((a) => a.userId === meId);
    if (!acc || acc.password !== current) return { error: 'Current password is incorrect.', field: 'current' };
    setState((s) => ({ ...s, accounts: s.accounts.map((a) => (a.userId === meId ? { ...a, password: next } : a)) }));
    return { ok: true };
  };

  const deleteAccount = () => {
    setState((s) => ({
      ...s,
      session: null,
      users: s.users.filter((u) => u.id !== meId),
      accounts: s.accounts.filter((a) => a.userId !== meId),
      posts: s.posts.filter((p) => p.userId !== meId),
      notifications: s.notifications.filter((n) => n.ownerId !== meId),
      conversations: s.conversations.filter((c) => c.ownerId !== meId),
      stories: s.stories.filter((x) => x.userId !== meId),
    }));
  };

  const resetDemo = () => {
    localStorage.removeItem(KEY);
    setState(buildSeed());
    toast('Demo data restored');
  };

  /* ---------- profile & settings ---------- */
  const updateProfile = (patch) => {
    let next = patch;
    if (patch.username !== undefined) {
      const un = patch.username.trim().toLowerCase();
      if (state.users.some((u) => u.id !== meId && u.username === un)) return { error: 'That username is taken.', field: 'username' };
      next = { ...patch, username: un };
    }
    patchUser(meId, (u) => ({ ...u, ...next }));
    return { ok: true };
  };

  const updateAccount = ({ email }) => {
    const em = email.trim().toLowerCase();
    if (state.accounts.some((a) => a.userId !== meId && a.email === em)) return { error: 'That email is already in use.', field: 'email' };
    setState((s) => ({ ...s, accounts: s.accounts.map((a) => (a.userId === meId ? { ...a, email: em } : a)) }));
    return { ok: true };
  };

  const toggleTheme = () => setState((s) => ({ ...s, theme: s.theme === 'dark' ? 'light' : 'dark' }));
  const setTheme = (theme) => setState((s) => ({ ...s, theme }));

  /* ---------- posts ---------- */
  const toggleLike = (postId) => {
    setState((s) => {
      const p = s.posts.find((x) => x.id === postId);
      if (!p) return s;
      const liked = p.likes.includes(meId);
      let next = { ...s, posts: s.posts.map((x) => (x.id === postId ? { ...x, likes: liked ? x.likes.filter((i) => i !== meId) : [...x.likes, meId] } : x)) };
      if (!liked && p.userId !== meId && isOwner(s, p.userId)) next = pushNotif(next, { ownerId: p.userId, type: 'like', userId: meId, postId });
      return next;
    });
  };

  const addComment = (postId, text) => {
    const t = text.trim();
    if (!t) return;
    setState((s) => {
      const p = s.posts.find((x) => x.id === postId);
      if (!p) return s;
      let next = { ...s, posts: s.posts.map((x) => (x.id === postId ? { ...x, comments: [...x.comments, { id: uid('c'), userId: meId, text: t, createdAt: Date.now() }] } : x)) };
      if (p.userId !== meId && isOwner(s, p.userId)) next = pushNotif(next, { ownerId: p.userId, type: 'comment', userId: meId, postId, text: t });
      return next;
    });
  };

  const deleteComment = (postId, commentId) => {
    setState((s) => ({ ...s, posts: s.posts.map((p) => (p.id === postId ? { ...p, comments: p.comments.filter((c) => c.id !== commentId) } : p)) }));
  };

  const createPost = ({ text, image, category }) => {
    const id = uid('p');
    const post = { id, userId: meId, text: text.trim(), image: image || '', category: category || '', createdAt: Date.now(), likes: [], comments: [], shares: 0 };
    setState((s) => ({ ...s, posts: [post, ...s.posts] }));
    toast('Post published');
    const pool = state.users.filter((u) => u.demo && u.id !== 'me' && u.id !== meId);
    const pick = () => pool[Math.floor(Math.random() * pool.length)];
    setTimeout(() => setState((s) => {
      const p = s.posts.find((x) => x.id === id);
      const u = pick();
      if (!p || !u || p.likes.includes(u.id)) return s;
      return pushNotif({ ...s, posts: s.posts.map((x) => (x.id === id ? { ...x, likes: [...x.likes, u.id] } : x)) }, { ownerId: meId, type: 'like', userId: u.id, postId: id });
    }), 6000);
    const lines = ['Nice one, thanks for sharing this.', 'Really like this. Keep posting.', 'This made my day.'];
    setTimeout(() => setState((s) => {
      const p = s.posts.find((x) => x.id === id);
      const u = pick();
      if (!p || !u) return s;
      const text2 = lines[Math.floor(Math.random() * lines.length)];
      return pushNotif({ ...s, posts: s.posts.map((x) => (x.id === id ? { ...x, comments: [...x.comments, { id: uid('c'), userId: u.id, text: text2, createdAt: Date.now() }] } : x)) }, { ownerId: meId, type: 'comment', userId: u.id, postId: id, text: text2 });
    }), 12000);
  };

  const deletePost = (postId) => {
    setState((s) => ({ ...s, posts: s.posts.filter((p) => p.id !== postId) }));
    toast('Post deleted');
  };

  const toggleBookmark = (postId) => {
    const saved = me.bookmarks.includes(postId);
    patchUser(meId, (u) => ({ ...u, bookmarks: saved ? u.bookmarks.filter((i) => i !== postId) : [...u.bookmarks, postId] }));
    toast(saved ? 'Removed from saved' : 'Saved to your collection');
  };

  const sharePost = (postId) => {
    setState((s) => ({ ...s, posts: s.posts.map((p) => (p.id === postId ? { ...p, shares: p.shares + 1 } : p)) }));
  };

  /* ---------- follows ---------- */
  const toggleFollow = (targetId) => {
    const target = state.users.find((u) => u.id === targetId);
    if (!target || !me || targetId === meId) return;
    if (me.followingIds.includes(targetId)) {
      patchUser(meId, (u) => ({ ...u, followingIds: u.followingIds.filter((x) => x !== targetId) }));
      toast(`Unfollowed @${target.username}`);
      return;
    }
    if (me.requested.includes(targetId)) {
      patchUser(meId, (u) => ({ ...u, requested: u.requested.filter((x) => x !== targetId) }));
      toast('Follow request cancelled');
      return;
    }
    if (target.private) {
      patchUser(meId, (u) => ({ ...u, requested: [...u.requested, targetId] }));
      toast('Follow request sent');
      if (target.demo) {
        setTimeout(() => setState((s) => {
          const mine = s.users.find((u) => u.id === meId);
          if (!mine || !mine.requested.includes(targetId)) return s;
          const upd = { ...s, users: s.users.map((u) => (u.id === meId ? { ...u, requested: u.requested.filter((x) => x !== targetId), followingIds: [...u.followingIds, targetId] } : u)) };
          return pushNotif(upd, { ownerId: meId, type: 'accepted', userId: targetId });
        }), 4000);
      }
      return;
    }
    patchUser(meId, (u) => ({ ...u, followingIds: [...u.followingIds, targetId] }));
    if (isOwner(state, targetId)) setState((s) => pushNotif(s, { ownerId: targetId, type: 'follow', userId: meId }));
    toast(`Following @${target.username}`);
  };

  /* ---------- notifications ---------- */
  const markNotifRead = (id) => setState((s) => ({ ...s, notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) }));
  const markAllNotifsRead = () => setState((s) => ({ ...s, notifications: s.notifications.map((n) => (n.ownerId === meId ? { ...n, read: true } : n)) }));
  const respondRequest = (id, accept) => {
    setState((s) => ({
      ...s,
      users: accept ? s.users.map((u) => (u.id === meId ? { ...u, followersBase: u.followersBase + 1 } : u)) : s.users,
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true, status: accept ? 'accepted' : 'declined' } : n)),
    }));
    toast(accept ? 'Request accepted' : 'Request declined');
  };

  /* ---------- messages ---------- */
  const openConversation = (userId) => {
    const existing = state.conversations.find((c) => c.ownerId === meId && c.userId === userId);
    if (existing) return existing.id;
    const id = uid('c');
    setState((s) => ({ ...s, conversations: [...s.conversations, { id, ownerId: meId, userId, unread: 0, messages: [] }] }));
    return id;
  };

  const sendMessage = (convoId, text) => {
    const t = text.trim();
    if (!t) return;
    const msg = { id: uid('m'), from: meId, text: t, at: Date.now() };
    setState((s) => ({ ...s, conversations: s.conversations.map((c) => (c.id === convoId ? { ...c, messages: [...c.messages, msg] } : c)) }));
    const convo = state.conversations.find((c) => c.id === convoId);
    const other = convo && state.users.find((u) => u.id === convo.userId);
    if (other?.demo) {
      setTimeout(() => setState((s) => ({
        ...s,
        conversations: s.conversations.map((c) => (c.id !== convoId ? c : {
          ...c,
          messages: [...c.messages, { id: uid('m'), from: c.userId, text: REPLIES[Math.floor(Math.random() * REPLIES.length)], at: Date.now() }],
          unread: activeConvo.current === convoId ? 0 : c.unread + 1,
        })),
      })), 1800 + Math.random() * 1500);
    }
  };

  const markConvoRead = (id) => setState((s) => {
    const c = s.conversations.find((x) => x.id === id);
    if (!c || !c.unread) return s;
    return { ...s, conversations: s.conversations.map((x) => (x.id === id ? { ...x, unread: 0 } : x)) };
  });

  /* ---------- stories ---------- */
  const viewStory = (userId) => setState((s) => (s.viewedStories.includes(userId) ? s : { ...s, viewedStories: [...s.viewedStories, userId] }));
  const addStory = (image) => {
    setState((s) => ({ ...s, stories: [...s.stories, { id: uid('s'), userId: meId, image, createdAt: Date.now() }] }));
    toast('Story added');
  };

  /* ---------- derived ---------- */
  const conversations = state.conversations
    .filter((c) => c.ownerId === meId)
    .sort((a, b) => (b.messages.at(-1)?.at || 0) - (a.messages.at(-1)?.at || 0));
  const notifications = state.notifications.filter((n) => n.ownerId === meId).sort((a, b) => b.at - a.at);
  const unreadNotifs = notifications.filter((n) => !n.read).length;
  const unreadMessages = conversations.reduce((sum, c) => sum + c.unread, 0);
  const myEmail = state.accounts.find((a) => a.userId === meId)?.email || '';
  const byId = (id) => state.users.find((u) => u.id === id);
  const byUsername = (un) => state.users.find((u) => u.username === (un || '').toLowerCase());
  const followersOf = (u) => u.followersBase + state.users.filter((x) => x.followingIds.includes(u.id)).length;
  const followingOf = (u) => u.followingBase + u.followingIds.length;

  const value = {
    me, users: state.users, posts: state.posts, stories: state.stories, viewedStories: state.viewedStories,
    theme: state.theme, conversations, notifications, unreadNotifs, unreadMessages, toasts, activeConvo,
    myEmail, byId, byUsername, followersOf, followingOf,
    login, register, logout, resetPassword, changePassword, deleteAccount, resetDemo,
    updateProfile, updateAccount, toggleTheme, setTheme,
    toggleLike, addComment, deleteComment, createPost, deletePost, toggleBookmark, sharePost,
    toggleFollow, markNotifRead, markAllNotifsRead, respondRequest,
    openConversation, sendMessage, markConvoRead, viewStory, addStory, toast,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
