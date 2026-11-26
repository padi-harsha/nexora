import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useApp } from './context/AppContext';
import AppLayout from './layouts/AppLayout';
import AuthLayout from './layouts/AuthLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import PostPage from './pages/PostPage';
import Notifications from './pages/Notifications';
import Messages from './pages/Messages';
import Saved from './pages/Saved';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

function Protected({ children }) {
  const { me } = useApp();
  const loc = useLocation();
  return me ? children : <Navigate to="/login" replace state={{ from: loc.pathname }} />;
}

function Guest({ children }) {
  const { me } = useApp();
  return me ? <Navigate to="/" replace /> : children;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Guest><AuthLayout /></Guest>}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>
      <Route element={<Protected><AppLayout /></Protected>}>
        <Route index element={<Home />} />
        <Route path="explore" element={<Explore />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="messages" element={<Messages />} />
        <Route path="messages/:id" element={<Messages />} />
        <Route path="saved" element={<Saved />} />
        <Route path="settings" element={<Settings />} />
        <Route path="u/:username" element={<Profile />} />
        <Route path="post/:id" element={<PostPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
