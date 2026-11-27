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
          <BennyzLogo variant="dark" height={34} />
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
            className="w-full py-3 border border-brand-border bg-brand-off-white text-xs font-medium uppercase tracking-[0.14em] text-brand-black hover:border-brand-black transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2.5"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.3 0 6.08-1.09 8.1-2.96l-3.88-3.05c-1.08.72-2.46 1.15-4.22 1.15-3.24 0-5.99-2.19-6.97-5.14H1.02v3.14C3.03 21.14 7.18 24 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.03 14c-.25-.74-.39-1.54-.39-2.36 0-.82.14-1.62.39-2.36V6.14H1.02A11.98 11.98 0 0 0 0 11.64c0 1.93.46 3.75 1.02 5.5L5.03 14Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.8 0 3.41.62 4.68 1.84l3.51-3.51C18.07 1.19 15.3 0 12 0 7.18 0 3.03 2.86 1.02 6.14l4.01 3.14C6.01 6.94 8.76 4.75 12 4.75Z"
              />
            </svg>
            <span>Continue with Google</span>
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
