import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader, Modal, EmptyState } from '@components/common';
import { classifiedsApi } from '@api/classifieds';
import type { ClassifiedResponseDto, CreateClassifiedDto, ClassifiedCategory } from '@types';

export default function Classifieds() {
  const { t } = useTranslation('classifieds');

  const [tab, setTab] = useState<string>('all');
  const [items, setItems] = useState<ClassifiedResponseDto[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateClassifiedDto>({
    title: '', description: '', category: 'Other', adType: 'Offering',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => { load(); }, [tab]);

  async function load() {
  setLoading(true);
  try {
    const res = await classifiedsApi.getAll({ page: 1, pageSize: 20 });
    console.log('Classifieds API response:', res);
    setItems(Array.isArray(res?.items) ? res.items : Array.isArray(res) ? res : []);
  } catch (err) {
    console.error('Classifieds load error:', err);
    setItems([]);
  } finally {
    setLoading(false);
  }
}

  const TABS = [
    { value: 'all',      label: t('tabs.all') },
    { value: 'jobs',     label: t('tabs.jobs') },
    { value: 'services', label: t('tabs.services') },
  ];

  return (
    <div className="p-6">
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        action={
          <button className="btn-primary" onClick={() => setOpen(true)}>
            {t('postAd')}
          </button>
        }
      />

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {TABS.map(tb => (
          <button
            key={tb.value}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              tab === tb.value
                ? 'bg-brand-600/20 text-brand-400 border border-brand-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            onClick={() => setTab(tb.value)}
          >
            {tb.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="text-slate-400 text-sm col-span-3">{t('common:status.loading')}</div>
        ) : items.length === 0 ? (
          <div className="col-span-3">
            <EmptyState title={t('empty.title')} description={t('empty.description')} />
          </div>
        ) : (
          items.map(c => (
            <div key={c.id} className="card p-4">
              <div className="font-bold text-white">{c.title}</div>
              <div className="text-sm text-slate-400">{c.category} • {c.province}</div>
              <div className="mt-2 text-sm text-slate-300">{c.description}</div>
              <div className="mt-2 font-semibold text-white">
                {c.price ? `${c.currency} ${c.price}` : t('priceOnRequest')}
              </div>
            </div>
          ))
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={t('postAd')}>
        <div className="space-y-3">
          <label className="block text-sm text-slate-300">{t('fields.title')}</label>
          <input
            className="input"
            value={form.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForm((f: CreateClassifiedDto) => ({ ...f, title: e.target.value }))
            }
          />
          <label className="block text-sm text-slate-300">{t('fields.description')}</label>
          <textarea
            className="input"
            rows={4}
            value={form.description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setForm((f: CreateClassifiedDto) => ({ ...f, description: e.target.value }))
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
