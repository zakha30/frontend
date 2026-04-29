import React, { useState, useEffect } from 'react';
import { PageHeader, Field, Pagination, EmptyState } from '@components/common';
import { vehiclesApi } from '@api/vehicles';
import type { VehicleResponseDto, VehicleFilterDto } from '@types';

export default function FleetHire(){
  const [tab, setTab] = useState<'trucks'|'light'|'requests'>('trucks');
  const [items, setItems] = useState<VehicleResponseDto[]>([]);
  const [filter, setFilter] = useState<VehicleFilterDto>({ page: 1, pageSize: 20 });
  const [loading, setLoading] = useState(false);

  useEffect(()=>{ load(); }, [tab]);

  async function load(){
    setLoading(true);
    try{
      const res = await vehiclesApi.getAll({ page: filter.page, pageSize: filter.pageSize });
      setItems(Array.isArray(res) ? res : res.items || []);
    }finally{ setLoading(false); }
  }

  return (
    <div className="p-6">
      <PageHeader title="Fleet For Hire" subtitle="Hire trucks and light vehicles" />
      <div className="tabs mb-4">
        <button className={`tab ${tab==='trucks'?'active':''}`} onClick={() => setTab('trucks')}>Trucks</button>
        <button className={`tab ${tab==='light'?'active':''}`} onClick={() => setTab('light')}>Light Vehicles</button>
        <button className={`tab ${tab==='requests'?'active':''}`} onClick={() => setTab('requests')}>Hire Requests</button>
      </div>

      <div className="card p-4 mb-4">
        <div className="grid grid-cols-3 gap-3">
          <Field label="Province"><input className="input" placeholder="Filter by province" /></Field>
          <Field label="Truck Type"><input className="input" placeholder="Filter by truck type" /></Field>
          <Field label="Cross-border">
            <select className="input">
              <option value="any">Any</option>
              <option value="yes">Yes</option>
            </select>
          </Field>
        </div>
      </div>

      <div className="card">
        {loading ? <div className="p-8">Loading...</div> : (
          items.length === 0 ? <EmptyState title="No vehicles" description="No vehicles found." /> : (
            <ul className="divide-y">
              {items.map(v => (
                <li key={v.id} className="p-3 flex justify-between">
                  <div>
                    <div className="font-bold">{v.registrationNumber} • {v.make} {v.model}</div>
                    <div className="text-sm">{v.province}{v.city ? ` • ${v.city}` : ''} • {v.truckType}</div>
                  </div>
                  <div className="text-right">{v.dailyRate ? `${v.currency} ${v.dailyRate}` : 'N/A'}</div>
                </li>
              ))}
            </ul>
          )
        )}
      </div>

    </div>
  );
}
