import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid,
} from 'recharts';
import {
  Package, TrendingUp, FileText, Clock, CheckCircle, DollarSign, ArrowRight,
} from 'lucide-react';
import { dashboardApi } from '../../api/dashboard';
import { FullPageSpinner, StatCard, PageHeader, Badge } from '../../components/common';
import type { DashboardSummaryDto, MyListingDto } from '../../types';
import { formatCurrency, formatDate } from '../../utils';
import { Link } from 'react-router-dom';

// Mock chart data — replace with real time-series from API when available
const monthlyData = [
  { month: 'Jan', listings: 4, quotes: 12, revenue: 3200 },
  { month: 'Feb', listings: 7, quotes: 18, revenue: 5100 },
  { month: 'Mar', listings: 5, quotes: 14, revenue: 4200 },
  { month: 'Apr', listings: 9, quotes: 26, revenue: 7800 },
  { month: 'May', listings: 11, quotes: 31, revenue: 9100 },
  { month: 'Jun', listings: 8, quotes: 22, revenue: 6500 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-3 py-2 text-xs">
      <p className="font-semibold text-white mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummaryDto | null>(null);
  const [listings, setListings] = useState<MyListingDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dashboardApi.getSummary(),
      dashboardApi.getMyListings({ page: 1, pageSize: 5 }),
    ]).then(([s, l]) => {
      setSummary(s);
      setListings(l.items);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <FullPageSpinner />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your transport operations"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Listings"
          value={summary?.activeListings ?? 0}
          sub={`of ${summary?.totalListings ?? 0} total`}
          icon={<Package size={20} />}
          color="brand"
        />
        <StatCard
          label="Revenue"
          value={formatCurrency(summary?.totalRevenueFromAcceptedQuotes ?? 0)}
          sub="from accepted quotes"
          icon={<DollarSign size={20} />}
          color="green"
        />
        <StatCard
          label="Quotes Received"
          value={summary?.totalQuotesReceived ?? 0}
          sub={`${summary?.pendingQuotesReceived ?? 0} pending`}
          icon={<FileText size={20} />}
          color="amber"
        />
        <StatCard
          label="Accepted"
          value={summary?.acceptedQuotesReceived ?? 0}
          sub="quotes accepted"
          icon={<CheckCircle size={20} />}
          color="green"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Listings & Quotes (6 months)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3048" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="listings" name="Listings" fill="#006ec5" radius={[4,4,0,0]} />
              <Bar dataKey="quotes" name="Quotes" fill="#0c8be7" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3048" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `$${v / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#0c8be7"
                strokeWidth={2.5} dot={{ r: 4, fill: '#0c8be7', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#36a6f6' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent listings table */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-300">Recent Listings</h3>
          <Link to="/trips" className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 transition-colors">
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {listings.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">No listings yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-border">
                  <th className="th">Title</th>
                  <th className="th">Route</th>
                  <th className="th">Price</th>
                  <th className="th">Status</th>
                  <th className="th">Quotes</th>
                  <th className="th">Created</th>
                </tr>
              </thead>
              <tbody>
                {listings.map(l => (
                  <tr key={l.id} className="table-row">
                    <td className="td font-medium text-white max-w-[180px] truncate">{l.title}</td>
                    <td className="td text-slate-400">{l.locationFrom} → {l.locationTo}</td>
                    <td className="td font-mono">{formatCurrency(l.price, l.currency)}</td>
                    <td className="td"><Badge status={l.status} /></td>
                    <td className="td">
                      <span className="font-semibold">{l.totalQuotes}</span>
                      {l.pendingQuotes > 0 && (
                        <span className="ml-1.5 badge-yellow text-[10px]">{l.pendingQuotes} new</span>
                      )}
                    </td>
                    <td className="td text-slate-400">{formatDate(l.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Quotes Submitted', value: summary?.totalQuotesSubmitted ?? 0, icon: <TrendingUp size={16} />, color: 'text-brand-400' },
          { label: 'Pending Submitted', value: summary?.pendingQuotesSubmitted ?? 0, icon: <Clock size={16} />, color: 'text-amber-400' },
          { label: 'Total Received', value: summary?.totalQuotesReceived ?? 0, icon: <FileText size={16} />, color: 'text-slate-300' },
          { label: 'Total Listings', value: summary?.totalListings ?? 0, icon: <Package size={16} />, color: 'text-emerald-400' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="card p-4 flex items-center gap-3">
            <span className={color}>{icon}</span>
            <div>
              <p className="text-lg font-bold text-white">{value}</p>
              <p className="text-[11px] text-slate-500">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
