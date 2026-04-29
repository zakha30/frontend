import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader, Modal, EmptyState } from '@components/common';
import { jobsApi } from '@api/jobs';
import type { JobResponseDto, CreateJobDto } from '@types';

export default function Jobs() {
  const { t } = useTranslation('jobs');

  const [tab, setTab] = useState<'seeking' | 'offering'>('seeking');
  const [items, setItems] = useState<JobResponseDto[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateJobDto>({ Title: '', Description: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { load(); }, [tab]);

  async function load() {
    setLoading(true);
    try {
      const res = await jobsApi.getAll({});
      setItems(Array.isArray(res) ? res : res.items || []);
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
          <button className="btn-primary" onClick={() => setOpen(true)}>
            {t('postJob')}
          </button>
        }
      />

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            tab === 'seeking'
              ? 'bg-brand-600/20 text-brand-400 border border-brand-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          onClick={() => setTab('seeking')}
        >
          {t('tabs.seeking')}
        </button>
        <button
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            tab === 'offering'
              ? 'bg-brand-600/20 text-brand-400 border border-brand-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          onClick={() => setTab('offering')}
        >
          {t('tabs.offering')}
        </button>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="text-slate-400 text-sm">{t('common:status.loading')}</div>
        ) : items.length === 0 ? (
          <EmptyState title={t('empty.title')} description={t('empty.description')} />
        ) : (
          items.map(j => (
            <div key={j.id} className="card p-4">
              <div className="font-bold text-white">{j.adTitle}</div>
              <div className="text-sm text-slate-400">{j.province}</div>
              <div className="mt-2 text-sm text-slate-300">{j.description}</div>
            </div>
          ))
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={t('postJob')}>
        <div className="space-y-3">
          <label className="block text-sm text-slate-300">{t('fields.title')}</label>
          <input
            className="input"
            value={form.Title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForm((f: CreateJobDto) => ({ ...f, Title: e.target.value }))
            }
          />
          <label className="block text-sm text-slate-300">{t('fields.description')}</label>
          <textarea
            className="input"
            rows={4}
            value={form.Description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setForm((f: CreateJobDto) => ({ ...f, Description: e.target.value }))
            }
          />
          <div className="flex justify-end gap-2">
            <button className="btn-secondary" onClick={() => setOpen(false)}>
              {t('common:actions.cancel')}
            </button>
            <button className="btn-primary">
              {t('common:actions.submit')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
