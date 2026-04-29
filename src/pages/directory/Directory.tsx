import React, { useEffect, useState } from 'react';
import { PageHeader, Field, Modal, EmptyState } from '@components/common';
import { directoryApi } from '@api/directory';
import type { DirectoryResponseDto, CreateDirectoryEntryDto } from '@types';

export default function Directory(){
  const [items, setItems] = useState<DirectoryResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateDirectoryEntryDto>({ BusinessName: '', Slug: '', ContactEmail: '' });

  useEffect(()=>{ load(); }, []);
  async function load(){
    setLoading(true);
    try {
      const res = await directoryApi.getAll({});
      setItems(Array.isArray(res) ? res : res.items || []);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <PageHeader title="Business Directory" subtitle="Find service providers" action={<button className="btn-primary" onClick={()=>setOpen(true)}>List Business</button>} />

      <div className="card p-4 mb-4">
        <div className="grid grid-cols-3 gap-3">
          <Field label="Province"><input className="input" placeholder="Filter by province" /></Field>
          <Field label="Service"><input className="input" placeholder="Filter by service" /></Field>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {items.length === 0 ? <EmptyState title="No results" description="No businesses found." /> : items.map(b=> (
          <div key={b.id} className="card p-4">
            <div className="font-bold">{b.companyName}</div>
            <div className="text-sm">{b.province} • {b.city}{b.city ? ` • ${b.city}` : ''}</div>
            <div className="mt-2 text-sm">{b.contactEmail}</div>
          </div>
        ))}
      </div>

      <Modal open={open} onClose={()=>setOpen(false)} title="List Business">
        <div className="space-y-3">
          <Field label="Business Name"><input className="input" value={form.BusinessName} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setForm((f: CreateDirectoryEntryDto)=>({ ...f, BusinessName: e.target.value }))} /></Field>
          <Field label="Slug"><input className="input" value={form.Slug} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setForm((f: CreateDirectoryEntryDto)=>({ ...f, Slug: e.target.value }))} /></Field>
          <Field label="Contact Email"><input className="input" value={form.ContactEmail} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setForm((f: CreateDirectoryEntryDto)=>({ ...f, ContactEmail: e.target.value }))} /></Field>
          <div className="flex justify-end gap-2"><button className="btn-secondary" onClick={()=>setOpen(false)}>Cancel</button><button className="btn-primary">List</button></div>
        </div>
      </Modal>
    </div>
  );
}
