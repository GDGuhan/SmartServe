import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChefHat, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const DEMO_ACCOUNTS = [
  { label: 'Admin', email: 'admin@smartserve.com', password: 'any' },
  { label: 'Staff', email: 'staff@smartserve.com', password: 'any' },
  { label: 'Customer', email: 'customer@smartserve.com', password: 'any' },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      toast.success('Welcome back!');
      navigate('/');
    } else {
      toast.error(result.error ?? 'Login failed');
    }
  };

  const demoLogin = async (demoEmail: string) => {
    setLoading(true);
    const result = await login(demoEmail, 'demo');
    setLoading(false);
    if (result.success) {
      toast.success('Signed in with demo account');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-brand-900/40">
            <ChefHat size={28} className="text-surface-900" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-foreground">SmartServe</h1>
          <p className="text-muted-foreground mt-1 text-sm">Sign in to your account</p>
        </div>

        <div className="glass-card-glow p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 bg-surface-700 border border-surface-500 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 pr-10 bg-surface-700 border border-surface-500 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand-500 transition-colors"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
              {loading ? (
                <div className="w-4 h-4 border-2 border-surface-900/40 border-t-surface-900 rounded-full animate-spin" />
              ) : (
                <><LogIn size={16} /> Sign In</>
              )}
            </button>
          </form>

          <div className="mt-6">
            <p className="text-xs text-muted-foreground text-center mb-3">— Demo Accounts —</p>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_ACCOUNTS.map(acc => (
                <button
                  key={acc.label}
                  onClick={() => demoLogin(acc.email)}
                  disabled={loading}
                  className="py-2 px-3 rounded-lg bg-surface-700 border border-surface-500 text-xs font-medium text-foreground hover:bg-surface-600 hover:border-brand-500/40 transition-all"
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            No account?{' '}
            <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
