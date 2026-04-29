import { format, parseISO } from 'date-fns';

export const formatDate = (iso?: string | null) => {
  if (!iso) return '—';
  try { return format(parseISO(iso), 'dd MMM yyyy'); } catch { return iso; }
};

export const formatDateTime = (iso?: string | null) => {
  if (!iso) return '—';
  try { return format(parseISO(iso), 'dd MMM yyyy, HH:mm'); } catch { return iso; }
};

export const formatCurrency = (amount: number, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency, minimumFractionDigits: 0,
  }).format(amount);
};

export const statusColor = (status: string): string => {
  const map: Record<string, string> = {
    Active: 'badge-green',
    Accepted: 'badge-green',
    Draft: 'badge-gray',
    Pending: 'badge-yellow',
    Expired: 'badge-red',
    Rejected: 'badge-red',
    Cancelled: 'badge-red',
    Withdrawn: 'badge-gray',
    Closed: 'badge-gray',
    Available: 'badge-green',
    InUse: 'badge-blue',
    Maintenance: 'badge-yellow',
  };
  return map[status] ?? 'badge-gray';
};

export const listingTypeLabel: Record<string, string> = {
  FreightOffer: 'Freight Offer',
  FreightRequest: 'Freight Request',
  VehicleHire: 'Vehicle Hire',
};

export const clx = (...classes: (string | false | undefined | null)[]) =>
  classes.filter(Boolean).join(' ');
