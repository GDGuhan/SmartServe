import { Menu, Bell, QrCode } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const pageTitles: Record<string, string> = {
  '/': 'Welcome',
  '/menu': 'Our Menu',
  '/dashboard': 'Admin Dashboard',
  '/tables': 'Table Management',
  '/orders': 'Order Management',
  '/feedback': 'Customer Feedback',
};

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const location = useLocation();
  const { user } = useAuth();
  const title = pageTitles[location.pathname] ?? 'SmartServe';

  return (
    <header className="h-16 bg-surface-800 border-b border-surface-600 flex items-center justify-between px-4 md:px-6 flex-shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-700 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Menu size={20} />
        </button>
        <div>
          <h2 className="font-heading font-semibold text-lg text-foreground leading-none">{title}</h2>
          <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link
          to="/menu"
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-400 hover:bg-brand-500/20 transition-colors text-sm font-medium"
        >
          <QrCode size={15} />
          <span>QR Menu</span>
        </Link>
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-700 text-muted-foreground hover:text-foreground transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full" />
        </button>
        {user && (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-surface-900 font-bold text-sm cursor-default">
            {user.name.charAt(0)}
          </div>
        )}
        {!user && (
          <Link to="/login" className="btn-primary text-sm py-1.5 px-4">Sign In</Link>
        )}
      </div>
    </header>
  );
}
