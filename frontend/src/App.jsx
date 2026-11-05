import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/public/Home';
import DynamicPage from './pages/public/DynamicPage';
import Live from './pages/public/Live';
import ProtectedRoute from './components/admin/ProtectedRoute';

// Admin bundle is split from the public site.
const Login = lazy(() => import('./pages/admin/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Admissions = lazy(() => import('./pages/admin/Admissions'));
const Gallery = lazy(() => import('./pages/admin/Gallery'));
const Testimonials = lazy(() => import('./pages/admin/Testimonials'));
const Notices = lazy(() => import('./pages/admin/Notices'));
const Settings = lazy(() => import('./pages/admin/Settings'));
const HomeAdmin = lazy(() => import('./pages/admin/HomeAdmin'));
const PageAdmin = lazy(() => import('./pages/admin/PageAdmin'));
const Messages = lazy(() => import('./pages/admin/Messages'));
const LiveAdmin = lazy(() => import('./pages/admin/LiveAdmin'));

const guard = (el) => <ProtectedRoute>{el}</ProtectedRoute>;

export default function App() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-slate-500">Loading…</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/live" element={<Live />} />
        <Route path="/admin/live" element={guard(<LiveAdmin />)} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={guard(<Dashboard />)} />
        <Route path="/admin/admissions" element={guard(<Admissions />)} />
        <Route path="/admin/gallery" element={guard(<Gallery />)} />
        <Route path="/admin/testimonials" element={guard(<Testimonials />)} />
        <Route path="/admin/notices" element={guard(<Notices />)} />
        <Route path="/admin/settings" element={guard(<Settings />)} />
        <Route path="/admin/home" element={guard(<HomeAdmin />)} />
        <Route path="/admin/pages/*" element={guard(<PageAdmin />)} />
        <Route path="/admin/messages" element={guard(<Messages />)} />
        <Route path="/:slug" element={<DynamicPage />} />
        <Route path="/:slug/*" element={<DynamicPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
