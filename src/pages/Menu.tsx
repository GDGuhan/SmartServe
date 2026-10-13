import { useState } from 'react';
import { Search, QrCode, ShoppingCart, Plus, Minus, X, Star, Clock, Flame, Check } from 'lucide-react';
import { MOCK_MENU_ITEMS } from '@/constants/mockData';
import type { MenuCategory, MenuItem, OrderItem } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

const CATEGORIES: { key: MenuCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All Items' },
  { key: 'specials', label: '★ Specials' },
  { key: 'starters', label: 'Starters' },
  { key: 'mains', label: 'Mains' },
  { key: 'desserts', label: 'Desserts' },
  { key: 'beverages', label: 'Beverages' },
];

interface CartItem extends OrderItem { }

export default function Menu() {
  const [category, setCategory] = useState<MenuCategory | 'all'>('all');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [ordered, setOrdered] = useState(false);

  const filtered = MOCK_MENU_ITEMS.filter(item => {
    const matchCat = category === 'all' || item.category === category;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.menuItemId === item.id);
      if (existing) {
        return prev.map(c => c.menuItemId === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { menuItemId: item.id, name: item.name, quantity: 1, price: item.price }];
    });
    toast.success(`${item.name} added to cart`);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const existing = prev.find(c => c.menuItemId === id);
      if (existing && existing.quantity > 1) {
        return prev.map(c => c.menuItemId === id ? { ...c, quantity: c.quantity - 1 } : c);
      }
      return prev.filter(c => c.menuItemId !== id);
    });
  };

  const cartTotal = cart.reduce((s, c) => s + c.price * c.quantity, 0);
  const cartCount = cart.reduce((s, c) => s + c.quantity, 0);

  const placeOrder = () => {
    if (cart.length === 0) return;
    setOrdered(true);
    setTimeout(() => {
      setCart([]);
      setCartOpen(false);
      setOrdered(false);
      toast.success('Order placed successfully! The kitchen has been notified.');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Our Menu</h1>
          <p className="text-sm text-muted-foreground mt-1">Scan a QR code or browse and order directly</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowQR(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-700 border border-surface-500 text-sm text-foreground hover:bg-surface-600 transition-colors"
          >
            <QrCode size={16} className="text-brand-400" />
            QR Code
          </button>
          <button
            onClick={() => setCartOpen(true)}
            className="relative btn-primary flex items-center gap-2 text-sm"
          >
            <ShoppingCart size={16} />
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search dishes..."
          className="w-full pl-10 pr-4 py-2.5 bg-surface-700 border border-surface-500 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand-500 transition-colors"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setCategory(key)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              category === key
                ? 'bg-brand-500 text-surface-900'
                : 'bg-surface-700 text-muted-foreground hover:text-foreground border border-surface-500'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(item => {
          const inCart = cart.find(c => c.menuItemId === item.id);
          return (
            <div key={item.id} className={`glass-card overflow-hidden group transition-all duration-300 hover:border-surface-500 ${!item.available ? 'opacity-60' : ''}`}>
              <div className="relative h-44 overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-900/80 to-transparent" />
                {!item.available && (
                  <div className="absolute inset-0 bg-surface-900/70 flex items-center justify-center">
                    <span className="text-sm font-semibold text-muted-foreground bg-surface-800 px-3 py-1 rounded-full">Unavailable</span>
                  </div>
                )}
                {item.tags?.includes('special') && (
                  <div className="absolute top-2 left-2 bg-brand-500 text-surface-900 text-xs font-bold px-2 py-0.5 rounded-full">SPECIAL</div>
                )}
                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                  <span className="text-xl font-bold text-white font-heading">{formatCurrency(item.price)}</span>
                  {item.rating && (
                    <span className="flex items-center gap-1 text-xs text-brand-300 bg-surface-900/80 px-2 py-0.5 rounded-full">
                      <Star size={10} className="fill-brand-400 text-brand-400" /> {item.rating}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-heading font-semibold text-foreground mb-1">{item.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">{item.description}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1"><Clock size={11} />{item.preparationTime}m</span>
                  {item.calories && <span className="flex items-center gap-1"><Flame size={11} />{item.calories} cal</span>}
                  {item.tags?.slice(0, 2).map(tag => (
                    <span key={tag} className="px-1.5 py-0.5 bg-surface-600 rounded text-xs">{tag}</span>
                  ))}
                </div>
                {item.available && (
                  <div className="flex items-center gap-2">
                    {inCart ? (
                      <div className="flex items-center gap-2 flex-1">
                        <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 rounded-lg bg-surface-600 hover:bg-surface-500 flex items-center justify-center text-foreground transition-colors">
                          <Minus size={14} />
                        </button>
                        <span className="flex-1 text-center text-sm font-semibold text-foreground">{inCart.quantity}</span>
                        <button onClick={() => addToCart(item)} className="w-8 h-8 rounded-lg bg-brand-500 hover:bg-brand-600 flex items-center justify-center text-surface-900 transition-colors">
                          <Plus size={14} />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => addToCart(item)} className="flex-1 btn-primary text-xs py-2 flex items-center justify-center gap-1.5">
                        <Plus size={13} /> Add to Order
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Search size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No items found</p>
          <p className="text-sm mt-1">Try a different search or category</p>
        </div>
      )}

      {/* QR Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setShowQR(false)}>
          <div className="glass-card p-8 max-w-sm w-full text-center" onClick={e => e.stopPropagation()}>
            <h3 className="font-heading text-xl font-bold text-foreground mb-2">QR Menu Access</h3>
            <p className="text-sm text-muted-foreground mb-6">Scan to browse and order from your phone</p>
            <div className="w-48 h-48 mx-auto bg-white p-4 rounded-xl mb-6 flex items-center justify-center">
              <div className="grid grid-cols-7 gap-0.5 w-full h-full">
                {Array.from({ length: 49 }).map((_, i) => (
                  <div key={i} className={`rounded-sm ${Math.random() > 0.5 ? 'bg-surface-900' : 'bg-white'}`} />
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-4">smartserve.app/menu/table/[number]</p>
            <button onClick={() => setShowQR(false)} className="btn-primary w-full">Close</button>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex justify-end" onClick={() => setCartOpen(false)}>
          <div className="w-full max-w-md bg-surface-800 border-l border-surface-600 flex flex-col h-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-surface-600">
              <h3 className="font-heading text-xl font-bold text-foreground">Your Order</h3>
              <button onClick={() => setCartOpen(false)} className="btn-ghost p-1.5 rounded-md"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <ShoppingCart size={40} className="mx-auto mb-3 opacity-30" />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.menuItemId} className="glass-card p-4 flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{formatCurrency(item.price)} each</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => removeFromCart(item.menuItemId)} className="w-7 h-7 rounded-md bg-surface-600 hover:bg-surface-500 flex items-center justify-center">
                        <Minus size={12} />
                      </button>
                      <span className="w-6 text-center text-sm font-bold text-foreground">{item.quantity}</span>
                      <button onClick={() => addToCart(MOCK_MENU_ITEMS.find(m => m.id === item.menuItemId)!)} className="w-7 h-7 rounded-md bg-brand-500 hover:bg-brand-600 flex items-center justify-center text-surface-900">
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-brand-400 w-16 text-right">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="p-4 border-t border-surface-600 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold text-foreground">{formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span className="font-semibold text-foreground">{formatCurrency(cartTotal * 0.08)}</span>
                </div>
                <div className="flex justify-between border-t border-surface-600 pt-3">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-bold text-brand-400 text-lg">{formatCurrency(cartTotal * 1.08)}</span>
                </div>
                <button onClick={placeOrder} disabled={ordered} className="btn-primary w-full flex items-center justify-center gap-2">
                  {ordered ? <><Check size={16} /> Order Placed!</> : 'Place Order'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
