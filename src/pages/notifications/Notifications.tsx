import { useEffect, useState } from 'react';
import { Bell, BellOff, Check, CheckCheck } from 'lucide-react';
import { notificationsApi } from '../../api/vehicles';
import { PageHeader, FullPageSpinner, EmptyState } from '../../components/common';
import { formatDateTime } from '../../utils';
import type { NotificationDto } from '../../types';
import toast from 'react-hot-toast';

export default function Notifications() {
  const [items, setItems] = useState<NotificationDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notificationsApi.getAll().then(setItems).finally(() => setLoading(false));
  }, []);

  const markRead = async (id: string) => {
    try {
      await notificationsApi.markRead(id);
      setItems(ns => ns.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch {}
  };

  const markAll = async () => {
    try {
      await notificationsApi.markAllRead();
      setItems(ns => ns.map(n => ({ ...n, isRead: true })));
      toast.success('All marked as read');
    } catch {}
  };

  const unread = items.filter(n => !n.isRead).length;

  if (loading) return <FullPageSpinner />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        subtitle={unread > 0 ? `${unread} unread message${unread !== 1 ? 's' : ''}` : 'All caught up'}
        action={
          unread > 0 ? (
            <button onClick={markAll} className="btn-secondary text-sm">
              <CheckCheck size={15} />Mark all read
            </button>
          ) : undefined
        }
      />

      <div className="card overflow-hidden">
        {items.length === 0 ? (
          <EmptyState
            icon={<BellOff size={48} />}
            title="No notifications"
            description="You're all caught up! New activity will appear here."
          />
        ) : (
          <div className="divide-y divide-surface-border">
            {items.map(n => (
              <div
                key={n.id}
                className={`flex gap-4 px-5 py-4 transition-colors ${
                  !n.isRead ? 'bg-brand-600/5' : 'hover:bg-surface-hover'
                }`}
              >
                <div className={`mt-0.5 shrink-0 rounded-full p-2 ${
                  !n.isRead ? 'bg-brand-600/20 text-brand-400' : 'bg-surface-border text-slate-500'
                }`}>
                  <Bell size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className={`text-sm font-semibold ${!n.isRead ? 'text-white' : 'text-slate-300'}`}>
                        {n.title}
                        {!n.isRead && (
                          <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-brand-500 align-middle" />
                        )}
                      </p>
                      <p className="text-sm text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-2">
                      <span className="text-xs text-slate-500 whitespace-nowrap">{formatDateTime(n.createdAt)}</span>
                      {!n.isRead && (
                        <button
                          onClick={() => markRead(n.id)}
                          className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 transition-colors"
                        >
                          <Check size={12} />Mark read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
