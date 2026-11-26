import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import BottomNav from './BottomNav';
import Modal from '../components/Modal';
import CreatePostForm from '../components/CreatePostForm';
import Toasts from '../components/Toasts';

export default function AppLayout() {
  const [composer, setComposer] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return (
    <div className="min-h-screen bg-bg text-ink">
      <Sidebar onCompose={() => setComposer(true)} />
      <div className="md:pl-[76px] lg:pl-64">
        <TopBar />
        <main className="mx-auto w-full max-w-[1040px] px-4 pb-24 pt-4 md:px-6 md:pb-10 md:pt-6">
          <Outlet />
        </main>
      </div>
      <BottomNav onCompose={() => setComposer(true)} />
      <Modal open={composer} onClose={() => setComposer(false)} title="Create post">
        <CreatePostForm autoFocus onDone={() => setComposer(false)} />
      </Modal>
      <Toasts />
    </div>
  );
}
