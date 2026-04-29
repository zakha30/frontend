import { useState } from 'react';
import { Plus, Users, Phone, Mail, MapPin, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageHeader, Modal, Field, Badge, EmptyState } from '../../components/common';

interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  status: 'Active' | 'Inactive' | 'OnTrip';
  rating: number;
  tripsCompleted: number;
  location: string;
}

const DEMO_DRIVERS: Driver[] = [
  { id: '1', name: 'James Mokoena', email: 'james.m@fleet.co', phone: '+27 82 123 4567', licenseNumber: 'DL-2019-004521', status: 'OnTrip', rating: 4.8, tripsCompleted: 312, location: 'Johannesburg, GP' },
  { id: '2', name: 'Sipho Dlamini', email: 'sipho.d@fleet.co', phone: '+27 71 987 6543', licenseNumber: 'DL-2020-007811', status: 'Active', rating: 4.6, tripsCompleted: 187, location: 'Cape Town, WC' },
  { id: '3', name: 'Themba Nkosi', email: 'themba.n@fleet.co', phone: '+27 60 555 1234', licenseNumber: 'DL-2021-002390', status: 'Active', rating: 4.9, tripsCompleted: 95, location: 'Durban, KZN' },
  { id: '4', name: 'Lerato Molefe', email: 'lerato.m@fleet.co', phone: '+27 83 444 5678', licenseNumber: 'DL-2018-009123', status: 'Inactive', rating: 4.2, tripsCompleted: 456, location: 'Pretoria, GP' },
];

const EMPTY_FORM = { name: '', email: '', phone: '', licenseNumber: '', location: '' };

type FilterType = 'All' | 'Active' | 'OnTrip' | 'Inactive';

export default function Drivers() {
  const { t } = useTranslation('drivers');

  const [drivers] = useState<Driver[]>(DEMO_DRIVERS);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [filter, setFilter] = useState<FilterType>('All');

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const filtered = drivers.filter(d => filter === 'All' || d.status === filter);

  // Map filter values to translation keys
  const FILTERS: { value: FilterType; label: string }[] = [
    { value: 'All',      label: t('filterAll') },
    { value: 'Active',   label: t('filterActive') },
    { value: 'OnTrip',   label: t('filterOnTrip') },
    { value: 'Inactive', label: t('filterInactive') },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle', { count: drivers.length })}
        action={
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus size={16} />{t('inviteDriver')}
          </button>
        }
      />

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-all ${
              filter === f.value
                ? 'bg-brand-600/20 text-brand-400 border border-brand-600/30'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {f.label}
            <span className="ml-1.5 text-xs opacity-60">
              {f.value === 'All' ? drivers.length : drivers.filter(d => d.status === f.value).length}
            </span>
          </button>
        ))}
      </div>

      {/* Driver cards */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users size={48} />}
          title={t('empty.title')}
          action={<button onClick={() => setShowModal(true)} className="btn-primary"><Plus size={16} />{t('inviteDriver')}</button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(d => (
            <div key={d.id} className="card p-5 hover:border-brand-700/50 transition-colors cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-900/60 border border-brand-700/40 text-brand-300 font-bold text-sm">
                    {d.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-semibold text-white group-hover:text-brand-300 transition-colors">{d.name}</p>
                    <p className="text-xs text-slate-500 font-mono">{d.licenseNumber}</p>
                  </div>
                </div>
                <Badge status={d.status === 'OnTrip' ? 'Active' : d.status} />
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-400">
                  <Mail size={13} className="shrink-0 text-slate-600" />
                  <span className="truncate">{d.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Phone size={13} className="shrink-0 text-slate-600" />
                  <span>{d.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin size={13} className="shrink-0 text-slate-600" />
                  <span>{d.location}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-surface-border flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-amber-400">
                  <Star size={13} fill="currentColor" />
                  <span className="text-sm font-semibold">{d.rating}</span>
                </div>
                <div className="text-xs text-slate-500">
                  <span className="font-semibold text-slate-300">{d.tripsCompleted}</span> {t('fields.trips')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title={t('modal.addTitle')}>
        <div className="space-y-4">
          <Field label={t('fields.name')}>
            <input className="input" placeholder="James Mokoena" value={form.name} onChange={set('name')} />
          </Field>
          <Field label={t('fields.email')}>
            <input type="email" className="input" placeholder="driver@company.com" value={form.email} onChange={set('email')} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t('fields.phone')}>
              <input className="input" placeholder="+27 82 000 0000" value={form.phone} onChange={set('phone')} />
            </Field>
            <Field label={t('fields.licenseNumber')}>
              <input className="input font-mono" placeholder="DL-2024-XXXXX" value={form.licenseNumber} onChange={set('licenseNumber')} />
            </Field>
          </div>
          <Field label={t('fields.location')}>
            <input className="input" placeholder="Johannesburg, GP" value={form.location} onChange={set('location')} />
          </Field>
          <div className="flex gap-3 pt-1">
            <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">{t('common:actions.cancel')}</button>
            <button className="btn-primary flex-1">{t('inviteDriver')}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
