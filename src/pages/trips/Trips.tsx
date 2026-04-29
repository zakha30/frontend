import { useState, useEffect, useCallback } from 'react';
import { Plus, Route, Search, Filter, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { listingsApi } from '../../api/listings';
import {
  PageHeader, Modal, Field, Badge, Pagination,
  EmptyState, FullPageSpinner, Spinner,
} from '../../components/common';
import type { ListingResponseDto, CreateListingDto, ListingType } from '../../types';
import { formatCurrency, formatDate, listingTypeLabel } from '../../utils';

const EMPTY: CreateListingDto = {
  title: '', type: 'FreightOffer', locationFrom: '', locationTo: '',
  price: 0, currency: 'USD', description: '',
};

const TYPE_OPTS: ListingType[] = ['FreightOffer', 'FreightRequest', 'VehicleHire'];

export default function Trips() {
  const [listings, setListings] = useState<ListingResponseDto[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<CreateListingDto>(EMPTY);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const pageSize = 10;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listingsApi.getAll({
        page, pageSize,
        ...(search && { keyword: search }),
        ...(typeFilter && { type: typeFilter }),
      });
      setListings(res.items);
      setTotal(res.totalCount);
    } finally {
      setLoading(false);
    }
  }, [page, search, typeFilter]);

  useEffect(() => { load(); }, [load]);

  const set = (k: keyof CreateListingDto) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm(f => ({ ...f, [k]: k === 'price' ? Number(e.target.value) : e.target.value }));

  const handleCreate = async () => {
    if (!form.title || !form.locationFrom || !form.locationTo) {
      toast.error('Title, origin, and destination are required'); return;
    }
    setSaving(true);
    try {
      const created = await listingsApi.create(form);
      setListings(ls => [created, ...ls]);
      setTotal(t => t + 1);
      toast.success('Listing created');
      setShowModal(false);
      setForm(EMPTY);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trips & Listings"
        subtitle={`${total} listing${total !== 1 ? 's' : ''}`}
        action={
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus size={16} />New Listing
          </button>
        }
      />

      {/* Search + filter bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            className="input pl-9"
            placeholder="Search by title, cargo, route…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
          {search && (
            <button onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
              <X size={14} />
            </button>
          )}
        </div>
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <select
            className="input pl-9 pr-8 w-48"
            value={typeFilter}
            onChange={e => { setTypeFilter(e.target.value); setPage(1); }}
          >
            <option value="">All types</option>
            {TYPE_OPTS.map(t => <option key={t} value={t}>{listingTypeLabel[t]}</option>)}
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : listings.length === 0 ? (
          <EmptyState
            icon={<Route size={48} />}
            title="No listings found"
            description="Create your first transport listing."
            action={<button onClick={() => setShowModal(true)} className="btn-primary"><Plus size={16} />New Listing</button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-border">
                  <th className="th">Title</th>
                  <th className="th">Type</th>
                  <th className="th">Route</th>
                  <th className="th">Price</th>
                  <th className="th">Status</th>
                  <th className="th">Expires</th>
                  <th className="th">Created</th>
                </tr>
              </thead>
              <tbody>
                {listings.map(l => (
                  <tr key={l.id} className="table-row">
                    <td className="td max-w-[200px]">
                      <p className="font-semibold text-white truncate">{l.title}</p>
                      {l.cargoType && <p className="text-xs text-slate-500 truncate">{l.cargoType}</p>}
                    </td>
                    <td className="td">
                      <span className="badge-blue">{listingTypeLabel[l.type] || l.typeLabel}</span>
                    </td>
                    <td className="td text-slate-400 text-xs">
                      <p className="truncate max-w-[160px]">{l.locationFrom}</p>
                      <p className="truncate max-w-[160px] text-slate-600">→ {l.locationTo}</p>
                    </td>
                    <td className="td font-mono font-semibold text-white">
                      {formatCurrency(l.price, l.currency)}
                    </td>
                    <td className="td"><Badge status={l.status} /></td>
                    <td className="td text-slate-500 text-xs">{formatDate(l.expiresAt)}</td>
                    <td className="td text-slate-500 text-xs">{formatDate(l.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {total > pageSize && (
          <div className="border-t border-surface-border px-4 py-3">
            <Pagination page={page} totalPages={Math.ceil(total / pageSize)} onChange={setPage} />
          </div>
        )}
      </div>

      {/* Create listing modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="New Listing" width="max-w-xl">
        <div className="space-y-4">
          <Field label="Title">
            <input className="input" placeholder="Cape Town to Johannesburg — Frozen Goods" value={form.title} onChange={set('title')} />
          </Field>

          <Field label="Type">
            <select className="input" value={form.type} onChange={set('type')}>
              {TYPE_OPTS.map(t => <option key={t} value={t}>{listingTypeLabel[t]}</option>)}
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Origin">
              <input className="input" placeholder="Cape Town, WC" value={form.locationFrom} onChange={set('locationFrom')} />
            </Field>
            <Field label="Destination">
              <input className="input" placeholder="Johannesburg, GP" value={form.locationTo} onChange={set('locationTo')} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Price">
              <input className="input font-mono" type="number" min={0} placeholder="0.00" value={form.price || ''} onChange={set('price')} />
            </Field>
            <Field label="Currency">
              <select className="input" value={form.currency} onChange={set('currency')}>
                {['USD', 'ZAR', 'EUR', 'GBP', 'KES', 'NGN'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Cargo Type (optional)">
            <input className="input" placeholder="Frozen goods, machinery, livestock…" value={form.cargoType ?? ''} onChange={set('cargoType')} />
          </Field>

          <Field label="Description (optional)">
            <textarea
              className="input min-h-[80px] resize-none"
              placeholder="Additional details about the load or trip…"
              value={form.description ?? ''}
              onChange={set('description')}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Available From">
              <input type="date" className="input" value={form.availableFrom ?? ''} onChange={set('availableFrom')} />
            </Field>
            <Field label="Expires At">
              <input type="date" className="input" value={form.expiresAt ?? ''} onChange={set('expiresAt')} />
            </Field>
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
            <button onClick={handleCreate} disabled={saving} className="btn-primary flex-1">
              {saving ? <Spinner size="sm" /> : null}
              {saving ? 'Creating…' : 'Create Listing'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
