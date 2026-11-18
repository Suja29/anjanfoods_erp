import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Factory, Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const DEMO_ACCOUNTS = [
  { label: 'Admin', email: 'admin@anjanfoods.in', password: 'AnjanAdmin#2026' },
  { label: 'Sales', email: 'sales@anjanfoods.in', password: 'AnjanSales#2026' },
  { label: 'Production', email: 'production@anjanfoods.in', password: 'AnjanProd#2026' },
  { label: 'Owner', email: 'owner@anjanfoods.in', password: 'AnjanOwner#2026' },
  { label: 'Accountant', email: 'accounts@anjanfoods.in', password: 'AnjanAccts#2026' },
];

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { session, loading } = useAuth();
  useEffect(() => {
    if (!loading && session) navigate('/dashboard', { replace: true });
  }, [session, loading, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: signInError } = await signIn(email.trim(), password);
    setSubmitting(false);
    if (signInError) {
      setError(signInError);
      return;
    }
    navigate('/dashboard');
  }

  function quickFill(acc: { email: string; password: string }) {
    setEmail(acc.email);
    setPassword(acc.password);
    setError(null);
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Brand panel */}
      <div className="lg:w-1/2 bg-gradient-to-br from-navy-900 via-navy-800 to-primary-900 text-white p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
              <Factory className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Anjan Foods</h1>
              <p className="text-xs text-blue-200/80">Order-to-Audit Management System</p>
            </div>
          </div>
        </div>
        <div className="relative my-12 lg:my-0">
          <h2 className="text-3xl lg:text-4xl font-bold leading-tight">
            South Indian<br />Packaged Food Manufacturing<br />ERP
          </h2>
          <p className="mt-4 text-blue-200/80 max-w-md text-sm leading-relaxed">
            Integrated workflow from sales orders to audit — covering production,
            inventory, GST invoicing, dispatch, payments, and financial reporting.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 max-w-md">
            {['Sales & GST', 'Production & BOM', 'Inventory Control', 'Audit & Reports'].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-blue-100/90">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                {f}
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-xs text-blue-200/60">Manufacturing ERP platform — Murukku, Mixture, Banana Chips, Sweets</p>
      </div>

      {/* Login form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-slate-50">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-navy-900">Welcome back</h2>
          <p className="text-sm text-navy-400 mt-1">Sign in to your ERP account to continue.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="label" htmlFor="email">Email address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-9"
                  placeholder="you@anjanfoods.in"
                  autoComplete="email"
                />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="password">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-9 pr-9"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" disabled={submitting} className="btn-primary w-full py-2.5">
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="mt-8">
            <p className="text-xs font-semibold text-navy-500 uppercase tracking-wider mb-2">Demo Accounts</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => quickFill(acc)}
                  className="flex items-center justify-between px-3 py-2 rounded-lg border border-slate-200 bg-white hover:border-primary-300 hover:bg-primary-50/40 transition-all text-left group"
                >
                  <div>
                    <p className="text-sm font-medium text-navy-800">{acc.label}</p>
                    <p className="text-xs text-navy-400">{acc.email}</p>
                  </div>
                  <span className="text-xs text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">Use →</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-navy-400 mt-3">Click a role to autofill credentials, then press Sign in.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
