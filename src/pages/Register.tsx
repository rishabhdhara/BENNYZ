import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BennyzLogo } from '../components/BennyzLogo';

export const Register: React.FC = () => {
  const { user, isSupabaseConfigured, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/account';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      navigate(redirectPath, { replace: true });
    }
  }, [user, navigate, redirectPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (phone && phone.length !== 10) {
      setError('Enter a valid 10-digit Indian mobile number or leave it blank.');
      return;
    }

    setSubmitting(true);
    const res = await signUp({ fullName, email, password, phone });
    setSubmitting(false);

    if (!res.success) {
      setError(res.message || 'Could not create account.');
      return;
    }

    if (res.needsEmailConfirmation) {
      setSuccessMessage(
        res.message || 'Account created. Check your email to verify your address before signing in.'
      );
      return;
    }

    navigate(redirectPath, { replace: true });
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    const res = await signInWithGoogle(redirectPath);
    if (!res.success) {
      setError(res.message || 'Could not initiate Google sign-up.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-6">
      <div className="space-y-3 text-center">
        <div className="flex justify-center">
          <BennyzLogo variant="dark" height={20} />
        </div>
        <h1 className="font-display text-3xl font-semibold text-brand-black">
          Create Account
        </h1>
        <p className="text-xs text-brand-secondary-text">
          Save your delivery details and track your BENNYZ T-shirt orders.
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
              <code className="font-mono text-brand-black">VITE_SUPABASE_ANON_KEY</code> to enable account registration.
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

      {successMessage ? (
        <div className="bg-white border border-brand-border p-6 sm:p-8 text-center space-y-4">
          <CheckCircle2 className="w-9 h-9 text-emerald-700 mx-auto" />
          <h2 className="font-display text-xl font-semibold text-brand-black">
            Verify Your Email
          </h2>
          <p className="text-xs text-brand-secondary-text leading-relaxed">{successMessage}</p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-black text-brand-ivory text-xs uppercase tracking-[0.15em] font-medium"
          >
            <span>Go to Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-brand-border p-6 sm:p-8 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-brand-secondary-text block">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                className="w-full bg-brand-off-white border border-brand-border px-3.5 py-2.5 text-xs text-brand-black focus:outline-none focus:border-brand-black"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-brand-secondary-text block">
                Email Address *
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
              <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-brand-secondary-text block">
                Mobile Number (Optional)
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-xs bg-brand-ivory border border-r-0 border-brand-border text-brand-black font-mono">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="10-digit number"
                  className="w-full bg-brand-off-white border border-brand-border px-3.5 py-2.5 text-xs text-brand-black focus:outline-none focus:border-brand-black"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-brand-secondary-text block">
                Password *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full bg-brand-off-white border border-brand-border px-3.5 py-2.5 text-xs text-brand-black focus:outline-none focus:border-brand-black"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-brand-secondary-text block">
                Confirm Password *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full bg-brand-off-white border border-brand-border px-3.5 py-2.5 text-xs text-brand-black focus:outline-none focus:border-brand-black"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !isSupabaseConfigured}
              className="w-full py-3.5 bg-brand-black text-brand-ivory text-xs uppercase tracking-[0.16em] font-semibold hover:bg-brand-mocha transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{submitting ? 'Creating Account...' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

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
            onClick={handleGoogleSignUp}
            className="w-full py-3 border border-brand-border bg-brand-off-white text-xs font-medium uppercase tracking-[0.14em] text-brand-black hover:border-brand-black transition-colors disabled:opacity-50"
          >
            Continue with Google
          </button>
        </div>
      )}

      <p className="text-center text-xs text-brand-secondary-text">
        Already have an account?{' '}
        <Link
          to={`/login${redirectPath !== '/account' ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`}
          className="text-brand-black font-semibold underline underline-offset-4 hover:text-brand-mocha"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};
