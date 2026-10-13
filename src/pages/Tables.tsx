import { useState } from 'react';
import { Users, Check, Clock, Brush, Calendar, X, Plus } from 'lucide-react';
import { useTables } from '@/hooks/useTables';
import { MOCK_RESERVATIONS } from '@/constants/mockData';
import type { TableStatus, Reservation } from '@/types';
import { formatTime, formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const STATUS_CONFIG: Record<TableStatus, { label: string; color: string; bg: string; icon: typeof Check }> = {
  available: { label: 'Available', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', icon: Check },
  occupied: { label: 'Occupied', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', icon: Users },
  reserved: { label: 'Reserved', color: 'text-brand-400', bg: 'bg-brand-500/10 border-brand-500/30', icon: Calendar },
  cleaning: { label: 'Cleaning', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30', icon: Brush },
};

export default function Tables() {
  const { tables, updateTableStatus, resetTable } = useTables();
  const [selected, setSelected] = useState<string | null>(null);
  const [reservations] = useState<Reservation[]>(MOCK_RESERVATIONS);
  const [showReserveForm, setShowReserveForm] = useState(false);
  const [reserveData, setReserveData] = useState({ name: '', email: '', phone: '', partySize: 2, date: '', time: '', notes: '' });
  const [filter, setFilter] = useState<TableStatus | 'all'>('all');

  const counts = {
    all: tables.length,
    available: tables.filter(t => t.status === 'available').length,
    occupied: tables.filter(t => t.status === 'occupied').length,
    reserved: tables.filter(t => t.status === 'reserved').length,
    cleaning: tables.filter(t => t.status === 'cleaning').length,
  };

  const filtered = filter === 'all' ? tables : tables.filter(t => t.status === filter);
  const selectedTable = tables.find(t => t.id === selected);

  const handleStatusChange = (tableId: string, status: TableStatus) => {
    if (status === 'available') {
      resetTable(tableId);
    } else {
      updateTableStatus(tableId, status);
    }
    toast.success(`Table updated to ${status}`);
  };

  const handleReserve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    updateTableStatus(selected, 'reserved', { reservedBy: reserveData.name, reservedAt: `${reserveData.date}T${reserveData.time}:00` });
    toast.success(`Table ${selectedTable?.number} reserved for ${reserveData.name}`);
    setShowReserveForm(false);
    setSelected(null);
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(Object.entries(counts) as [string, number][]).filter(([k]) => k !== 'all').map(([status, count]) => {
          const cfg = STATUS_CONFIG[status as TableStatus];
          const Icon = cfg.icon;
          return (
            <button
              key={status}
              onClick={() => setFilter(filter === status ? 'all' : status as TableStatus)}
              className={cn('glass-card p-4 text-left transition-all border', filter === status ? cfg.bg : 'hover:border-surface-500')}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${filter === status ? cfg.bg : 'bg-surface-700'}`}>
                <Icon size={16} className={cfg.color} />
              </div>
              <p className="text-2xl font-bold font-heading text-foreground">{count}</p>
              <p className="text-xs text-muted-foreground">{cfg.label}</p>
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Table Grid */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-foreground">Floor Plan</h3>
            <span className="text-xs text-muted-foreground">{filtered.length} tables</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {filtered.map(table => {
              const cfg = STATUS_CONFIG[table.status];
              const Icon = cfg.icon;
              return (
                <button
                  key={table.id}
                  onClick={() => setSelected(selected === table.id ? null : table.id)}
                  className={cn(
                    'glass-card p-4 flex flex-col items-center gap-2 transition-all border hover:scale-105',
                    selected === table.id ? 'border-brand-500 bg-brand-500/5' : cfg.bg,
                    'cursor-pointer'
                  )}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selected === table.id ? 'bg-brand-500/20' : 'bg-surface-700'}`}>
                    <Icon size={18} className={cfg.color} />
                  </div>
                  <div className="text-center">
                    <p className="text-base font-bold font-heading text-foreground">T{table.number}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-0.5 justify-center">
                      <Users size={9} />{table.capacity}
                    </p>
                  </div>
                  <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', cfg.color, cfg.bg.split(' ')[0])}>
                    {cfg.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Panel */}
        <div className="space-y-4">
          {/* Selected Table Actions */}
          {selectedTable ? (
            <div className="glass-card-glow p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold text-foreground">Table {selectedTable.number}</h3>
                <button onClick={() => setSelected(null)} className="btn-ghost p-1 rounded-md"><X size={16} /></button>
              </div>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Capacity</span>
                  <span className="text-foreground font-medium">{selectedTable.capacity} guests</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className={STATUS_CONFIG[selectedTable.status].color + ' font-medium capitalize'}>{selectedTable.status}</span>
                </div>
                {selectedTable.reservedBy && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reserved by</span>
                    <span className="text-foreground font-medium">{selectedTable.reservedBy}</span>
                  </div>
                )}
                {selectedTable.reservedAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">At</span>
                    <span className="text-foreground font-medium">{formatTime(selectedTable.reservedAt)}</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Change Status</p>
                {(['available', 'occupied', 'cleaning'] as TableStatus[]).map(s => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(selectedTable.id, s)}
                    disabled={selectedTable.status === s}
                    className={cn(
                      'w-full py-2 rounded-lg text-sm font-medium transition-all border',
                      selectedTable.status === s
                        ? 'opacity-50 cursor-not-allowed bg-surface-700 border-surface-600 text-muted-foreground'
                        : 'bg-surface-700 border-surface-500 text-foreground hover:bg-surface-600'
                    )}
                  >
                    Mark {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
                {selectedTable.status === 'available' && (
                  <button onClick={() => setShowReserveForm(true)} className="btn-primary w-full text-sm flex items-center justify-center gap-2">
                    <Plus size={14} /> Make Reservation
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-card p-6 text-center text-muted-foreground">
              <Users size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Select a table to manage it</p>
            </div>
          )}

          {/* Upcoming Reservations */}
          <div className="glass-card p-5">
            <h3 className="font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
              <Calendar size={16} className="text-brand-400" /> Upcoming Reservations
            </h3>
            <div className="space-y-2">
              {reservations.map(r => (
                <div key={r.id} className="p-3 rounded-lg bg-surface-700 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{r.customerName}</p>
                    <p className="text-xs text-muted-foreground">{r.time} · Table {r.tableNumber} · {r.partySize} guests</p>
                    {r.notes && <p className="text-xs text-brand-400 mt-0.5 italic">{r.notes}</p>}
                  </div>
                  <span className={cn('status-badge flex-shrink-0 text-xs', r.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-brand-500/10 text-brand-400')}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reserve Modal */}
      {showReserveForm && selectedTable && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="glass-card p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg font-bold text-foreground">Reserve Table {selectedTable.number}</h3>
              <button onClick={() => setShowReserveForm(false)} className="btn-ghost p-1.5 rounded-md"><X size={16} /></button>
            </div>
            <form onSubmit={handleReserve} className="space-y-3">
              {[
                { id: 'name', label: 'Guest Name', type: 'text', required: true },
                { id: 'email', label: 'Email', type: 'email', required: false },
                { id: 'phone', label: 'Phone', type: 'tel', required: false },
              ].map(({ id, label, type, required }) => (
                <div key={id}>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">{label}</label>
                  <input
                    type={type}
                    required={required}
                    value={(reserveData as Record<string, string | number>)[id] as string}
                    onChange={e => setReserveData(p => ({ ...p, [id]: e.target.value }))}
                    className="w-full px-3 py-2 bg-surface-700 border border-surface-500 rounded-lg text-sm text-foreground focus:outline-none focus:border-brand-500 transition-colors"
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Date</label>
                  <input type="date" required value={reserveData.date} onChange={e => setReserveData(p => ({ ...p, date: e.target.value }))} className="w-full px-3 py-2 bg-surface-700 border border-surface-500 rounded-lg text-sm text-foreground focus:outline-none focus:border-brand-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Time</label>
                  <input type="time" required value={reserveData.time} onChange={e => setReserveData(p => ({ ...p, time: e.target.value }))} className="w-full px-3 py-2 bg-surface-700 border border-surface-500 rounded-lg text-sm text-foreground focus:outline-none focus:border-brand-500" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Party Size</label>
                <input type="number" min={1} max={selectedTable.capacity} value={reserveData.partySize} onChange={e => setReserveData(p => ({ ...p, partySize: +e.target.value }))} className="w-full px-3 py-2 bg-surface-700 border border-surface-500 rounded-lg text-sm text-foreground focus:outline-none focus:border-brand-500" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowReserveForm(false)} className="btn-secondary flex-1 text-sm">Cancel</button>
                <button type="submit" className="btn-primary flex-1 text-sm">Confirm Reservation</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
