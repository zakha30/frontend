import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Truck, Users, Route, FileText,
  BarChart3, Bell, LogOut, ChevronRight, Zap, Loader2, Package, MessageSquare,
  Building2, Tag, Briefcase, MessageCircle,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../api/auth';
import { clx } from '../../utils';

export const Sidebar = () => {
  const { t } = useTranslation('common');
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  // NAV is defined INSIDE the component so it re-evaluates on every language change
  const NAV = [
    { to: '/dashboard',     label: t('nav.dashboard'),     icon: LayoutDashboard },
    { to: '/fleet',         label: t('nav.fleet'),         icon: Truck },
    { to: '/drivers',       label: t('nav.drivers'),       icon: Users },
    { to: '/trips',         label: t('nav.trips'),         icon: Route },
    { to: '/bookings',      label: t('nav.bookings'),      icon: FileText },
    { to: '/reports',       label: t('nav.reports'),       icon: BarChart3 },
    { to: '/notifications', label: t('nav.notifications'), icon: Bell },
    { to: '/loads',         label: t('nav.loads'),         icon: Package },
    { to: '/quotes-board',  label: 'Quote Requests',       icon: MessageSquare },
    { to: '/hire',          label: 'Fleet Hire',           icon: Truck },
    { to: '/directory',     label: t('nav.directory'),     icon: Building2 },
    { to: '/classifieds',   label: t('nav.classifieds'),   icon: Tag },
    { to: '/jobs',          label: t('nav.jobs'),          icon: Briefcase },
    { to: '/forum',         label: t('nav.forum'),         icon: MessageCircle },
  ];

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await authApi.logout();
    } finally {
      clearAuth();
      navigate('/');
      setLoggingOut(false);
    }
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-surface-border bg-white sidebar-fixed">
      <div className="flex h-16 items-center gap-2.5 px-5 border-b border-surface-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 shadow-glow">
          <Zap size={16} className="text-white" />
        </div>
        <span className="text-lg font-bold text-slate-900 tracking-tight">{t('brand')}</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => clx(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 group',
              isActive
                ? 'bg-brand-50 text-brand-700 border border-brand-200'
                : 'text-slate-500 hover:bg-surface-hover hover:text-slate-800'
            )}
          >
            {({ isActive }) => (
              <>
                <Icon size={17} className={isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={14} className="text-brand-500 flip-rtl" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-surface-border p-3">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 mb-1">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
            {user?.fullName?.slice(0, 2).toUpperCase() ?? 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-800">{user?.fullName}</p>
            <p className="truncate text-xs text-slate-400">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50"
        >
          {loggingOut ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
          {loggingOut ? t('status.loading') : t('actions.signOut')}
        </button>
      </div>
    </aside>
  );
};
