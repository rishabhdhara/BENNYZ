import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Package, User as UserIcon, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { formatPrice } from '../utils/formatters';

interface OrderItemRecord {
  id: string;
  product_name: string;
  fit: string;
  color_name: string;
  size: string;
  quantity: number;
  line_total: number;
}

interface OrderRecord {
  id: string;
  order_number: string;
  payment_method: string;
  payment_status: string;
  order_status: string;
  total: number;
  created_at: string;
  order_items: OrderItemRecord[];
}

export const Account: React.FC = () => {
  const { user, profile, loading, isSupabaseConfigured, signOut, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errDesc = params.get('error_description') || params.get('error');
    if (errDesc) {
      navigate(`/login?error_description=${encodeURIComponent(errDesc)}`, { replace: true });
      return;
    }

    if (!loading && !user) {
      navigate('/login?redirect=/account', { replace: true });
      return;
    }
    if (!loading && user) {
      try {
        const pendingRedirect = sessionStorage.getItem('bennyz_auth_redirect');
        if (pendingRedirect && pendingRedirect !== '/account') {
          sessionStorage.removeItem('bennyz_auth_redirect');
          navigate(pendingRedirect, { replace: true });
        }
      } catch {
        // ignore storage errors
      }
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setStreet(profile.default_address?.street || '');
      setCity(profile.default_address?.city || '');
      setStateName(profile.default_address?.state || '');
      setPinCode(profile.default_address?.pinCode || '');
    } else if (user) {
      setFullName((user.user_metadata?.full_name as string) || '');
      setPhone((user.user_metadata?.phone as string) || '');
    }
  }, [profile, user]);

  useEffect(() => {
    if (!supabase || !user) return;
    setOrdersLoading(true);
    supabase
      .from('orders')
      .select(
        'id, order_number, payment_method, payment_status, order_status, total, created_at, order_items (id, product_name, fit, color_name, size, quantity, line_total)'
      )
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) {
          setOrders(data as OrderRecord[]);
        }
        setOrdersLoading(false);
      });
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage(null);

    const res = await updateProfile({
      full_name: fullName.trim(),
      phone: phone.trim(),
      default_address: {
        street: street.trim(),
        city: city.trim(),
        state: stateName.trim(),
        pinCode: pinCode.trim(),
      },
    });

    setSaving(false);
    setSaveMessage(res.message || 'Saved.');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/', { replace: true });
  };

  if (!isSupabaseConfigured || loading || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center text-xs text-brand-secondary-text">
        {loading ? 'Loading account...' : 'Redirecting to sign in...'}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <div className="border-b border-brand-border pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-mocha block">
            BENNYZ Account
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-brand-black mt-1">
            {fullName || 'My Account'}
          </h1>
          <p className="text-xs text-brand-secondary-text mt-1">{user.email}</p>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex items-center gap-2 px-4 py-2.5 border border-brand-border bg-white text-xs uppercase tracking-[0.14em] text-brand-black hover:border-brand-black transition-colors self-start sm:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Saved Profile & Address */}
        <section className="lg:col-span-5 bg-white border border-brand-border p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-2 border-b border-brand-border pb-3">
            <UserIcon className="w-4 h-4 text-brand-mocha" />
            <h2 className="text-xs font-mono uppercase tracking-[0.16em] font-semibold text-brand-black">
              Profile &amp; Saved Address
            </h2>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-brand-secondary-text">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-brand-off-white border border-brand-border px-3 py-2 text-xs focus:outline-none focus:border-brand-black"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-brand-secondary-text">
                Mobile (+91)
              </label>
              <input
                type="tel"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-brand-off-white border border-brand-border px-3 py-2 text-xs focus:outline-none focus:border-brand-black"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-brand-secondary-text">
                Street Address
              </label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="House/Flat No., Street"
                className="w-full bg-brand-off-white border border-brand-border px-3 py-2 text-xs focus:outline-none focus:border-brand-black"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-brand-secondary-text">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-brand-off-white border border-brand-border px-3 py-2 text-xs focus:outline-none focus:border-brand-black"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-brand-secondary-text">
                  PIN Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-brand-off-white border border-brand-border px-3 py-2 text-xs font-mono focus:outline-none focus:border-brand-black"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-brand-secondary-text">
                State
              </label>
              <input
                type="text"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                placeholder="e.g. Karnataka"
                className="w-full bg-brand-off-white border border-brand-border px-3 py-2 text-xs focus:outline-none focus:border-brand-black"
              />
            </div>

            {saveMessage && (
              <div className="flex items-center gap-2 text-xs text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{saveMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-brand-black text-brand-ivory text-xs uppercase tracking-[0.15em] font-medium hover:bg-brand-mocha transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Details'}
            </button>
          </form>
        </section>

        {/* Order History */}
        <section className="lg:col-span-7 space-y-5">
          <div className="flex items-center justify-between border-b border-brand-border pb-3">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-brand-mocha" />
              <h2 className="text-xs font-mono uppercase tracking-[0.16em] font-semibold text-brand-black">
                Order History
              </h2>
            </div>
            <span className="text-xs font-mono text-brand-secondary-text">
              {orders.length} {orders.length === 1 ? 'order' : 'orders'}
            </span>
          </div>

          {ordersLoading ? (
            <div className="bg-white border border-brand-border p-8 text-xs text-brand-secondary-text">
              Loading your orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white border border-brand-border p-10 text-center space-y-4">
              <p className="text-sm font-medium text-brand-black">No orders placed yet</p>
              <p className="text-xs text-brand-secondary-text">
                Your confirmed UPI, card, net banking, and COD orders will appear here.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-black text-brand-ivory text-xs uppercase tracking-[0.15em] font-medium hover:bg-brand-mocha transition-colors"
              >
                <span>Shop T-Shirts</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white border border-brand-border p-5 sm:p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-border pb-3 text-xs">
                    <div>
                      <span className="font-mono font-semibold text-brand-black block">
                        {order.order_number}
                      </span>
                      <span className="text-[11px] text-brand-secondary-text">
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-mono uppercase">
                      <span className="px-2 py-0.5 bg-brand-ivory border border-brand-border text-brand-black">
                        {order.payment_method} · {order.payment_status}
                      </span>
                      <span className="px-2 py-0.5 bg-brand-black text-brand-ivory">
                        {order.order_status}
                      </span>
                    </div>
                  </div>

                  <div className="divide-y divide-brand-border/60 text-xs">
                    {order.order_items?.map((item) => (
                      <div key={item.id} className="py-2 flex justify-between gap-4">
                        <span className="text-brand-black">
                          {item.product_name}{' '}
                          <span className="text-brand-secondary-text">
                            ({item.color_name}, {item.size}) × {item.quantity}
                          </span>
                        </span>
                        <span className="font-medium text-brand-black shrink-0">
                          {formatPrice(item.line_total)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-brand-border flex justify-between items-center text-xs font-semibold text-brand-black">
                    <span>Order Total</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
