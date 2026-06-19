import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { LogIn, UserPlus, Ticket, Eye, EyeOff, Film } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { redeemAPI } from '../lib/firebase';

export default function LoginPage() {
  const { login, register, user, isDemo } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [redeemCode, setRedeemCode] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [redeemMsg, setRedeemMsg] = useState('');
  const [redirectToHome, setRedirectToHome] = useState(false);

  // If already logged in, redirect via Navigate component
  // Note: logged-in users can redeem codes from admin panel or navbar dropdown
  if (redirectToHome || user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        if (!displayName.trim()) { setError('Display name required'); setLoading(false); return; }
        await register(email, password, displayName);
      }
      setRedirectToHome(true);
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async () => {
    const uid = isDemo ? 'demo-user' : null;
    if (!uid) {
      setError('Login or use demo mode to redeem a code');
      return;
    }
    setRedeemMsg('');
    setError('');
    try {
      const result = await redeemAPI.redeemCode(redeemCode.trim(), uid);
      setRedeemMsg(result.message);
    } catch (err: any) {
      setError(err.message || 'Failed to redeem code');
    }
  };

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center mx-auto mb-3 shadow-lg shadow-primary/20">
            <Film className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">
            <span className="text-gradient">Ani</span>Stream
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            {isDemo ? '🔧 Demo Mode - Try any email/password' : ''}
          </p>
        </div>

        {/* Tab buttons */}
        <div className="flex gap-1 bg-dark-700/50 rounded-xl p-1 mb-6">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mode === 'login' ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <LogIn className="w-4 h-4" />
            Login
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mode === 'register' ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-effect rounded-xl p-6 space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                className="w-full bg-dark-700/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary/50 transition-all"
                placeholder="Your name"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-dark-700/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary/50 transition-all"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-dark-700/50 border border-white/5 rounded-xl px-4 py-2.5 pr-10 text-sm text-text-primary focus:outline-none focus:border-primary/50 transition-all"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text-primary"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-medium transition-all disabled:opacity-50"
          >
            {loading ? 'Loading...' : mode === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>

        {/* Redeem Code */}
        <div className="mt-4 glass-effect rounded-xl p-6">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-3">
            <Ticket className="w-4 h-4 text-primary" />
            Redeem Code
          </h3>
          <p className="text-xs text-text-secondary mb-3">
            {isDemo ? 'Demo mode active - enter code to test' : 'Login first or use demo mode, then enter your code below'}
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={redeemCode}
              onChange={e => setRedeemCode(e.target.value.toUpperCase())}
              className="flex-1 bg-dark-700/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary/50 transition-all uppercase"
              placeholder="ENTER CODE"
            />
            <button
              onClick={handleRedeem}
              className="px-4 py-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all text-sm font-medium"
            >
              Redeem
            </button>
          </div>
          {redeemMsg && (
            <p className="mt-2 text-sm text-green-400">{redeemMsg}</p>
          )}
        </div>

        {/* Demo info */}
        {isDemo && (
          <div className="mt-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs">
            🔧 <strong>Demo Mode Active</strong><br />
            Firebase not configured. All data is stored in memory.<br />
            Demo accounts: <code className="bg-dark-700 px-1 rounded">admin@anistream.demo</code> or <code className="bg-dark-700 px-1 rounded">user@anistream.demo</code><br />
            Demo codes: <code className="bg-dark-700 px-1 rounded">ADMIN2024</code> (admin) or <code className="bg-dark-700 px-1 rounded">VIP2024</code> (vip)
          </div>
        )}
      </div>
    </div>
  );
}
