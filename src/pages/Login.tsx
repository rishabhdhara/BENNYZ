import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BennyzLogo } from '../components/BennyzLogo';

export const Login: React.FC = () => {
  const { user, isSupabaseConfigured, signIn, signInWithGoogle, sendPasswordReset } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/account';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'reset'>('login');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      navigate(redirectPath, { replace: true });
    }
  }, [user, navigate, redirectPath]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);
    setSubmitting(true);

    const res = await signIn(email, password);
    setSubmitting(false);

    if (!res.success) {
      setError(res.message || 'Could not sign in.');
      return;
    }

    navigate(redirectPath, { replace: true });
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);
    setSubmitting(true);

    const res = await sendPasswordReset(email);
    setSubmitting(false);

    if (!res.success) {
      setError(res.message || 'Could not send reset email.');
      return;
    }

    setInfoMessage(res.message || 'Check your email for the password reset link.');
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    const res = await signInWithGoogle(redirectPath);
    if (!res.success) {
      setError(res.message || 'Could not initiate Google sign-in.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-6">
      <div className="space-y-3 text-center">
        <div className="flex justify-center">
          <BennyzLogo variant="dark" height={20} />
        </div>
        <h1 className="font-display text-3xl font-semibold text-brand-black">
          {mode === 'login' ? 'Sign In' : 'Reset Password'}
        </h1>
        <p className="text-xs text-brand-secondary-text">
          {mode === 'login'
            ? 'Access your saved shipping details and BENNYZ order history.'
            : 'Enter your registered email to receive a password reset link.'}
        </p>
      </div>

      {!isSupabaseConfigured && (
        <div className="bg-brand-ivory border border-brand-border p-4 flex items-start gap-3 text-xs">
          <Info className="w-4 h-4 text-brand-mocha shrink-0 mt-0.5" />
          <div className="space-y-1 text-brand-secondary-text leading-relaxed">
            <p className="font-mono uppercase tracking-[0.14em] text-[10px] font-semibold text-brand-black">
              Supabase Not Connected Yet
            </p>
            <p>
              Add <code className="font-mono text-brand-black">VITE_SUPABASE_URL</code> and{' '}
              <code className="font-mono text-brand-black">VITE_SUPABASE_ANON_KEY</code> to your{' '}
              <code className="font-mono text-brand-black">.env</code> / Vercel environment variables to activate live sign-in.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 p-3.5 flex items-start gap-2.5 text-xs text-red-900">
          <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {infoMessage && (
        <div className="bg-emerald-50 border border-emerald-200 p-3.5 flex items-start gap-2.5 text-xs text-emerald-950">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <span>{infoMessage}</span>
        </div>
      )}

      <div className="bg-white border border-brand-border p-6 sm:p-8 space-y-5">
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-brand-secondary-text block">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-brand-off-white border border-brand-border px-3.5 py-2.5 text-xs text-brand-black focus:outline-none focus:border-brand-black"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-brand-secondary-text">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setMode('reset');
                    setError(null);
                    setInfoMessage(null);
                  }}
                  className="text-[11px] text-brand-mocha hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-brand-off-white border border-brand-border px-3.5 py-2.5 text-xs text-brand-black focus:outline-none focus:border-brand-black"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !isSupabaseConfigured}
              className="w-full py-3.5 bg-brand-black text-brand-ivory text-xs uppercase tracking-[0.16em] font-semibold hover:bg-brand-mocha transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{submitting ? 'Signing In...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-brand-secondary-text block">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-brand-off-white border border-brand-border px-3.5 py-2.5 text-xs text-brand-black focus:outline-none focus:border-brand-black"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !isSupabaseConfigured}
              className="w-full py-3.5 bg-brand-black text-brand-ivory text-xs uppercase tracking-[0.16em] font-semibold hover:bg-brand-mocha transition-colors disabled:opacity-50"
            >
              {submitting ? 'Sending Link...' : 'Send Reset Link'}
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
                setInfoMessage(null);
              }}
              className="w-full text-xs text-brand-secondary-text hover:text-brand-black underline"
            >
              Back to Sign In
            </button>
          </form>
        )}

        {mode === 'login' && (
          <>
            <div className="relative flex items-center py-1">
              <div className="flex-grow border-t border-brand-border" />
              <span className="px-3 text-[10px] font-mono uppercase text-brand-secondary-text">
                or
              </span>
              <div className="flex-grow border-t border-brand-border" />
            </div>

            <button
              type="button"
              disabled={!isSupabaseConfigured}
              onClick={handleGoogleSignIn}
              className="w-full py-3 border border-brand-border bg-brand-off-white text-xs font-medium uppercase tracking-[0.14em] text-brand-black hover:border-brand-black transition-colors disabled:opacity-50"
            >
              Continue with Google
            </button>
          </>
        )}
      </div>

      <div className="text-center text-xs text-brand-secondary-text space-y-2">
        <p>
          New to BENNYZ?{' '}
          <Link
            to={`/register${redirectPath !== '/account' ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`}
            className="text-brand-black font-semibold underline underline-offset-4 hover:text-brand-mocha"
          >
            Create an account
          </Link>
        </p>
        <p>
          <Link to="/checkout" className="text-[11px] hover:text-brand-black underline">
            Continue as guest to checkout
          </Link>
        </p>
      </div>
    </div>
  );
};
