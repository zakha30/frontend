import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, RefreshCw, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { listingsApi } from '../../api/listings';
import {
  PageHeader, Modal, Field, Badge, Pagination,
  EmptyState, FullPageSpinner, Spinner,
} from '../../components/common';
import type { ListingResponseDto, CreateListingDto } from '../../types';
import { formatDate, formatCurrency } from '../../utils';

const EMPTY: CreateListingDto = {
  title: '',
  description: '',
  type: 'FreightOffer',
  locationFrom: '',
  locationTo: '',
  price: 0,
  weightKg: 0,
  cargoType: '',
  availableFrom: new Date().toISOString(),
};

export default function Listings() {
  const [listings, setListings] = useState<ListingResponseDto[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<ListingResponseDto | null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState<CreateListingDto>(EMPTY);

  const pageSize = 10;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listingsApi.getAll({ page, pageSize });
      setListings(res.items);
      setTotal(res.totalCount);
    } catch (err) {
      toast.error('Failed to load listings');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setShowModal(true);
  };

  const openEdit = (listing: ListingResponseDto) => {
    setEditing(listing);
    setForm({
      title: listing.title,
      description: listing.description || '',
      type: listing.type,
      locationFrom: listing.locationFrom,
      locationTo: listing.locationTo,
      price: listing.price,
      currency: listing.currency,
      weightKg: listing.weightKg,
      volumeM3: listing.volumeM3,
      cargoType: listing.cargoType,
      availableFrom: listing.availableFrom,
      expiresAt: listing.expiresAt,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.locationFrom || !form.locationTo) {
      toast.error('Title and locations are required');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await listingsApi.update(editing.id, form);
        toast.success('Listing updated');
      } else {
        await listingsApi.create(form);
        toast.success('Listing created');
      }
      setShowModal(false);
      load();
    } catch (err) {
      toast.error('Failed to save listing');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this listing?')) return;
    try {
      await listingsApi.update(id, { title: editing?.title || '', status: 'Cancelled' });
      toast.success('Listing cancelled');
      load();
    } catch (err) {
      toast.error('Failed to delete listing');
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) {
      load();
      return;
    }
    setLoading(true);
    try {
      const res = await listingsApi.search({ keyword: search, page: 1, pageSize });
      setListings(res.items);
      setTotal(res.totalCount);
      setPage(1);
    } catch (err) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading && listings.length === 0) return <FullPageSpinner />;

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Listings"
        subtitle="Manage your transport listings"
        action={
          <button onClick={openCreate} className="btn-primary">
            <Plus size={18} />
            New Listing
          </button>
        }
      />

      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            type="text"
            className="input pl-9"
            placeholder="Search listings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <button onClick={handleSearch} className="btn-secondary">
          <Search size={18} />
          Search
        </button>
      </div>

      {/* Listings Table */}
      {listings.length === 0 ? (
        <EmptyState
          title="No listings yet"
          description="Create your first transport listing to get started"
          action={<button onClick={openCreate} className="btn-primary"><Plus size={18} />Create Listing</button>}
        />
      ) : (
        <>
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-border">
                  <th className="th">Route</th>
                  <th className="th">Type</th>
                  <th className="th">Budget</th>
                  <th className="th">Status</th>
                  <th className="th">Created</th>
                  <th className="th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing) => (
                  <tr key={listing.id} className="table-row">
                    <td className="td">
                      <div>
                        <p className="font-semibold text-white">{listing.title}</p>
                        <p className="text-xs text-slate-500">{listing.locationFrom} → {listing.locationTo}</p>
                      </div>
                    </td>
                    <td className="td">{listing.cargoType}</td>
                    <td className="td font-semibold text-brand-400">{formatCurrency(listing.price, listing.currency)}</td>
                    <td className="td"><Badge status={listing.status} /></td>
                    <td className="td text-xs text-slate-400">{formatDate(listing.createdAt)}</td>
                    <td className="td">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(listing)}
                          className="p-1.5 text-slate-400 hover:text-brand-400 transition-colors"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(listing.id)}
                          className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={setPage}
          />
        </>
      )}

      {/* Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? 'Edit Listing' : 'New Listing'}
        width="max-w-2xl"
      >
        <div className="space-y-4">
          <Field label="Title">
            <input
              type="text"
              className="input"
              placeholder="e.g., Electronics shipment to Istanbul"
              value={form.title}
              onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="From">
              <input
                type="text"
                className="input"
                placeholder="Departure location"
                value={form.locationFrom}
                onChange={(e) => setForm(f => ({ ...f, locationFrom: e.target.value }))}
              />
            </Field>
            <Field label="To">
              <input
                type="text"
                className="input"
                placeholder="Destination"
                value={form.locationTo}
                onChange={(e) => setForm(f => ({ ...f, locationTo: e.target.value }))}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Listing Type">
              <select
                className="input"
                value={form.type}
                onChange={(e) => setForm(f => ({ ...f, type: e.target.value as any }))}
              >
                <option value="FreightOffer">Freight Offer</option>
                <option value="FreightRequest">Freight Request</option>
                <option value="VehicleHire">Vehicle Hire</option>
              </select>
            </Field>
            <Field label="Cargo Type">
              <input
                type="text"
                className="input"
                placeholder="e.g., Electronics, Furniture"
                value={form.cargoType}
                onChange={(e) => setForm(f => ({ ...f, cargoType: e.target.value }))}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Price (ZAR)">
              <input
                type="number"
                className="input"
                placeholder="0.00"
                value={form.price}
                onChange={(e) => setForm(f => ({ ...f, price: Number(e.target.value) }))}
              />
            </Field>
            <Field label="Weight (kg)">
              <input
                type="number"
                className="input"
                placeholder="0"
                value={form.weightKg}
                onChange={(e) => setForm(f => ({ ...f, weightKg: Number(e.target.value) }))}
              />
            </Field>
          </div>

          <div className="flex gap-2 pt-4">
            <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {saving && <Spinner size="sm" />}
              {editing ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
