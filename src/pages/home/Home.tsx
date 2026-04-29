import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Truck, Users, Briefcase, Tag, MessageCircle,
  FileText, MapPin, Clock, ArrowRight, Menu, X,
  Zap, BarChart3, Package, Building2,
  LogIn, UserPlus, LogOut, Bell,
} from 'lucide-react';
import { StatCard, Spinner } from '@components/common';
import { formatCurrency, formatDate } from '@utils';
import { LanguageToggle } from '@components/layout/languageToggle';
import { useAuthStore } from '@store/authStore';
import { authApi } from '@api/auth';

// ── Types ─────────────────────────────────────────────────────────────────────
interface DashboardStats {
  totalListings: number;
  activeListings: number;
  totalQuotesSubmitted: number;
  pendingQuotesSubmitted: number;
  totalQuotesReceived: number;
  pendingQuotesReceived: number;
  acceptedQuotesReceived: number;
  totalRevenueFromAcceptedQuotes: number;
}

export default function Home() {
  const { t }        = useTranslation('home');
  const { t: tc }    = useTranslation('common');
  const { isAuthenticated, clearAuth } = useAuthStore();
  const navigate     = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut,     setLoggingOut]     = useState(false);
  const [loading,        setLoading]        = useState(true);
  const [stats,          setStats]          = useState<DashboardStats | null>(null);

  // ── Nav — inside component so labels react to language toggle ─────────────
  const NAV_ITEMS = [
    { id: 'fleet',       label: tc('nav.fleet'),       icon: Truck,         path: '/fleet' },
    { id: 'drivers',     label: tc('nav.drivers'),     icon: Users,         path: '/drivers' },
    { id: 'loads',       label: tc('nav.loads'),       icon: Package,       path: '/loads' },
    { id: 'classifieds', label: tc('nav.classifieds'), icon: Tag,           path: '/classifieds' },
    { id: 'jobs',        label: tc('nav.jobs'),        icon: Briefcase,     path: '/jobs' },
    { id: 'forum',       label: tc('nav.forum'),       icon: MessageCircle, path: '/forum' },
    { id: 'directory',   label: tc('nav.directory'),   icon: Building2,     path: '/directory' },
  ];

  // ── Sections ──────────────────────────────────────────────────────────────
  const SECTIONS = [
    {
      id: 'fleet', title: t('sections.fleet.title'),
      description: t('sections.fleet.description'),
      icon: Truck, path: '/fleet', color: 'bg-blue-500/20 text-blue-400',
      stats: [
        { label: t('sections.fleet.stats.tracked'), value: '24' },
        { label: t('sections.fleet.stats.active'),  value: '18' },
        { label: t('sections.fleet.stats.hire'),    value: '6'  },
      ],
    },
    {
      id: 'drivers', title: t('sections.drivers.title'),
      description: t('sections.drivers.description'),
      icon: Users, path: '/drivers', color: 'bg-emerald-500/20 text-emerald-400',
      stats: [
        { label: t('sections.drivers.stats.total'),     value: '32' },
        { label: t('sections.drivers.stats.available'), value: '28' },
        { label: t('sections.drivers.stats.onTrip'),    value: '12' },
      ],
    },
    {
      id: 'loads', title: t('sections.loads.title'),
      description: t('sections.loads.description'),
      icon: Package, path: '/loads', color: 'bg-purple-500/20 text-purple-400',
      stats: [
        { label: t('sections.loads.stats.open'),   value: '156' },
        { label: t('sections.loads.stats.quotes'), value: '43'  },
        { label: t('sections.loads.stats.won'),    value: '87'  },
      ],
    },
    {
      id: 'classifieds', title: t('sections.classifieds.title'),
      description: t('sections.classifieds.description'),
      icon: Tag, path: '/classifieds', color: 'bg-orange-500/20 text-orange-400',
      stats: [
        { label: t('sections.classifieds.stats.active'), value: '89' },
        { label: t('sections.classifieds.stats.today'),  value: '12' },
        { label: t('sections.classifieds.stats.cats'),   value: '6'  },
      ],
    },
    {
      id: 'jobs', title: t('sections.jobs.title'),
      description: t('sections.jobs.description'),
      icon: Briefcase, path: '/jobs', color: 'bg-cyan-500/20 text-cyan-400',
      stats: [
        { label: t('sections.jobs.stats.seekers'),   value: '245' },
        { label: t('sections.jobs.stats.vacancies'), value: '67'  },
        { label: t('sections.jobs.stats.week'),      value: '34'  },
      ],
    },
    {
      id: 'forum', title: t('sections.forum.title'),
      description: t('sections.forum.description'),
      icon: MessageCircle, path: '/forum', color: 'bg-pink-500/20 text-pink-400',
      stats: [
        { label: t('sections.forum.stats.topics'),  value: '1,234' },
        { label: t('sections.forum.stats.posts'),   value: '8,567' },
        { label: t('sections.forum.stats.members'), value: '3,456' },
      ],
    },
  ];

  // ── Blog posts ────────────────────────────────────────────────────────────
  const BLOG_POSTS = [
    {
      id: '1', date: '2024-01-15',
      title: t('posts.1.title'), excerpt:  t('posts.1.excerpt'),
      author: t('posts.1.author'), category: t('posts.1.category'),
      readTime: t('posts.1.readTime'),
    },
    {
      id: '2', date: '2024-01-12',
      title: t('posts.2.title'), excerpt:  t('posts.2.excerpt'),
      author: t('posts.2.author'), category: t('posts.2.category'),
      readTime: t('posts.2.readTime'),
    },
    {
      id: '3', date: '2024-01-10',
      title: t('posts.3.title'), excerpt:  t('posts.3.excerpt'),
      author: t('posts.3.author'), category: t('posts.3.category'),
      readTime: t('posts.3.readTime'),
    },
  ];

  // ── Mock stats load ───────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        totalListings: 45, activeListings: 28,
        totalQuotesSubmitted: 156, pendingQuotesSubmitted: 23,
        totalQuotesReceived: 89,  pendingQuotesReceived: 12,
        acceptedQuotesReceived: 45, totalRevenueFromAcceptedQuotes: 1250000,
      });
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // ── Logout ────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await authApi.logout();
    } finally {
      clearAuth();
      navigate('/');
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-surface-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* Logo */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600">
                <Zap size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight hidden sm:block">
                {tc('brand')}
              </span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center overflow-x-auto">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap
                             text-slate-500 hover:text-slate-800 hover:bg-surface-hover transition-all duration-150"
                >
                  <item.icon size={14} />
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-2 shrink-0">
              <LanguageToggle />

              {isAuthenticated ? (
                /* ── Logged-in ── */
                <>
                  <Link
                    to="/notifications"
                    className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-surface-hover transition-colors"
                  >
                    <Bell size={18} />
                  </Link>

                  <Link
                    to="/reports"
                    className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm
                               font-medium text-slate-500 hover:text-slate-800 hover:bg-surface-hover transition-colors"
                  >
                    <BarChart3 size={15} />
                    {tc('nav.reports')}
                  </Link>                 

                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm
                               font-semibold text-red-500 border border-red-200 bg-red-50
                               hover:bg-red-100 hover:border-red-300 transition-all disabled:opacity-50"
                  >
                    <LogOut size={15} />
                    {loggingOut ? '...' : tc('actions.signOut')}
                  </button>
                </>
              ) : (
                /* ── Guest ── */
                <>
                  <Link
                    to="/login"
                    className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm
                               font-semibold text-brand-600 border border-brand-200 bg-brand-50
                               hover:bg-brand-100 hover:border-brand-300 transition-all"
                  >
                    <LogIn size={15} />
                    {tc('actions.signIn')}
                  </Link>
                  <Link
                    to="/register"
                    className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm
                               font-semibold text-white bg-brand-600 hover:bg-brand-700
                               transition-all shadow-sm"
                  >
                    <UserPlus size={15} />
                    {tc('actions.register')}
                  </Link>
                </>
              )}

              {/* Mobile toggle */}
              <button
                className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-surface-hover"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-surface-border bg-white">
            <div className="px-4 py-3 space-y-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                             text-slate-500 hover:text-slate-800 hover:bg-surface-hover"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              ))}

              <div className="pt-3 border-t border-surface-border space-y-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/notifications"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                                 text-slate-500 hover:text-slate-800 hover:bg-surface-hover"
                    >
                      <Bell size={18} /> {tc('nav.notifications')}
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl
                                 text-sm font-semibold text-brand-600 border border-brand-200 bg-brand-50
                                 hover:bg-brand-100 transition-colors"
                    >
                      <BarChart3 size={16} /> {tc('nav.dashboard')}
                    </Link>
                    <button
                      onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                      disabled={loggingOut}
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl
                                 text-sm font-semibold text-red-500 border border-red-200 bg-red-50
                                 hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      <LogOut size={16} />
                      {loggingOut ? '...' : tc('actions.signOut')}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl
                                 text-sm font-semibold text-brand-600 border border-brand-200 bg-brand-50
                                 hover:bg-brand-100 transition-colors"
                    >
                      <LogIn size={16} /> {tc('actions.signIn')}
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl
                                 text-sm font-semibold text-white bg-brand-600
                                 hover:bg-brand-700 transition-colors"
                    >
                      <UserPlus size={16} /> {tc('actions.register')}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">{t('welcome.title')}</h1>
          <p className="mt-2 text-slate-500">{t('welcome.subtitle')}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label={t('stats.activeListings')}
            value={stats?.activeListings ?? 0}
            icon={<FileText size={24} />}
            color="brand"
          />
          <StatCard
            label={t('stats.pendingQuotes')}
            value={stats?.pendingQuotesReceived ?? 0}
            icon={<Clock size={24} />}
            color="amber"
          />
          <StatCard
            label={t('stats.acceptedQuotes')}
            value={stats?.acceptedQuotesReceived ?? 0}
            icon={<MapPin size={24} />}
            color="green"
          />
          <StatCard
            label={t('stats.revenue')}
            value={formatCurrency(stats?.totalRevenueFromAcceptedQuotes ?? 0, 'ZAR')}
            icon={<BarChart3 size={24} />}
            color="brand"
          />
        </div>

        {/* Section Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {SECTIONS.map((section) => (
            <Link
              key={section.id}
              to={section.path}
              className="group card p-6 hover:border-brand-300 hover:shadow-card-hover transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${section.color}`}>
                  <section.icon size={24} />
                </div>
                <ArrowRight
                  size={20}
                  className="text-slate-300 group-hover:text-brand-500 group-hover:translate-x-1 transition-all flip-rtl"
                />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 group-hover:text-brand-600 transition-colors">
                {section.title}
              </h3>
              <p className="mt-1 text-sm text-slate-500">{section.description}</p>
              <div className="mt-4 pt-4 border-t border-surface-border grid grid-cols-3 gap-2">
                {section.stats.map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <p className="text-lg font-bold text-slate-800">{stat.value}</p>
                    <p className="text-xs text-slate-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>

        {/* Blog */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{t('blog.heading')}</h2>
              <p className="text-sm text-slate-500 mt-1">{t('blog.subheading')}</p>
            </div>
            <Link
              to="/forum"
              className="flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              {t('blog.viewAll')} <ArrowRight size={16} className="flip-rtl" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BLOG_POSTS.map((post) => (
              <article
                key={post.id}
                className="p-4 rounded-xl bg-surface-hover hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-brand-50 text-brand-600 font-medium">
                    {post.category}
                  </span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-900 line-clamp-2">{post.title}</h3>
                <p className="mt-2 text-xs text-slate-400 line-clamp-2">{post.excerpt}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                  <span>{post.author}</span>
                  <span>{formatDate(post.date)}</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/loads"
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-50 text-brand-600 hover:bg-brand-100 transition-colors border border-brand-100">
            <Package size={18} />
            <span className="text-sm font-medium">{t('quickActions.findLoads')}</span>
          </Link>
          <Link to="/classifieds"
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-surface-hover text-slate-600 hover:bg-slate-200 transition-colors border border-surface-border">
            <Tag size={18} />
            <span className="text-sm font-medium">{t('quickActions.postClassified')}</span>
          </Link>
          <Link to="/forum"
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-surface-hover text-slate-600 hover:bg-slate-200 transition-colors border border-surface-border">
            <MessageCircle size={18} />
            <span className="text-sm font-medium">{t('quickActions.startDiscussion')}</span>
          </Link>
          <Link to="/directory"
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-surface-hover text-slate-600 hover:bg-slate-200 transition-colors border border-surface-border">
            <Building2 size={18} />
            <span className="text-sm font-medium">{t('quickActions.addBusiness')}</span>
          </Link>
        </div>

      </main>
    </div>
  );
}