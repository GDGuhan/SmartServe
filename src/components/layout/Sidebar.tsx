import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, UtensilsCrossed, Table2, ClipboardList,
  MessageSquare, Home, X, LogOut, ChefHat, Settings
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/menu', label: 'Menu', icon: UtensilsCrossed },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, adminOnly: true },
  { to: '/tables', label: 'Tables', icon: Table2, staffOnly: true },
  { to: '/orders', label: 'Orders', icon: ClipboardList, staffOnly: true },
  { to: '/feedback', label: 'Feedback', icon: MessageSquare },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const visibleItems = navItems.filter(item => {
    if (item.adminOnly) return user?.role === 'admin';
    if (item.staffOnly) return user?.role === 'admin' || user?.role === 'staff';
    return true;
  });

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-surface-800 border-r border-surface-600 flex flex-col transition-transform duration-300 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-surface-600">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-900/40">
              <ChefHat size={18} className="text-surface-900" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-lg text-foreground leading-none">SmartServe</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Restaurant OS</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden btn-ghost p-1.5 rounded-md">
            <X size={18} />
          </button>
        </div>

        {/* User */}
        {user && (
          <div className="mx-4 mt-4 p-3 rounded-lg bg-surface-700 border border-surface-500">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-surface-900 font-bold text-sm">
                {user.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                <p className="text-xs text-brand-400 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3 px-2">Navigation</p>
          {visibleItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                cn('nav-link', isActive && 'active')
              }
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-surface-600 space-y-1">
          {user ? (
            <button onClick={handleLogout} className="nav-link w-full text-left text-red-400 hover:text-red-300 hover:bg-red-500/10">
              <LogOut size={18} />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          ) : (
            <NavLink to="/login" onClick={onClose} className="nav-link">
              <Settings size={18} />
              <span className="text-sm font-medium">Sign In</span>
            </NavLink>
          )}
        </div>
      </aside>
    </>
  );
}
