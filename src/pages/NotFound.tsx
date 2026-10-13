import { Link } from 'react-router-dom';
import { ChefHat, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500/20 to-brand-700/20 border border-brand-500/20 flex items-center justify-center mx-auto mb-6">
          <ChefHat size={36} className="text-brand-400" />
        </div>
        <h1 className="font-heading text-7xl font-bold gradient-text mb-4">404</h1>
        <h2 className="font-heading text-2xl font-semibold text-foreground mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
          This dish is not on the menu. The page you were looking for doesn't exist.
        </p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <Home size={16} /> Back to Home
        </Link>
      </div>
    </div>
  );
}
