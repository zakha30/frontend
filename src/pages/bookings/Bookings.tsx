import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, MinusCircle, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { dashboardApi } from '../../api/dashboard';
import { quotesApi } from '../../api/quotes';
import {
  PageHeader, Badge, Pagination, EmptyState, FullPageSpinner, Modal, Field, Spinner,
} from '../../components/common';
import type { ReceivedQuoteDto, MyQuoteDto } from '../../types';
import { formatCurrency, formatDate, formatDateTime } from '../../utils';

type Tab = 'received' | 'submitted';

export default function Bookings() {
  const [tab, setTab] = useState<Tab>('received');
  const [received, setReceived] = useState<ReceivedQuoteDto[]>([]);
  const [submitted, setSubmitted] = useState<MyQuoteDto[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<{ id: string; mode: 'reject' | 'withdraw' } | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const pageSize = 10;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (tab === 'received') {
        const res = await dashboardApi.getReceivedQuotes({ page, pageSize });
        setReceived(res.items);
        setTotal(res.totalCount);
      } else {
        const res = await dashboardApi.getMyQuotes({ page, pageSize });
        setSubmitted(res.items);
        setTotal(res.totalCount);
      }
    } finally {
      setLoading(false);
    }
  }, [tab, page]);

  useEffect(() => { setPage(1); }, [tab]);
  useEffect(() => { load(); }, [load]);

  const handleAccept = async (id: string) => {
    setActionId(id);
    try {
      await quotesApi.accept(id);
      toast.success('Quote accepted');
      load();
    } finally {
      setActionId(null);
    }
  };

  const handleRejectOrWithdraw = async () => {
    if (!rejectModal) return;
    if (!rejectReason.trim()) { toast.error('Reason is required'); return; }
    setActionId(rejectModal.id);
    try {
      if (rejectModal.mode === 'reject') {
        await quotesApi.reject(rejectModal.id, rejectReason);
        toast.success('Quote rejected');
      } else {
        await quotesApi.withdraw(rejectModal.id, rejectReason);
        toast.success('Quote withdrawn');
      }
      setRejectModal(null);
      setRejectReason('');
      load();
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bookings & Quotes"
        subtitle="Manage incoming and outgoing transport quotes"
      />

      {/* Tabs */}
      <div className="flex border-b border-surface-border">
        {([
          { key: 'received', label: 'Received Quotes' },
          { key: 'submitted', label: 'My Submitted Quotes' },
        ] as const).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all -mb-px ${
              tab === key
                ? 'border-brand-500 text-brand-400'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : tab === 'received' ? (
          received.length === 0 ? (
            <EmptyState icon={<FileText size={48} />} title="No quotes received yet" description="Quotes on your listings will appear here." />
          ) : (
            <div className="divide-y divide-surface-border">
              {received.map(q => {
                const isOpen = expanded === q.id;
                const isPending = q.status === 'Pending';
                return (
                  <div key={q.id}>
                    <button
                      className="w-full text-left px-5 py-4 hover:bg-surface-hover transition-colors"
                      onClick={() => setExpanded(isOpen ? null : q.id)}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2.5">
                            <p className="font-semibold text-white truncate">{q.listingTitle}</p>
                            <Badge status={q.status} />
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            from <span className="text-slate-300 font-medium">{q.transporterName}</span>
                            {' · '}{q.locationFrom} → {q.locationTo}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                          <p className="font-mono font-bold text-white">{formatCurrency(q.price, q.currency)}</p>
                          <p className="text-xs text-slate-500">{formatDate(q.createdAt)}</p>
                          {isOpen ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                        </div>
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 bg-surface/40">
                        <div className="rounded-xl border border-surface-border p-4 space-y-3">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-xs text-slate-500 mb-0.5">Transporter</p>
                              <p className="text-white font-medium">{q.transporterName}</p>
                              <p className="text-xs text-slate-400">{q.transporterEmail}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 mb-0.5">Valid Until</p>
                              <p className="text-white">{formatDateTime(q.validUntil)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 mb-0.5">Submitted</p>
                              <p className="text-white">{formatDateTime(q.createdAt)}</p>
                            </div>
                            {q.acceptedAt && (
                              <div>
                                <p className="text-xs text-slate-500 mb-0.5">Accepted At</p>
                                <p className="text-emerald-400">{formatDateTime(q.acceptedAt)}</p>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Message</p>
                            <p className="text-sm text-slate-200 leading-relaxed">{q.message}</p>
                          </div>
                          {q.rejectionReason && (
                            <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2">
                              <p className="text-xs text-red-400">Rejection reason: {q.rejectionReason}</p>
                            </div>
                          )}
                          {isPending && (
                            <div className="flex gap-2 pt-1">
                              <button
                                onClick={() => handleAccept(q.id)}
                                disabled={actionId === q.id}
                                className="btn-primary text-xs py-2"
                              >
                                {actionId === q.id ? <Spinner size="sm" /> : <CheckCircle size={14} />}
                                Accept Quote
                              </button>
                              <button
                                onClick={() => setRejectModal({ id: q.id, mode: 'reject' })}
                                className="btn-danger text-xs py-2"
                              >
                                <XCircle size={14} />Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )
        ) : (
          submitted.length === 0 ? (
            <EmptyState icon={<FileText size={48} />} title="No quotes submitted" description="Quotes you submit on listings will appear here." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-border">
                    <th className="th">Listing</th>
                    <th className="th">Route</th>
                    <th className="th">My Price</th>
                    <th className="th">Status</th>
                    <th className="th">Valid Until</th>
                    <th className="th">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submitted.map(q => (
                    <tr key={q.id} className="table-row">
                      <td className="td font-medium text-white max-w-[180px] truncate">{q.listingTitle}</td>
                      <td className="td text-slate-400 text-xs">
                        {q.locationFrom} → {q.locationTo}
                      </td>
                      <td className="td font-mono font-semibold text-white">{formatCurrency(q.myPrice, q.currency)}</td>
                      <td className="td"><Badge status={q.status} /></td>
                      <td className="td text-slate-400 text-xs">{formatDate(q.validUntil)}</td>
                      <td className="td">
                        {q.status === 'Pending' && (
                          <button
                            onClick={() => setRejectModal({ id: q.id, mode: 'withdraw' })}
                            className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-400 transition-colors"
                          >
                            <MinusCircle size={13} />Withdraw
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {total > pageSize && (
          <div className="border-t border-surface-border px-4 py-3">
            <Pagination page={page} totalPages={Math.ceil(total / pageSize)} onChange={setPage} />
          </div>
        )}
      </div>

      <Modal
        open={!!rejectModal}
        onClose={() => { setRejectModal(null); setRejectReason(''); }}
        title={rejectModal?.mode === 'reject' ? 'Reject Quote' : 'Withdraw Quote'}
      >
        <div className="space-y-4">
          <Field label={rejectModal?.mode === 'reject' ? 'Rejection Reason' : 'Withdrawal Reason'}>
            <textarea
              className="input min-h-[100px] resize-none"
              placeholder={rejectModal?.mode === 'reject'
                ? 'Explain why you are rejecting this quote…'
                : 'Explain why you are withdrawing your quote…'}
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
            />
          </Field>
          <div className="flex gap-3">
            <button onClick={() => { setRejectModal(null); setRejectReason(''); }} className="btn-secondary flex-1">Cancel</button>
            <button onClick={handleRejectOrWithdraw} disabled={!!actionId} className="btn-danger flex-1">
              {actionId ? <Spinner size="sm" /> : null}
              {rejectModal?.mode === 'reject' ? 'Reject Quote' : 'Withdraw Quote'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
