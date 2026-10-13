import { useState } from 'react';
import { Clock, ChefHat, CheckCheck, X, ShoppingBag, Filter, RefreshCw, Eye } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import type { OrderStatus } from '@/types';
import { formatCurrency, timeAgo } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  pending: { label: 'Pending', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30', icon: Clock },
  preparing: { label: 'Preparing', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30', icon: ChefHat },
  ready: { label: 'Ready', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', icon: CheckCheck },
  served: { label: 'Served', color: 'text-surface-400', bg: 'bg-surface-500/10 border-surface-500/30', icon: CheckCheck },
  cancelled: { label: 'Cancelled', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', icon: X },
};

const ORDER_FLOW: OrderStatus[] = ['pending', 'preparing', 'ready', 'served'];

export default function Orders() {
  const { orders, updateOrderStatus, cancelOrder } = useOrders();
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);
  const selectedOrder = orders.find(o => o.id === selected);

  const counts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    served: orders.filter(o => o.status === 'served').length,
  };

  const advance = (orderId: string, current: OrderStatus) => {
    const idx = ORDER_FLOW.indexOf(current);
    if (idx < ORDER_FLOW.length - 1) {
      const next = ORDER_FLOW[idx + 1];
      updateOrderStatus(orderId, next);
      toast.success(`Order moved to ${next}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(Object.entries(counts) as [string, number][]).map(([status, count]) => {
          const cfg = status !== 'all' ? STATUS_CONFIG[status as OrderStatus] : null;
          return (
            <button
              key={status}
              onClick={() => setFilter(status as OrderStatus | 'all')}
              className={cn(
                'flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border',
                filter === status
                  ? cfg ? cn(cfg.bg, cfg.color) : 'bg-brand-500/10 text-brand-400 border-brand-500/30'
                  : 'bg-surface-700 text-muted-foreground border-surface-500 hover:text-foreground'
              )}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="bg-surface-600 text-xs px-1.5 py-0.5 rounded-full">{count}</span>
            </button>
          );
        })}
        <button onClick={() => window.location.reload()} className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-sm text-muted-foreground border border-surface-500 bg-surface-700 hover:text-foreground ml-auto">
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <ShoppingBag size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">No orders found</p>
            </div>
          )}
          {filtered.map(order => {
            const cfg = STATUS_CONFIG[order.status];
            const Icon = cfg.icon;
            const isSelected = selected === order.id;
            return (
              <div
                key={order.id}
                onClick={() => setSelected(isSelected ? null : order.id)}
                className={cn(
                  'glass-card p-4 cursor-pointer transition-all hover:border-surface-500',
                  isSelected && 'border-brand-500 bg-brand-500/5'
                )}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center border', cfg.bg)}>
                      <Icon size={18} className={cfg.color} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground text-sm">#{order.id.slice(0, 6).toUpperCase()}</p>
                        <span className={cn('status-badge', cfg.bg, cfg.color)}>{cfg.label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">Table {order.tableNumber} · {order.customerName}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-base font-bold text-brand-400">{formatCurrency(order.total)}</p>
                    <p className="text-xs text-muted-foreground">{timeAgo(order.createdAt)}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {order.items.map((item, i) => (
                    <span key={i} className="text-xs bg-surface-700 text-muted-foreground px-2 py-0.5 rounded-full">
                      {item.quantity}× {item.name}
                    </span>
                  ))}
                </div>

                {order.estimatedTime !== undefined && order.estimatedTime > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-brand-400">
                    <Clock size={11} />
                    ~{order.estimatedTime} min remaining
                  </div>
                )}

                {/* Progress */}
                <div className="flex items-center gap-1 mt-3">
                  {ORDER_FLOW.map((s, i) => (
                    <div key={s} className="flex items-center flex-1">
                      <div className={cn(
                        'h-1 flex-1 rounded-full transition-all',
                        ORDER_FLOW.indexOf(order.status) >= i ? 'bg-brand-500' : 'bg-surface-600'
                      )} />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  {ORDER_FLOW.map(s => <span key={s} className="capitalize">{s}</span>)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail Panel */}
        <div>
          {selectedOrder ? (
            <div className="glass-card-glow p-5 sticky top-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold text-foreground">Order Details</h3>
                <button onClick={() => setSelected(null)} className="btn-ghost p-1 rounded-md"><X size={16} /></button>
              </div>
              <div className="space-y-2 text-sm mb-4">
                {[
                  { l: 'Order ID', v: `#${selectedOrder.id.slice(0, 6).toUpperCase()}` },
                  { l: 'Customer', v: selectedOrder.customerName },
                  { l: 'Table', v: `Table ${selectedOrder.tableNumber}` },
                  { l: 'Status', v: STATUS_CONFIG[selectedOrder.status].label },
                  { l: 'Placed', v: timeAgo(selectedOrder.createdAt) },
                ].map(({ l, v }) => (
                  <div key={l} className="flex justify-between">
                    <span className="text-muted-foreground">{l}</span>
                    <span className="text-foreground font-medium">{v}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-surface-600 pt-3 mb-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Items Ordered</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-foreground">{item.quantity}× {item.name}</span>
                      <span className="text-muted-foreground">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="border-t border-surface-600 pt-2 flex justify-between font-semibold">
                    <span className="text-foreground">Total</span>
                    <span className="text-brand-400">{formatCurrency(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {selectedOrder.status !== 'served' && selectedOrder.status !== 'cancelled' && (
                  <button
                    onClick={() => { advance(selectedOrder.id, selectedOrder.status); setSelected(null); }}
                    className="btn-primary w-full text-sm flex items-center justify-center gap-2"
                  >
                    <CheckCheck size={15} />
                    Move to {ORDER_FLOW[ORDER_FLOW.indexOf(selectedOrder.status) + 1]}
                  </button>
                )}
                {selectedOrder.status !== 'served' && selectedOrder.status !== 'cancelled' && (
                  <button
                    onClick={() => { cancelOrder(selectedOrder.id); toast.error('Order cancelled'); setSelected(null); }}
                    className="w-full py-2 rounded-lg text-sm font-medium border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-card p-6 text-center text-muted-foreground sticky top-0">
              <Eye size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Select an order to view details and manage its status</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
