import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '../../api/auth';
import { useAuthStore } from '../../store/authStore';
import { plansApi } from '../../api/vehicles';
import type { PlanDto } from '../../types';

export default function Register() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [plans, setPlans] = useState<PlanDto[]>([]);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '',
    tenantName: '', tenantSlug: '', planId: '',
  });

  useEffect(() => { plansApi.getAll().then(setPlans).catch(() => {}); }, []);

  const handleTenantName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    setForm(f => ({ ...f, tenantName: name, tenantSlug: slug }));
  };

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const required = ['firstName','lastName','email','password','tenantName','tenantSlug','planId'] as const;
    if (required.some(k => !form[k])) { toast.error('Please fill all fields'); return; }
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      // Tokens arrive as HttpOnly cookies — we only get the user profile back.
      const res = await authApi.register(form);
      setUser(res.user);
      toast.success('Account created! Welcome to TransHub 🚛');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex lg:hidden items-center gap-2.5 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
            <Zap size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold text-white">TransHub</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white">Create account</h2>
        <p className="text-slate-400 mt-1 text-sm">
          Already have one?{' '}
          <Link to="/login" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">Sign in</Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">First name</label>
            <input className="input" placeholder="John" value={form.firstName} onChange={set('firstName')} />
          </div>
          <div>
            <label className="label">Last name</label>
            <input className="input" placeholder="Doe" value={form.lastName} onChange={set('lastName')} />
          </div>
        </div>

        <div>
          <label className="label">Email address</label>
          <input type="email" className="input" placeholder="you@company.com" value={form.email} onChange={set('email')} />
        </div>

        <div>
          <label className="label">Password</label>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              className="input pr-10"
              placeholder="Min 8 characters"
              value={form.password}
              onChange={set('password')}
            />
            <button type="button" onClick={() => setShowPw(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="pt-1 border-t border-surface-border">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Company Details</p>
          <div className="space-y-3">
            <div>
              <label className="label">Company name</label>
              <input className="input" placeholder="Acme Logistics" value={form.tenantName} onChange={handleTenantName} />
            </div>
            <div>
              <label className="label">Company slug</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-mono">transhub.io/</span>
                <input className="input pl-[7.5rem] font-mono" placeholder="acme-logistics"
                  value={form.tenantSlug} onChange={set('tenantSlug')} />
              </div>
            </div>

            {plans.length > 0 ? (
              <div>
                <label className="label">Plan</label>
                <select className="input" value={form.planId} onChange={set('planId')}>
                  <option value="">Select a plan…</option>
                  {plans.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.currency} {p.monthlyPrice}/mo
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="label">Plan ID</label>
                <input className="input font-mono text-xs" placeholder="Plan UUID from admin"
                  value={form.planId} onChange={set('planId')} />
              </div>
            )}
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full py-3">
          {loading
            ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            : <UserPlus size={16} />}
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </div>
  );
}
