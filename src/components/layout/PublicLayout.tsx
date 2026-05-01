import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Zap, Menu, X, Truck, Users, Package, Tag,
  Briefcase, MessageCircle, Building2, BarChart3,
  LogIn, UserPlus, LogOut, Bell,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../api/auth';
import { LanguageToggle } from './languageToggle';

export const PublicLayout = () => {
  const { t } = useTranslation('common');
  const { isAuthenticated, clearAuth } = useAuthStore();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const NAV = [
    { to: '/fleet',       label: t('nav.fleet'),       icon: Truck },
    { to: '/drivers',     label: t('nav.drivers'),     icon: Users },
    { to: '/loads',       label: t('nav.loads'),       icon: Package },
    { to: '/classifieds', label: t('nav.classifieds'), icon: Tag },
    { to: '/jobs',        label: t('nav.jobs'),        icon: Briefcase },
    { to: '/forum',       label: t('nav.forum'),       icon: MessageCircle },
    { to: '/directory',   label: t('nav.directory'),   icon: Building2 },
  ];

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await authApi.logout();
    } finally {
      clearAuth();
      navigate('/');
      setLoggingOut(false);
      setMobileOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-surface-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* Logo — fixed width so nav stays centered */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600">
                <Zap size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight hidden sm:block">
                {t('brand')}
              </span>
            </Link>

            {/* Desktop nav — scrollable if needed */}
            <nav className="hidden md:flex items-center gap-0.5 overflow-x-auto flex-1 justify-center">
              {NAV.map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-150 ${
                    pathname === item.to
                      ? 'bg-brand-50 text-brand-600'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-surface-hover'
                  }`}
                >
                  <item.icon size={14} />
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right side — always visible, shrink-0 so it never gets pushed off */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <LanguageToggle />

              {isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <Link
                    to="/notifications"
                    className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-surface-hover transition-colors"
                  >
                    <Bell size={18} />
                  </Link>

                  {/* Dashboard */}
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
                               text-slate-500 hover:text-slate-800 hover:bg-surface-hover transition-colors"
                  >
                    <BarChart3 size={15} />
                    {t('nav.dashboard')}
                  </Link>

                  {/* Sign Out Button ✨ NEW */}
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm
                               font-semibold text-red-500 border border-red-200 bg-red-50
                               hover:bg-red-100 hover:border-red-300 transition-all disabled:opacity-50"
                  >
                    <LogOut size={15} />
                    {loggingOut ? '...' : t('actions.signOut')}
                  </button>
                </>
              ) : (
                <>
                  {/* Login button — always visible */}
                  <Link
                    to="/login"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold
                               text-brand-600 border border-brand-200 bg-brand-50
                               hover:bg-brand-100 hover:border-brand-300 transition-all"
                  >
                    <LogIn size={15} />
                    {t('actions.signIn')}
                  </Link>

                  {/* Register button */}
                  <Link
                    to="/register"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold
                               text-white bg-brand-600 hover:bg-brand-700 transition-all shadow-sm"
                  >
                    <UserPlus size={15} />
                    {t('actions.register')}
                  </Link>
                </>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-surface-hover shrink-0"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-surface-border bg-white">
            <div className="px-4 py-3 space-y-1">
              {NAV.map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <item.icon size={18} /> {item.label}
                </Link>
              ))}

              <div className="pt-3 border-t border-surface-border space-y-2">
                <LanguageToggle />
                {isAuthenticated ? (
                  <>
                    {/* Mobile: Notifications */}
                    <Link
                      to="/notifications"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                                 text-slate-500 hover:text-slate-800 hover:bg-surface-hover"
                    >
                      <Bell size={18} /> {t('nav.notifications')}
                    </Link>

                    {/* Mobile: Dashboard */}
                    <Link
                      to="/dashboard"
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl
                                 text-sm font-semibold text-brand-600 border border-brand-200 bg-brand-50
                                 hover:bg-brand-100 transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      <BarChart3 size={16} /> {t('nav.dashboard')}
                    </Link>

                    {/* Mobile: Sign Out ✨ NEW */}
                    <button
                      onClick={() => { setMobileOpen(false); handleLogout(); }}
                      disabled={loggingOut}
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl
                                 text-sm font-semibold text-red-500 border border-red-200 bg-red-50
                                 hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      <LogOut size={16} />
                      {loggingOut ? '...' : t('actions.signOut')}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl
                                 text-sm font-semibold text-brand-600 border border-brand-200 bg-brand-50
                                 hover:bg-brand-100 transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      <LogIn size={16} /> {t('actions.signIn')}
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl
                                 text-sm font-semibold text-white bg-brand-600
                                 hover:bg-brand-700 transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      <UserPlus size={16} /> {t('actions.register')}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
};