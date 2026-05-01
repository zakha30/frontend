import React from 'react';
import { X } from 'lucide-react';
import { statusColor, clx } from '../../utils';

// ── Spinner ───────────────────────────────────────────────────────────────────
export const Spinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const s = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' }[size];
  return (
    <div className={`${s} animate-spin rounded-full border-2 border-surface-border border-t-brand-500`} />
  );
};

export const FullPageSpinner = () => (
  <div className="flex h-full min-h-[300px] items-center justify-center">
    <Spinner size="lg" />
  </div>
);
export { ImageZoom } from './ImageZoom';
// ── Badge ─────────────────────────────────────────────────────────────────────
export const Badge = ({ status }: { status: string }) => (
  <span className={statusColor(status)}>{status}</span>
);

// ── Modal ─────────────────────────────────────────────────────────────────────
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
}

export const Modal = ({ open, onClose, title, children, width = 'max-w-lg' }: ModalProps) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={clx('card relative w-full animate-slide-up p-6', width)}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-surface-hover hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ── Pagination ────────────────────────────────────────────────────────────────
interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}

export const Pagination = ({ page, totalPages, onChange }: PaginationProps) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-1 pt-4">
      <button
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="btn-secondary px-3 py-1.5 text-xs disabled:opacity-40"
      >← Prev</button>
      {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={clx(
            'w-8 h-8 rounded-lg text-xs font-semibold transition-all',
            p === page
              ? 'bg-brand-600 text-white'
              : 'text-slate-400 hover:bg-surface-hover hover:text-white'
          )}
        >{p}</button>
      ))}
      <button
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className="btn-secondary px-3 py-1.5 text-xs disabled:opacity-40"
      >Next →</button>
    </div>
  );
};

// ── EmptyState ────────────────────────────────────────────────────────────────
export const EmptyState = ({ icon, title, description, action }: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    {icon && <div className="mb-4 text-slate-600">{icon}</div>}
    <p className="text-lg font-semibold text-slate-300">{title}</p>
    {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

// ── Stat Card ─────────────────────────────────────────────────────────────────
export const StatCard = ({ label, value, sub, icon, color = 'brand' }: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  color?: 'brand' | 'green' | 'amber' | 'red';
}) => {
  const bg = {
    brand: 'bg-brand-500/10 text-brand-400',
    green: 'bg-emerald-500/10 text-emerald-400',
    amber: 'bg-amber-500/10 text-amber-400',
    red:   'bg-red-500/10 text-red-400',
  }[color];

  return (
    <div className="card p-5 flex items-center gap-4 animate-fade-in">
      <div className={clx('rounded-xl p-3', bg)}>{icon}</div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mt-0.5">{label}</p>
        {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
};

// ── Page Header ───────────────────────────────────────────────────────────────
export const PageHeader = ({ title, subtitle, action }: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) => (
  <div className="mb-6 flex items-start justify-between gap-4">
    <div>
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

// ── Form Field ────────────────────────────────────────────────────────────────
export const Field = ({ label, error, children }: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div>
    <label className="label">{label}</label>
    {children}
    {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
  </div>
);
