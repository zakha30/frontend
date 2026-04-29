import React, { useEffect, useState, useCallback } from 'react';
import { PageHeader, Field, Modal, Pagination, EmptyState } from '@components/common';
import { loadsApi } from '@api/loads';
import type { LoadResponseDto, CreateAvailableLoadDto } from '@types';

export default function AvailableLoads() {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<LoadResponseDto[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [openPost, setOpenPost] = useState(false);
  const [form, setForm] = useState<CreateAvailableLoadDto>({
    departureProvince: '',
    departureCountry: 'South Africa',
    departureCity: '',
    destinationProvince: '',
    destinationCountry: 'South Africa',
    commodity: '',
    weightBracket: '',
    contactEmail: '',
    isCrossBorder: false,
  });

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await loadsApi.getAll({ page, pageSize });
      setItems(Array.isArray(res) ? res : res.items || []);
      setTotal(Array.isArray(res) ? res.length : (res as any).totalCount || 0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => { load(); }, [load]);

  async function submitPost() {
    setLoading(true);
    try {
      await loadsApi.create(form);
      setOpenPost(false);
      load();
    } finally { setLoading(false); }
  }

  return (
    <div className="p-6">
      <PageHeader title="Available Loads" subtitle="Find and post loads" action={<button onClick={() => setOpenPost(true)} className="btn-primary">Post Load</button>} />

      <div className="card p-4 mb-4">
        <div className="grid grid-cols-4 gap-3">
          <Field label="Departure Province"><input className="input" placeholder="Filter by province" /></Field>
          <Field label="Destination Province"><input className="input" placeholder="Filter by province" /></Field>
          <Field label="Commodity"><input className="input" placeholder="Filter by commodity" /></Field>
          <Field label="Weight"><input className="input" placeholder="Filter by weight" /></Field>
        </div>
      </div>

      <div className="card">
        {loading ? <div className="p-8">Loading...</div> : (
          items.length === 0 ? <EmptyState title="No loads" description="No available loads match your filters." /> : (
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th>Departure</th>
                  <th>Destination</th>
                  <th>Commodity</th>
                  <th>Weight</th>
                  <th>Contact</th>
                </tr>
              </thead>
              <tbody>
                {items.map(i => (
                  <tr key={i.id} className="hover:bg-gray-50">
                    <td>{i.departureProvince} / {i.departureCity}</td>
                    <td>{i.destinationProvince} / {i.destinationCountry}</td>
                    <td>{i.commodity}</td>
                    <td>{i.weightBracket}</td>
                    <td>{i.contactEmail}{i.contactPhone ? ` • ${i.contactPhone}` : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}

        <div className="p-4">
          <Pagination page={page} totalPages={Math.ceil(total / pageSize)} onChange={(p: number) => setPage(p)} />
        </div>
      </div>

      <Modal open={openPost} onClose={() => setOpenPost(false)} title="Post Load">
        <div className="space-y-3">
          <Field label="Departure Province"><input className="input" value={form.departureProvince} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, departureProvince: e.target.value }))} /></Field>
          <Field label="Departure City"><input className="input" value={form.departureCity} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, departureCity: e.target.value }))} /></Field>
          <Field label="Destination Province"><input className="input" value={form.destinationProvince} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, destinationProvince: e.target.value }))} /></Field>
          <Field label="Commodity"><input className="input" value={form.commodity} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, commodity: e.target.value }))} /></Field>
          <div className="flex gap-2 justify-end">
            <button className="btn-secondary" onClick={() => setOpenPost(false)}>Cancel</button>
            <button className="btn-primary" onClick={submitPost}>Post</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
