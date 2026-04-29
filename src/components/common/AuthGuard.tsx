import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  // 'block'  → replaces children with a login button (for forms/modals)
  // 'hide'   → hides children completely for guests
  // 'inline' → shows children greyed out + a small lock badge on hover
  mode?: 'block' | 'hide' | 'inline';
  message?: string; // optional override message
}

export const AuthGuard = ({ children, mode = 'block', message }: AuthGuardProps) => {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation('common');
    const { canWrite } = useAuth();
  // Logged-in users always see the real content
  if (isAuthenticated) return <>{children}</>;

  const msg = message ?? t('auth.loginRequired');

  if (mode === 'hide') return null;

  if (mode === 'inline') {
    return (
      <div className="relative group cursor-not-allowed select-none">
        <div className="pointer-events-none opacity-40">{children}</div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            to="/login"
            className="flex items-center gap-1.5 bg-white border border-brand-300 text-brand-600 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-card hover:bg-brand-50 transition-colors"
          >
            <Lock size={12} /> {t('actions.signIn')}
          </Link>
        </div>
      </div>
    );
  }

  // mode === 'block' (default)
  return (
    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-500 text-sm">
      <Lock size={14} className="shrink-0 text-slate-400" />
      <span>{msg}</span>
      <Link
        to="/login"
        className="ml-auto text-sm font-semibold text-brand-600 hover:text-brand-700 whitespace-nowrap transition-colors"
      >
        {t('actions.signIn')} →
      </Link>
    </div>
  );
};