import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';
import { ProductSize } from '../types';
import { ShoppingBag, ArrowRight, Check, Tag } from 'lucide-react';

export const Cart: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    updateItemVariant,
    clearCart,
    subtotal,
    discount,
    discountCode,
    applyDiscountCode,
    removeDiscountCode,
    shippingFee,
    freeShippingThreshold,
    total,
    totalItemsCount,
  } = useCart();

  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyDiscountCode(promoInput);
    setPromoFeedback(res);
    if (res.success) setPromoInput('');
  };

  const amountNeeded = Math.max(0, freeShippingThreshold - (subtotal - discount));
  const shippingProgress = Math.min(100, Math.round(((subtotal - discount) / freeShippingThreshold) * 100));
  const standardSizes: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <div className="border-b border-brand-border pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-mocha block">
            BENNYZ Bag
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-brand-black mt-1">
            Shopping Bag ({totalItemsCount})
          </h1>
        </div>
        <Link to="/shop" className="text-xs uppercase tracking-[0.14em] text-brand-black hover:underline">
          Continue Shopping
        </Link>
      </div>

      {cart.length === 0 ? (
        <div className="py-20 text-center bg-white border border-brand-border p-8 space-y-4">
          <ShoppingBag className="w-8 h-8 stroke-[1] text-brand-secondary-text mx-auto" />
          <h2 className="font-display text-2xl font-semibold text-brand-black">
            Your shopping bag is empty
          </h2>
          <p className="text-xs text-brand-secondary-text max-w-sm mx-auto">
            Browse our oversized, boxy, and regular-fit men&apos;s T-shirts to get started.
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-black text-brand-ivory text-xs font-semibold tracking-[0.15em] uppercase hover:bg-brand-mocha transition-colors"
            >
              <span>Shop T-Shirts</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Items Column */}
          <div className="lg:col-span-8 space-y-5">
            <div className="p-4 bg-brand-ivory/60 border border-brand-border space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-brand-black">
                  {amountNeeded === 0 ? (
                    <span className="text-emerald-800 flex items-center gap-1.5">
                      <Check className="w-4 h-4" /> Free shipping unlocked
                    </span>
                  ) : (
                    <span>
                      Add <strong>{formatPrice(amountNeeded)}</strong> more for free shipping
                    </span>
                  )}
                </span>
                <span className="text-[11px] font-mono text-brand-secondary-text">{shippingProgress}%</span>
              </div>
              <div className="w-full bg-brand-border h-1 overflow-hidden">
                <div
                  className="bg-brand-black h-full transition-all duration-500"
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
            </div>

            <div className="bg-white border border-brand-border divide-y divide-brand-border">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5"
                >
                  <div className="flex items-center gap-4">
                    <Link to={`/product/${item.slug}`} className="w-20 h-24 shrink-0 border border-brand-border overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                    <div className="space-y-1">
                      <Link
                        to={`/product/${item.slug}`}
                        className="text-sm font-semibold text-brand-black hover:text-brand-mocha transition-colors"
                      >
                        {item.name}
                      </Link>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-brand-secondary-text">
                        <span className="flex items-center gap-1">
                          <span
                            className="w-2.5 h-2.5 rounded-full inline-block border border-black/15"
                            style={{ backgroundColor: item.color.hex }}
                          />
                          {item.color.name}
                        </span>
                        <span>•</span>
                        <span>{item.fit} Fit</span>
                        <span>•</span>
                        <label className="flex items-center gap-1">
                          <span>Size:</span>
                          <select
                            value={item.size}
                            onChange={(e) =>
                              updateItemVariant(item.id, e.target.value as ProductSize, item.color)
                            }
                            className="bg-transparent border border-brand-border text-xs py-0.5 px-1 font-mono font-semibold text-brand-black"
                          >
                            {standardSizes.map((sz) => (
                              <option key={sz} value={sz}>{sz}</option>
                            ))}
                          </select>
                        </label>
                      </div>
                      <p className="text-xs font-medium text-brand-black pt-1">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end sm:gap-8 pt-2 sm:pt-0 border-t sm:border-0 border-brand-border/60">
                    <div className="flex items-center border border-brand-border bg-white">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-xs text-brand-black hover:bg-brand-ivory"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-mono">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-xs text-brand-black hover:bg-brand-ivory"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-semibold text-brand-black block">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-[11px] text-brand-secondary-text hover:text-red-700 underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-xs text-brand-secondary-text">
              <button type="button" onClick={clearCart} className="underline hover:text-brand-black">
                Clear Bag
              </button>
              <span>Prices include taxes.</span>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-4 bg-white border border-brand-border p-6 sm:p-8 space-y-6 sticky top-24">
            <h2 className="font-display text-xl font-semibold text-brand-black border-b border-brand-border pb-3">
              Order Summary
            </h2>

            <div className="space-y-2">
              {discountCode ? (
                <div className="flex items-center justify-between bg-brand-ivory border border-brand-border px-3 py-2 text-xs">
                  <span className="flex items-center gap-1.5 font-medium text-brand-black">
                    <Tag className="w-3.5 h-3.5 text-brand-mocha" />
                    <span>{discountCode} applied</span>
                  </span>
                  <button
                    type="button"
                    onClick={removeDiscountCode}
                    className="text-[11px] underline text-brand-secondary-text hover:text-brand-black"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Promo code (e.g. EVERYDAY10)"
                    className="flex-1 bg-brand-off-white border border-brand-border px-3 py-2 text-xs focus:outline-none focus:border-brand-black"
                  />
                  <button
                    type="submit"
                    className="px-4 bg-brand-black text-brand-ivory text-xs uppercase tracking-[0.14em]"
                  >
                    Apply
                  </button>
                </form>
              )}
              {promoFeedback && (
                <p className={`text-[10px] ${promoFeedback.success ? 'text-emerald-700' : 'text-red-700'}`}>
                  {promoFeedback.message}
                </p>
              )}
            </div>

            <div className="space-y-2.5 text-xs text-brand-secondary-text">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-brand-black">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-800">
                  <span>Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span>{shippingFee === 0 ? 'Free' : formatPrice(shippingFee)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-brand-border text-base font-semibold text-brand-black">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-brand-black text-brand-ivory text-xs tracking-[0.16em] uppercase font-semibold hover:bg-brand-mocha transition-colors flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
