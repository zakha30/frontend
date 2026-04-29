import React, { useEffect, useState } from 'react';
import { PageHeader, Modal, EmptyState } from '@components/common';
import { loadsApi } from '@api/loads';
import type { QuoteRequestDto } from '@types';

export default function QuotesBoard() {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<QuoteRequestDto[]>([]);
  const [openSubmit, setOpenSubmit] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [price, setPrice] = useState<number | undefined>(undefined);

  async function load() {
    setLoading(true);
    try {
      const res = await loadsApi.getQuoteRequests();
      setItems(Array.isArray(res) ? res : res.items || []);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function submit() {
    if (!selectedId || !price) return;
    setLoading(true);
    try {
      await loadsApi.submitQuote(selectedId, { price, message: '' });
      setOpenSubmit(false);
      load();
    } finally { setLoading(false); }
  }

  return (
    <div className="p-6">
      <PageHeader title="Quote Requests" subtitle="Respond to requests" />

      <div className="card">
        {loading ? <div className="p-8">Loading...</div> : (
          items.length === 0 ? <EmptyState title="No quote requests" description="No requests available." /> : (
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th>Details</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Quotes</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map(i => (
                  <tr key={i.id} className="hover:bg-gray-50">
                    <td>{i.details}</td>
                    <td>{i.province} / {i.city}</td>
                    <td>{i.status}</td>
                    <td>{i.submissionCount}</td>
                    <td><button className="btn-primary" onClick={() => { setSelectedId(i.id); setOpenSubmit(true); }}>Submit Quote</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </div>

      <Modal open={openSubmit} onClose={() => setOpenSubmit(false)} title="Submit Quote">
        <div className="space-y-3">
          <div>
            <label className="block text-sm">Price</label>
            <input type="number" className="input" value={price ?? ''} onChange={e => setPrice(Number(e.target.value))} />
          </div>

          <div className="flex gap-2 justify-end">
            <button className="btn-secondary" onClick={() => setOpenSubmit(false)}>Cancel</button>
            <button className="btn-primary" onClick={submit}>Submit</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
