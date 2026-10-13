import { Link } from 'react-router-dom';
import { ArrowRight, Star, Users, ShoppingBag, TrendingUp, QrCode, BarChart3, Leaf } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useOrders } from '@/hooks/useOrders';
import { useTables } from '@/hooks/useTables';
import { MOCK_FEEDBACK } from '@/constants/mockData';
import { formatCurrency } from '@/lib/utils';
import heroImg from '@/assets/hero-restaurant.jpg';

export default function Home() {
  const { user } = useAuth();
  const { orders } = useOrders();
  const { tables } = useTables();

  const activeOrders = orders.filter(o => o.status === 'pending' || o.status === 'preparing' || o.status === 'ready');
  const availableTables = tables.filter(t => t.status === 'available').length;
  const todayRevenue = orders.filter(o => o.status === 'served').reduce((s, o) => s + o.total, 0);
  const avgRating = (MOCK_FEEDBACK.reduce((s, f) => s + f.rating, 0) / MOCK_FEEDBACK.length).toFixed(1);

  const stats = [
    { label: 'Active Orders', value: activeOrders.length, icon: ShoppingBag, color: 'text-brand-400', bg: 'bg-brand-500/10' },
    { label: 'Available Tables', value: `${availableTables}/${tables.length}`, icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: "Today's Revenue", value: formatCurrency(todayRevenue), icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Avg Rating', value: `${avgRating} ★`, icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  ];

  const features = [
    { icon: QrCode, title: 'QR Code Menu', desc: 'Guests scan & order directly from their phones — zero wait time, zero paper menus.', link: '/menu', label: 'View Menu' },
    { icon: BarChart3, title: 'Admin Dashboard', desc: 'Real-time analytics, revenue trends, and food waste tracking in one glance.', link: '/dashboard', label: 'Open Dashboard' },
    { icon: Leaf, title: 'Waste Tracker', desc: 'Monitor and reduce food wastage with intelligent daily reports and cost analysis.', link: '/dashboard', label: 'See Reports' },
  ];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden h-64 md:h-80">
        <img src={heroImg} alt="SmartServe Restaurant" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-surface-900/95 via-surface-900/70 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12">
          <p className="text-brand-400 font-medium text-sm uppercase tracking-widest mb-2">Welcome to</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3">
            Smart<span className="gradient-text">Serve</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-md mb-6">
            Intelligent restaurant management — orders, tables, and analytics unified.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link to="/menu" className="btn-primary flex items-center gap-2 text-sm">
              Browse Menu <ArrowRight size={15} />
            </Link>
            {!user && (
              <Link to="/login" className="btn-secondary text-sm">
                Staff Login
              </Link>
            )}
          </div>
        </div>
        {user && (
          <div className="absolute top-4 right-4 bg-surface-800/80 backdrop-blur-sm border border-surface-600 rounded-xl p-3">
            <p className="text-xs text-muted-foreground">Signed in as</p>
            <p className="text-sm font-semibold text-foreground">{user.name}</p>
            <p className="text-xs text-brand-400 capitalize">{user.role}</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="glass-card p-5 hover:border-surface-500 transition-colors">
            <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mb-3`}>
              <Icon size={20} className={color} />
            </div>
            <p className="text-2xl font-bold text-foreground font-heading">{value}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Feature cards */}
      <div>
        <div className="section-header">
          <div className="amber-dot" />
          <h2 className="text-xl font-heading font-semibold text-foreground">Platform Features</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, desc, link, label }) => (
            <div key={title} className="glass-card-glow p-6 group hover:border-brand-600/60 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-4 group-hover:bg-brand-500/20 transition-colors">
                <Icon size={22} className="text-brand-400" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{desc}</p>
              <Link to={link} className="text-brand-400 hover:text-brand-300 text-sm font-medium flex items-center gap-1.5 transition-colors">
                {label} <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Recent feedback */}
      <div>
        <div className="section-header">
          <div className="amber-dot" />
          <h2 className="text-xl font-heading font-semibold text-foreground">Recent Guest Reviews</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_FEEDBACK.slice(0, 3).map(fb => (
            <div key={fb.id} className="glass-card p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-xs font-bold text-white">
                    {fb.customerName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{fb.customerName}</p>
                    <p className="text-xs text-muted-foreground">Table {fb.tableNumber}</p>
                  </div>
                </div>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} className={i < fb.rating ? 'text-brand-400 fill-brand-400' : 'text-surface-500'} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{fb.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
