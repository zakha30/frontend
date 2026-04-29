import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { authApi } from './api/auth';

import { AuthLayout }  from './components/layout/AuthLayout';
import { AppLayout }   from './components/layout/AppLayout';

import Login           from './pages/auth/Login';
import Register        from './pages/auth/Register';
import Dashboard       from './pages/dashboard/Dashboard';
import Home            from './pages/home/Home';
import Fleet           from './pages/fleet/Fleet';
import Drivers         from './pages/drivers/Drivers';
import Trips           from './pages/trips/Trips';
import Bookings        from './pages/bookings/Bookings';
import Reports         from './pages/reports/Reports';
import Notifications   from './pages/notifications/Notifications';
import { FullPageSpinner } from './components/common';
import AvailableLoads  from './pages/loads/AvailableLoads';
import QuotesBoard     from './pages/loads/QuotesBoard';
import FleetHire       from './pages/fleet/FleetHire';
import Directory       from './pages/directory/Directory';
import Classifieds     from './pages/classifieds/Classifieds';
import Jobs            from './pages/jobs/Jobs';
import Forum           from './pages/forum/Forum';
import { PublicLayout } from './components/layout/PublicLayout';
// ── Route guards ──────────────────────────────────────────────────────────────
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isHydrating } = useAuthStore();
  if (isHydrating) return <FullPageSpinner />;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isHydrating } = useAuthStore();
  if (isHydrating) return <FullPageSpinner />;
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

export default function App() {
  const { setUser, clearAuth, setHydrating, user } = useAuthStore();

  useEffect(() => {
    if (!user) return;
    setHydrating(true);
    authApi.me()
      .then(u => setUser(u))
      .catch(() => clearAuth())
      .finally(() => setHydrating(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background:   '#ffffff',
            color:        '#1e293b',
            border:       '1px solid #e2e8f0',
            borderRadius: '12px',
            fontSize:     '14px',
            fontFamily:   'Cairo, Sora, sans-serif',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#ffffff' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#ffffff' } },
        }}
      />

      <BrowserRouter>
        <Routes>

          {/* ── Public pages (no auth needed) ───────────────────────────────── */}
<Route element={<PublicLayout />}>
  <Route path="/fleet"       element={<Fleet />} />
  <Route path="/drivers"     element={<Drivers />} />
  <Route path="/loads"       element={<AvailableLoads />} />
  <Route path="/classifieds" element={<Classifieds />} />
  <Route path="/jobs"        element={<Jobs />} />
  <Route path="/forum"       element={<Forum />} />
  <Route path="/directory"   element={<Directory />} />
</Route>

          {/* ── Guest-only auth pages ───────────────────────────────────── */}
          <Route element={<GuestRoute><AuthLayout /></GuestRoute>}>
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* ── Public pages (no auth needed, use Home's own nav) ────────── */}
          <Route path="/"            element={<Home />} />
          <Route path="/fleet"       element={<Fleet />} />
          <Route path="/drivers"     element={<Drivers />} />
          <Route path="/loads"       element={<AvailableLoads />} />
          <Route path="/classifieds" element={<Classifieds />} />
          <Route path="/jobs"        element={<Jobs />} />
          <Route path="/forum"       element={<Forum />} />
          <Route path="/directory"   element={<Directory />} />

          {/* ── Protected pages (auth required, use AppLayout + sidebar) ── */}
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path="/dashboard"     element={<Dashboard />} />
            <Route path="/trips"         element={<Trips />} />
            <Route path="/bookings"      element={<Bookings />} />
            <Route path="/reports"       element={<Reports />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/quotes-board"  element={<QuotesBoard />} />
            <Route path="/hire"          element={<FleetHire />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}