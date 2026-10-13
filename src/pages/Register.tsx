import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChefHat, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);
    if (result.success) {
      toast.success('Account created! Welcome to SmartServe.');
      navigate('/');
    } else {
      toast.error(result.error ?? 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-brand-900/40">
            <ChefHat size={28} className="text-surface-900" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Create Account</h1>
          <p className="text-muted-foreground mt-1 text-sm">Join SmartServe today</p>
        </div>

        <div className="glass-card-glow p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="John Smith"
                className="w-full px-4 py-2.5 bg-surface-700 border border-surface-500 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
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
                  placeholder="Min 6 characters"
                  className="w-full px-4 py-2.5 pr-10 bg-surface-700 border border-surface-500 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand-500 transition-colors"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-1.5">Confirm Password</label>
              <input
                type="password"
                required
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Re-enter password"
                className="w-full px-4 py-2.5 bg-surface-700 border border-surface-500 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
              {loading ? (
                <div className="w-4 h-4 border-2 border-surface-900/40 border-t-surface-900 rounded-full animate-spin" />
              ) : (
                <><UserPlus size={16} /> Create Account</>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
