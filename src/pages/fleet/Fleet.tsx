import { useState, useEffect, useCallback } from 'react';
import { Plus, Truck, Pencil, RefreshCw, Lock, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { vehiclesApi } from '../../api/vehicles';
import {
  PageHeader, Modal, Field, Badge, Pagination,
  EmptyState, Spinner,
} from '../../components/common';
import { AuthGuard } from '../../components/common/AuthGuard';
import { useAuth } from '../../hooks/useAuth';
import type {
  VehicleResponseDto, CreateVehicleDto, VehicleCategory, VehicleStatus,
} from '../../types';

// ── Constants ─────────────────────────────────────────────────────────────────
const VEHICLE_CATEGORIES: VehicleCategory[] = ['Truck', 'Trailer', 'LCV', 'Bus', 'Other'];
const VEHICLE_STATUSES:   VehicleStatus[]   = ['Available', 'OnTrip', 'Maintenance', 'Inactive'];
const TRUCK_TYPES = ['Flatdeck', 'Tautliner', 'Curtainsider', 'Reefer', 'Tipper', 'Tanker', 'Lowbed', 'Crane', 'Other'];
const CURRENCIES  = ['ZAR', 'USD', 'EUR', 'GBP', 'BWP', 'ZMW', 'KES', 'NGN'];
const SA_PROVINCES = [
  'Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape',
  'Limpopo', 'Mpumalanga', 'North West', 'Free State', 'Northern Cape',
];

const EMPTY_FORM: CreateVehicleDto = {
  registrationNumber:   '',
  make:                 '',
  model:                '',
  year:                 new Date().getFullYear(),
  status:               'Available',
  Category:             'Truck',
  truckType:            '',
  trailerType:          '',
  payloadTons:          0,
  province:             '',
  city:                 '',
  isCrossBorderCapable: false,
  contactEmail:         '',
  contactPhone:         '',
  dailyRate:            undefined,
  currency:             'ZAR',
  description:          '',
  imageUrl:             '',
  membershipTier:       'Free',
  postedByUserId:       '',
};

// ── Backend base URL for image display ───────────────────────────────────────
const API_BASE = 'https://localhost:7089';

export default function Fleet() {
  const { t } = useTranslation('fleet');
  const { canWrite, user } = useAuth();

  const [vehicles,      setVehicles]      = useState<VehicleResponseDto[]>([]);
  const [total,         setTotal]         = useState(0);
  const [page,          setPage]          = useState(1);
  const [loading,       setLoading]       = useState(true);
  const [saving,        setSaving]        = useState(false);
  const [showModal,     setShowModal]     = useState(false);
  const [editing,       setEditing]       = useState<VehicleResponseDto | null>(null);
  const [form,          setForm]          = useState<CreateVehicleDto>(EMPTY_FORM);
  const [imageFile,     setImageFile]     = useState<File | null>(null);       // ← inside component
  const [imagePreview,  setImagePreview]  = useState<string | null>(null);     // ← inside component

  const pageSize = 10;

  // ── Load ──────────────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await vehiclesApi.getAll({ page, pageSize });
      setVehicles(Array.isArray(res?.items) ? res.items : []);
      setTotal(res?.totalCount ?? 0);
    } catch {
      setVehicles([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  // ── Modal helpers ─────────────────────────────────────────────────────────
  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM, postedByUserId: user?.id ?? '' });
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const openEdit = (v: VehicleResponseDto) => {
    setEditing(v);
    setForm({
      registrationNumber:   v.registrationNumber,
      make:                 v.make,
      model:                v.model,
      year:                 v.year,
      status:               v.status,
      Category:             v.Category,
      truckType:            v.truckType            ?? '',
      trailerType:          v.trailerType          ?? '',
      payloadTons:          v.payloadTons,
      province:             v.province,
      city:                 v.city                 ?? '',
      isCrossBorderCapable: v.isCrossBorderCapable,
      contactEmail:         v.contactEmail,
      contactPhone:         v.contactPhone         ?? '',
      dailyRate:            v.dailyRate,
      currency:             v.currency,
      description:          v.description          ?? '',
      imageUrl:             v.imageUrl             ?? '',
      membershipTier:       v.membershipTier,
      postedByUserId:       v.postedByUserId,
    });
    setImageFile(null);
    setImagePreview(
      v.imageUrl
        ? v.imageUrl.startsWith('http')
          ? v.imageUrl
          : `${API_BASE}${v.imageUrl}`   // prepend base URL for relative paths
        : null
    );
    setShowModal(true);
  };

  // ── Image handler ─────────────────────────────────────────────────────────
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.registrationNumber || !form.make || !form.model || !form.contactEmail) {
      toast.error('Registration, make, model and contact email are required.');
      return;
    }
    setSaving(true);
    try {
      let uploadedImageUrl: string | undefined = form.imageUrl?.trim() || undefined;

      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        const uploadRes = await vehiclesApi.uploadImage(formData);
        uploadedImageUrl = uploadRes.url;
      }

      const payload: CreateVehicleDto = {     // ← inside handleSave
        ...form,
        imageUrl:     uploadedImageUrl            || undefined,
        description:  form.description?.trim()   || undefined,
        trailerType:  form.trailerType?.trim()    || undefined,
        contactPhone: form.contactPhone?.trim()   || undefined,
        city:         form.city?.trim()           || undefined,
      };

      if (editing) {
        const updated = await vehiclesApi.update(editing.id, payload);
        setVehicles(vs => vs.map(v => v.id === updated.id ? updated : v));
        toast.success('Vehicle updated.');
      } else {
        const created = await vehiclesApi.create(payload);
        setVehicles(vs => [created, ...vs]);
        setTotal(n => n + 1);
        toast.success('Vehicle added.');
      }

      setImageFile(null);
      setImagePreview(null);
      setShowModal(false);
    } catch {
      // error toast handled by axios interceptor
    } finally {
      setSaving(false);
    }
  };

  // ── Field helpers ─────────────────────────────────────────────────────────
  const setStr = (k: keyof CreateVehicleDto) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  const setNum = (k: keyof CreateVehicleDto) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(f => ({ ...f, [k]: Number(e.target.value) }));

  const setBool = (k: keyof CreateVehicleDto) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(f => ({ ...f, [k]: e.target.checked }));

  // ── Image URL helper ──────────────────────────────────────────────────────
  const getImageSrc = (url?: string | null) => {
    if (!url) return null;
    return url.startsWith('http') ? url : `${API_BASE}${url}`;
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        action={
          <div className="flex gap-2">
            <button onClick={load} className="btn-secondary p-2.5">
              <RefreshCw size={15} />
            </button>
            <AuthGuard mode="inline">
              <button onClick={openCreate} className="btn-primary">
                <Plus size={16} />{t('addVehicle')}
              </button>
            </AuthGuard>
          </div>
        }
      />

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : vehicles.length === 0 ? (
          <EmptyState
            icon={<Truck size={48} />}
            title={t('empty.title')}
            description={t('empty.description')}
            action={
              canWrite ? (
                <button onClick={openCreate} className="btn-primary">
                  <Plus size={16} />{t('addVehicle')}
                </button>
              ) : undefined
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-border bg-surface">
                  <th className="th w-16">Photo</th>       {/* ← NEW column */}
                  <th className="th">{t('fields.regNumber')}</th>
                  <th className="th">{t('fields.make')} / {t('fields.model')}</th>
                  <th className="th">{t('fields.year')}</th>
                  <th className="th">Category</th>
                  <th className="th">Truck Type</th>
                  <th className="th">Payload (t)</th>
                  <th className="th">Province</th>
                  <th className="th">Daily Rate</th>
                  <th className="th">{t('fields.status')}</th>
                  <th className="th w-16">{t('common:actions.edit')}</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map(v => (
                  <tr key={v.id} className="table-row">

                    {/* ── Photo cell ── NEW */}
                    <td className="td">
                      {getImageSrc(v.imageUrl) ? (
                        <img
                          src={getImageSrc(v.imageUrl)!}
                          alt={`${v.make} ${v.model}`}
                          className="h-10 w-14 rounded-lg object-cover border border-surface-border"
                        />
                      ) : (
                        <div className="h-10 w-14 rounded-lg bg-slate-100 border border-surface-border flex items-center justify-center">
                          <Truck size={16} className="text-slate-300" />
                        </div>
                      )}
                    </td>

                    <td className="td">
                      <span className="font-mono font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg text-xs">
                        {v.registrationNumber}
                      </span>
                    </td>
                    <td className="td">
                      <span className="font-semibold text-slate-800">{v.make}</span>
                      <span className="text-slate-400"> {v.model}</span>
                    </td>
                    <td className="td text-slate-500 font-mono">{v.year}</td>
                    <td className="td text-slate-500">{v.Category}</td>
                    <td className="td text-slate-500">{v.truckType ?? '—'}</td>
                    <td className="td text-slate-500">{v.payloadTons}</td>
                    <td className="td text-slate-500">{v.province}</td>
                    <td className="td text-slate-500">
                      {v.dailyRate ? `${v.currency} ${v.dailyRate.toLocaleString()}` : '—'}
                    </td>
                    <td className="td"><Badge status={v.status} /></td>
                    <td className="td">
                      {canWrite ? (
                        <button
                          onClick={() => openEdit(v)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-surface-hover hover:text-brand-600 transition-colors"
                        >
                          <Pencil size={14} />
                        </button>
                      ) : (
                        <Lock size={14} className="text-slate-300" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {total > pageSize && (
          <div className="border-t border-surface-border px-4 py-3">
            <Pagination
              page={page}
              totalPages={Math.ceil(total / pageSize)}
              onChange={setPage}
            />
          </div>
        )}
      </div>

      {/* ── Modal ─────────────────────────────────────────────────────────── */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? t('modal.editTitle') : t('modal.addTitle')}
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">

          <div className="grid grid-cols-2 gap-3">
            <Field label={t('fields.regNumber')}  error='required'>
              <input className="input font-mono uppercase" placeholder="ABC 123 GP"
                value={form.registrationNumber} onChange={setStr('registrationNumber')} />
            </Field>
            <Field label={t('fields.year')}  error='required'>
              <input className="input font-mono" type="number" min={1980} max={2100}
                value={form.year} onChange={setNum('year')} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label={t('fields.make')}  error='required'>
              <input className="input" placeholder="Toyota"
                value={form.make} onChange={setStr('make')} />
            </Field>
            <Field label={t('fields.model')}  error='required'>
              <input className="input" placeholder="Hilux"
                value={form.model} onChange={setStr('model')} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Category"  error='required'>
              <select className="input" value={form.Category} onChange={setStr('Category')}>
                {VEHICLE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Truck Type"  error='required'>
              <select className="input" value={form.truckType} onChange={setStr('truckType')}>
                <option value="">Select type</option>
                {TRUCK_TYPES.map(tt => <option key={tt}>{tt}</option>)}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Trailer Type">
              <input className="input" placeholder="e.g. Flatbed"
                value={form.trailerType ?? ''} onChange={setStr('trailerType')} />
            </Field>
            <Field label="Payload (tons)"  error='required'>
              <input className="input" type="number" min={0} step={0.5}
                value={form.payloadTons} onChange={setNum('payloadTons')} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Province"  error='required'>
              <select className="input" value={form.province} onChange={setStr('province')}>
                <option value="">Select province</option>
                {SA_PROVINCES.map(p => <option key={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="City">
              <input className="input" placeholder="Johannesburg"
                value={form.city ?? ''} onChange={setStr('city')} />
            </Field>
          </div>

          <div className="flex items-center gap-3 py-1">
            <input
              id="crossborder"
              type="checkbox"
              className="h-4 w-4 rounded border-surface-border text-brand-600"
              checked={form.isCrossBorderCapable}
              onChange={setBool('isCrossBorderCapable')}
            />
            <label htmlFor="crossborder" className="text-sm font-medium text-slate-700">
              Cross-border capable
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Contact Email" error='required'>
              <input className="input" type="email" placeholder="owner@company.com"
                value={form.contactEmail} onChange={setStr('contactEmail')} />
            </Field>
            <Field label="Contact Phone">
              <input className="input" type="tel" placeholder="+27 82 000 0000"
                value={form.contactPhone ?? ''} onChange={setStr('contactPhone')} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Daily Rate">
              <input className="input" type="number" min={0} placeholder="0"
                value={form.dailyRate ?? ''} onChange={setNum('dailyRate')} />
            </Field>
            <Field label="Currency">
              <select className="input" value={form.currency} onChange={setStr('currency')}>
                {CURRENCIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label={t('fields.status')}>
              <select className="input" value={form.status} onChange={setStr('status')}>
                {VEHICLE_STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Membership Tier">
              <select className="input" value={form.membershipTier}
                onChange={setStr('membershipTier')}>
                {['Free', 'Basic', 'Premium', 'Enterprise'].map(m =>
                  <option key={m}>{m}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Description">
            <textarea className="input" rows={3} placeholder="Additional details..."
              value={form.description ?? ''} onChange={setStr('description')} />
          </Field>

          {/* Image Upload */}
          <Field label="Vehicle Image">
            <div className="space-y-2">
              {imagePreview ? (
                <div className="relative w-full h-40 rounded-xl overflow-hidden border border-surface-border bg-slate-50">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => { setImagePreview(null); setImageFile(null); }}
                    className="absolute top-2 right-2 p-1 rounded-full bg-white/90 text-red-500 hover:bg-red-50 border border-red-200 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="vehicle-image"
                  className="flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-surface-border bg-slate-50 hover:bg-slate-100 hover:border-brand-400 transition-all cursor-pointer"
                >
                  <Upload size={24} className="text-slate-400 mb-2" />
                  <span className="text-sm font-medium text-slate-500">Click to upload image</span>
                  <span className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP up to 5MB</span>
                  <input
                    id="vehicle-image"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          </Field>

          <div className="flex gap-3 pt-2 border-t border-surface-border">
            <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">
              {t('common:actions.cancel')}
            </button>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
              {saving && <Spinner size="sm" />}
              {saving
                ? t('common:status.loading')
                : editing
                  ? t('common:actions.save')
                  : t('addVehicle')}
            </button>
          </div>

        </div>
      </Modal>
    </div>
  );
}