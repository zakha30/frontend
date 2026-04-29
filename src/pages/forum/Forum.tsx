import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader, Modal, EmptyState } from '@components/common';
import { AuthGuard } from '@components/common/AuthGuard';
import { forumApi } from '@api/forum';
import { useAuth } from '@hooks/useAuth';
import type { ThreadResponseDto, CreateThreadDto } from '@types';

export default function Forum() {
  const { t } = useTranslation('forum');
  const { canWrite } = useAuth();

  const [threads, setThreads] = useState<ThreadResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen]       = useState(false);
  const [form, setForm]       = useState<CreateThreadDto>({
    Title: '', Content: '', Category: '',
  });

  useEffect(() => { loadThreads(); }, []);

  async function loadThreads() {
    setLoading(true);
    try {
      const res = await forumApi.getAll({ page: 1, pageSize: 20 });
      console.log('Forum response:', res);
      setThreads(
        Array.isArray(res?.items) ? res.items :
        Array.isArray(res)        ? res       : []
      );
    } catch (err) {
      console.error('Forum error:', err);
      setThreads([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        action={
          <AuthGuard mode="inline" message={t('common:auth.loginToPost')}>
            <button className="btn-primary" onClick={() => setOpen(true)}>
              {t('newTopic')}
            </button>
          </AuthGuard>
        }
      />

      <div className="card p-3">
        {loading ? (
          <div className="text-slate-400 text-sm p-4">
            {t('common:status.loading')}
          </div>
        ) : threads.length === 0 ? (
          <EmptyState
            title={t('empty.title')}
            description={t('empty.description')}
            action={
              canWrite ? (
                <button className="btn-primary" onClick={() => setOpen(true)}>
                  {t('newTopic')}
                </button>
              ) : undefined
            }
          />
        ) : (
          <ul className="divide-y divide-surface-border">
            {threads.map(thread => (
              <li
                key={thread.id}
                className="p-3 hover:bg-surface-hover transition-colors cursor-pointer"
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <div className="font-semibold text-slate-900">
                      {thread.title}
                    </div>
                    <div className="text-sm text-slate-400 mt-0.5 line-clamp-1">
                      {thread.content}
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 whitespace-nowrap shrink-0">
                    {new Date(thread.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={t('newTopic')}>
        <div className="space-y-3">
          <label className="label">{t('fields.title')}</label>
          <input
            className="input"
            value={form.Title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForm(f => ({ ...f, Title: e.target.value }))
            }
          />
          <label className="label">{t('fields.content')}</label>
          <textarea
            className="input"
            rows={4}
            value={form.Content}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setForm(f => ({ ...f, Content: e.target.value }))
            }
          />
          <div className="flex justify-end gap-2">
            <button className="btn-secondary" onClick={() => setOpen(false)}>
              {t('common:actions.cancel')}
            </button>
            <AuthGuard mode="block" message={t('common:auth.loginToPost')}>
              <button className="btn-primary w-full">
                {t('common:actions.submit')}
              </button>
            </AuthGuard>
          </div>
        </div>
      </Modal>
    </div>
  );
}