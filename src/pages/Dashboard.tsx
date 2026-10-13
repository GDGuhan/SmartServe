import { TrendingUp, ShoppingBag, Users, Star, Leaf, DollarSign, AlertTriangle, Clock } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { ANALYTICS_WEEKLY, CATEGORY_REVENUE, MOCK_WASTE, MOCK_FEEDBACK } from '@/constants/mockData';
import { useOrders } from '@/hooks/useOrders';
import { useTables } from '@/hooks/useTables';
import { formatCurrency } from '@/lib/utils';

const TOOLTIP_STYLE = {
  backgroundColor: '#1c1c22',
  border: '1px solid #3a3a47',
  borderRadius: '8px',
  color: '#faf5eb',
};

export default function Dashboard() {
  const { orders } = useOrders();
  const { tables } = useTables();

  const totalRevenue = ANALYTICS_WEEKLY.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = ANALYTICS_WEEKLY.reduce((s, d) => s + d.orders, 0);
  const totalCovers = ANALYTICS_WEEKLY.reduce((s, d) => s + d.covers, 0);
  const avgRating = (MOCK_FEEDBACK.reduce((s, f) => s + f.rating, 0) / MOCK_FEEDBACK.length).toFixed(1);
  const occupiedTables = tables.filter(t => t.status === 'occupied').length;
  const totalWasteCost = MOCK_WASTE.reduce((s, w) => s + w.cost, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'preparing').length;

  const kpis = [
    { label: 'Weekly Revenue', value: formatCurrency(totalRevenue), change: '+12.4%', icon: DollarSign, color: 'text-brand-400', bg: 'bg-brand-500/10', positive: true },
    { label: 'Total Orders', value: totalOrders, change: '+8.1%', icon: ShoppingBag, color: 'text-blue-400', bg: 'bg-blue-500/10', positive: true },
    { label: 'Covers Served', value: totalCovers, change: '+5.7%', icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10', positive: true },
    { label: 'Guest Rating', value: `${avgRating}/5`, change: '+0.2', icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-500/10', positive: true },
    { label: 'Tables Occupied', value: `${occupiedTables}/${tables.length}`, change: `${Math.round(occupiedTables / tables.length * 100)}%`, icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10', positive: true },
    { label: 'Waste Cost (Week)', value: formatCurrency(totalWasteCost), change: '-3.2%', icon: Leaf, color: 'text-red-400', bg: 'bg-red-500/10', positive: false },
    { label: 'Pending Orders', value: pendingOrders, change: 'Live', icon: Clock, color: 'text-orange-400', bg: 'bg-orange-500/10', positive: true },
    { label: 'Avg Order Value', value: formatCurrency(totalRevenue / totalOrders), change: '+4.1%', icon: TrendingUp, color: 'text-teal-400', bg: 'bg-teal-500/10', positive: true },
  ];

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.map(({ label, value, change, icon: Icon, color, bg, positive }) => (
          <div key={label} className="glass-card p-4">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
                <Icon size={18} className={color} />
              </div>
              <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${positive ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}`}>
                {change}
              </span>
            </div>
            <p className="text-xl font-bold text-foreground font-heading">{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Revenue Area Chart */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-heading font-semibold text-foreground">Weekly Revenue</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Revenue and order trends</p>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">This Week</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={ANALYTICS_WEEKLY} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2e2e38" />
              <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(1)}k`} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [formatCurrency(v), 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="glass-card p-5">
          <h3 className="font-heading font-semibold text-foreground mb-1">Revenue by Category</h3>
          <p className="text-xs text-muted-foreground mb-4">Weekly breakdown</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={CATEGORY_REVENUE} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={3}>
                {CATEGORY_REVENUE.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [formatCurrency(v), '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {CATEGORY_REVENUE.map(({ category, value, color }) => (
              <div key={category} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
                  <span className="text-muted-foreground">{category}</span>
                </div>
                <span className="font-medium text-foreground">{formatCurrency(value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Covers Bar Chart */}
        <div className="glass-card p-5">
          <h3 className="font-heading font-semibold text-foreground mb-1">Covers per Day</h3>
          <p className="text-xs text-muted-foreground mb-5">Guests served daily</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ANALYTICS_WEEKLY} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2e2e38" />
              <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="covers" fill="#d97706" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Waste Tracker */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading font-semibold text-foreground">Food Waste Tracker</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Recent waste entries</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertTriangle size={13} className="text-red-400" />
              <span className="text-xs text-red-400 font-medium">{formatCurrency(totalWasteCost)} this week</span>
            </div>
          </div>
          <div className="space-y-2 max-h-52 overflow-y-auto">
            {MOCK_WASTE.map(w => (
              <div key={w.id} className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-surface-700">
                <div className="flex items-center gap-2 min-w-0">
                  <Leaf size={14} className="text-red-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{w.item}</p>
                    <p className="text-xs text-muted-foreground">{w.quantity} {w.unit} · {w.reason}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-semibold text-red-400">{formatCurrency(w.cost)}</p>
                  <p className="text-xs text-muted-foreground">{w.date.slice(5)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feedback Summary */}
      <div className="glass-card p-5">
        <h3 className="font-heading font-semibold text-foreground mb-4">Feedback Summary</h3>
        <div className="grid sm:grid-cols-4 gap-4">
          {[
            { label: 'Overall', value: avgRating },
            { label: 'Food Quality', value: (MOCK_FEEDBACK.reduce((s, f) => s + f.foodRating, 0) / MOCK_FEEDBACK.length).toFixed(1) },
            { label: 'Service', value: (MOCK_FEEDBACK.reduce((s, f) => s + f.serviceRating, 0) / MOCK_FEEDBACK.length).toFixed(1) },
            { label: 'Ambiance', value: (MOCK_FEEDBACK.reduce((s, f) => s + f.ambianceRating, 0) / MOCK_FEEDBACK.length).toFixed(1) },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-bold font-heading gradient-text mb-1">{value}</div>
              <div className="flex justify-center mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={12} className={i < Math.round(parseFloat(value)) ? 'text-brand-400 fill-brand-400' : 'text-surface-500'} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
