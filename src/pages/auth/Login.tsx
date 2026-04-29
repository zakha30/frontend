import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '../../api/auth';
import { useAuthStore } from '../../store/authStore';

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', tenantSlug: '' });

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password || !form.tenantSlug) {
      toast.error('All fields are required');
      return;
    }
    setLoading(true);
    try {
      // Tokens arrive as HttpOnly cookies — we only get the user profile back.
      const res = await authApi.login(form);
      setUser(res.user);     // stores safe user info in localStorage
      toast.success(`Welcome back, ${res.user.fullName}!`);
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
        <h2 className="text-3xl font-extrabold text-white">Sign in</h2>
        <p className="text-slate-400 mt-1 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
            Create one free
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Company Slug</label>
          <input
            type="text"
            className="input"
            placeholder="your-company"
            value={form.tenantSlug}
            onChange={set('tenantSlug')}
            autoComplete="organization"
          />
          <p className="mt-1 text-xs text-slate-500">The unique identifier for your organisation</p>
        </div>

        <div>
          <label className="label">Email address</label>
          <input
            type="email"
            className="input"
            placeholder="you@company.com"
            value={form.email}
            onChange={set('email')}
            autoComplete="email"
          />
        </div>

        <div>
          <label className="label">Password</label>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              className="input pr-10"
              placeholder="••••••••"
              value={form.password}
              onChange={set('password')}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPw(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full mt-2 py-3">
          {loading
            ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            : <LogIn size={16} />}
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="mt-8 text-center text-xs text-slate-600">
        By signing in you agree to our{' '}
        <span className="text-slate-400 cursor-pointer hover:text-white">Terms of Service</span>
        {' '}and{' '}
        <span className="text-slate-400 cursor-pointer hover:text-white">Privacy Policy</span>.
      </p>
    </div>
  );
}
