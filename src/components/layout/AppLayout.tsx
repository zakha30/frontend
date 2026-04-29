import { Outlet, useLocation } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Sidebar } from './Sidebar';
import { LanguageToggle } from './languageToggle';
import { useAuthStore } from '../../store/authStore';

const Topbar = () => {
  const { t } = useTranslation('common');
  const { pathname } = useLocation();
  const { user } = useAuthStore();

  // Map routes to translation keys
  const TITLE_KEYS: Record<string, string> = {
    '/dashboard':     'nav.dashboard',
    '/fleet':         'nav.fleet',
    '/drivers':       'nav.drivers',
    '/trips':         'nav.trips',
    '/bookings':      'nav.bookings',
    '/reports':       'nav.reports',
    '/notifications': 'nav.notifications',
    '/loads':         'nav.loads',
    '/classifieds':   'nav.classifieds',
    '/jobs':          'nav.jobs',
    '/forum':         'nav.forum',
    '/directory':     'nav.directory',
  };

  const titleKey = TITLE_KEYS[pathname];
  const title = titleKey ? t(titleKey) : t('brand');

  return (
    <header className="flex h-16 items-center justify-between border-b border-surface-border bg-white px-6 shadow-sm">
      <div>
        <h2 className="text-base font-semibold text-slate-800">{title}</h2>
        <p className="text-xs text-slate-400 font-mono">{user?.email}</p>
      </div>
      <div className="flex items-center gap-3">
        <LanguageToggle />
        <button className="flex items-center gap-2 rounded-xl border border-surface-border bg-surface px-3 py-2 text-sm text-slate-500 hover:border-brand-400 hover:text-slate-700 transition-all">
          <Search size={14} />
          <span className="hidden sm:block">{t('actions.search')}</span>
          <kbd className="hidden sm:block rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono text-slate-400">⌘K</kbd>
        </button>
        <button className="relative rounded-xl border border-surface-border bg-surface p-2 text-slate-500 hover:border-brand-400 hover:text-slate-700 transition-all">
          <Bell size={17} />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-brand-500 ring-2 ring-white" />
        </button>
      </div>
    </header>
  );
};

export const AppLayout = () => (
  <div className="flex min-h-screen">
    <Sidebar />
    <div className="flex flex-1 flex-col pl-60 content-with-sidebar">
      <Topbar />
      <main className="flex-1 overflow-y-auto p-6 animate-fade-in">
        <Outlet />
      </main>
    </div>
  </div>
);
