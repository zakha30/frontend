import { Outlet } from 'react-router-dom';
import { Zap } from 'lucide-react';

export const AuthLayout = () => (
  <div className="flex min-h-screen">
    {/* Left brand panel */}
    <div className="hidden lg:flex lg:w-[45%] flex-col justify-between bg-gradient-to-br from-brand-950 via-brand-900 to-surface-card p-12 border-r border-surface-border relative overflow-hidden">
      {/* Decorative grid */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
      {/* Glow orb */}
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-brand-600/20 blur-3xl" />
      <div className="absolute top-20 right-0 h-64 w-64 rounded-full bg-brand-400/10 blur-2xl" />

      <div className="relative z-10 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 shadow-glow">
          <Zap size={20} className="text-white" />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">TransHub</span>
      </div>

      <div className="relative z-10">
        <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
          Your Transport<br />Business, Unified.
        </h1>
        <p className="text-base text-brand-200/70 max-w-sm leading-relaxed">
          Manage your fleet, drivers, trips, and client bookings from a single powerful platform built for modern logistics.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-4">
          {[
            { v: '12k+', l: 'Active Transporters' },
            { v: '98%',  l: 'Uptime SLA' },
            { v: '4.9★', l: 'Avg. Rating' },
            { v: '50+',  l: 'Countries' },
          ].map(({ v, l }) => (
            <div key={l} className="rounded-xl border border-brand-800/50 bg-brand-900/30 p-4">
              <p className="text-2xl font-bold text-brand-300">{v}</p>
              <p className="text-xs text-brand-400/70 mt-0.5">{l}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="relative z-10 text-xs text-brand-400/40">© 2025 TransHub. All rights reserved.</p>
    </div>

    {/* Right form panel */}
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-md animate-slide-up">
        <Outlet />
      </div>
    </div>
  </div>
);
