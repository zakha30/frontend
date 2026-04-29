import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid,
} from 'recharts';
import { BarChart3, TrendingUp, Download } from 'lucide-react';
import { dashboardApi } from '../../api/dashboard';
import { PageHeader, StatCard, FullPageSpinner } from '../../components/common';
import { formatCurrency } from '../../utils';
import type { DashboardSummaryDto } from '../../types';

const COLORS = ['#0c8be7', '#36a6f6', '#7cc4fb', '#b9dffd', '#006ec5'];

const MONTHLY = [
  { month: 'Nov', revenue: 4200, listings: 8, quotes: 21 },
  { month: 'Dec', revenue: 3800, listings: 6, quotes: 15 },
  { month: 'Jan', revenue: 5500, listings: 10, quotes: 28 },
  { month: 'Feb', revenue: 7100, listings: 14, quotes: 35 },
  { month: 'Mar', revenue: 6400, listings: 11, quotes: 29 },
  { month: 'Apr', revenue: 9200, listings: 17, quotes: 44 },
];

const LISTING_TYPES = [
  { name: 'Freight Offer', value: 45 },
  { name: 'Freight Request', value: 32 },
  { name: 'Vehicle Hire', value: 23 },
];

const QUOTE_STATUSES = [
  { name: 'Accepted', value: 38 },
  { name: 'Pending', value: 27 },
  { name: 'Rejected', value: 22 },
  { name: 'Withdrawn', value: 13 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-3 py-2 text-xs shadow-xl">
      <p className="font-semibold text-white mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: {typeof p.value === 'number' && p.name === 'Revenue'
            ? formatCurrency(p.value)
            : p.value}
        </p>
      ))}
    </div>
  );
};

export default function Reports() {
  const [summary, setSummary] = useState<DashboardSummaryDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'6m' | '12m' | 'ytd'>('6m');

  useEffect(() => {
    dashboardApi.getSummary().then(setSummary).finally(() => setLoading(false));
  }, []);

  if (loading) return <FullPageSpinner />;

  const quoteConversionRate = summary
    ? Math.round((summary.acceptedQuotesReceived / Math.max(summary.totalQuotesReceived, 1)) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        subtitle="Business analytics and performance insights"
        action={
          <div className="flex items-center gap-2">
            <div className="flex rounded-xl border border-surface-border overflow-hidden">
              {(['6m', '12m', 'ytd'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 text-xs font-semibold transition-all ${
                    period === p ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
            <button className="btn-secondary text-xs py-2">
              <Download size={13} />Export
            </button>
          </div>
        }
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value={formatCurrency(summary?.totalRevenueFromAcceptedQuotes ?? 0)}
          icon={<TrendingUp size={20} />} color="green" />
        <StatCard label="Conversion Rate" value={`${quoteConversionRate}%`}
          sub="quotes → accepted" icon={<BarChart3 size={20} />} color="brand" />
        <StatCard label="Total Listings" value={summary?.totalListings ?? 0}
          sub={`${summary?.activeListings ?? 0} active`} icon={<BarChart3 size={20} />} color="amber" />
        <StatCard label="Total Quotes" value={summary?.totalQuotesReceived ?? 0}
          sub={`${summary?.pendingQuotesReceived ?? 0} pending`} icon={<BarChart3 size={20} />} color="brand" />
      </div>

      {/* Revenue trend + Listing breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Revenue & Activity Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={MONTHLY}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3048" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `$${v / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#0c8be7"
                strokeWidth={2.5} dot={{ r: 4, fill: '#0c8be7', strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Listing Types</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={LISTING_TYPES} cx="50%" cy="45%" innerRadius={55} outerRadius={85}
                paddingAngle={3} dataKey="value">
                {LISTING_TYPES.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quotes per month + Quote status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Listings vs Quotes per Month</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3048" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="listings" name="Listings" fill="#006ec5" radius={[4,4,0,0]} />
              <Bar dataKey="quotes" name="Quotes" fill="#36a6f6" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Quote Outcomes</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={QUOTE_STATUSES} cx="50%" cy="45%" innerRadius={55} outerRadius={85}
                paddingAngle={3} dataKey="value">
                {QUOTE_STATUSES.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary table */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Monthly Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-border">
                <th className="th">Month</th>
                <th className="th text-right">Revenue</th>
                <th className="th text-right">Listings</th>
                <th className="th text-right">Quotes</th>
                <th className="th text-right">Conv. Rate</th>
              </tr>
            </thead>
            <tbody>
              {MONTHLY.map(row => (
                <tr key={row.month} className="table-row">
                  <td className="td font-semibold text-white">{row.month}</td>
                  <td className="td text-right font-mono text-emerald-400">{formatCurrency(row.revenue)}</td>
                  <td className="td text-right">{row.listings}</td>
                  <td className="td text-right">{row.quotes}</td>
                  <td className="td text-right text-brand-400">{Math.round((row.listings / row.quotes) * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
