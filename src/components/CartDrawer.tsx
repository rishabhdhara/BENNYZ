import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag, ArrowRight, Check, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';
import { ProductSize } from '../types';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    removeFromCart,
    updateQuantity,
    updateItemVariant,
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

  if (!isCartDrawerOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyDiscountCode(promoInput);
    setPromoFeedback(res);
    if (res.success) setPromoInput('');
  };

  const handleCheckoutClick = () => {
    setIsCartDrawerOpen(false);
    navigate('/checkout');
  };

  const amountNeeded = Math.max(0, freeShippingThreshold - (subtotal - discount));
  const shippingProgress = Math.min(100, Math.round(((subtotal - discount) / freeShippingThreshold) * 100));
  const standardSizes: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-brand-black/60 transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-8">
        <div className="w-screen max-w-md bg-brand-off-white shadow-2xl flex flex-col justify-between border-l border-brand-border">
          {/* Header */}
          <div className="px-6 py-4 border-b border-brand-border flex items-center justify-between bg-brand-light">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
              <h2 className="text-xs font-semibold tracking-[0.16em] uppercase text-brand-black">
                Shopping Bag ({totalItemsCount})
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1 text-brand-black/70 hover:text-brand-black transition-colors"
              aria-label="Close shopping bag"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          {/* Shipping Progress */}
          <div className="bg-brand-ivory/60 px-6 py-3 border-b border-brand-border">
            <div className="flex justify-between items-center text-[11px] mb-1.5">
              <span className="text-brand-black font-medium">
                {amountNeeded === 0 ? (
                  <span className="text-emerald-800 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Free shipping unlocked
                  </span>
                ) : (
                  <span>
                    Add <strong>{formatPrice(amountNeeded)}</strong> more for free shipping
                  </span>
                )}
              </span>
              <span className="text-brand-secondary-text text-[10px] font-mono">{shippingProgress}%</span>
            </div>
            <div className="w-full bg-brand-border h-1 overflow-hidden">
              <div
                className="bg-brand-black h-full transition-all duration-500"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-brand-border">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                <ShoppingBag className="w-8 h-8 stroke-[1] text-brand-secondary-text" />
                <div className="space-y-1">
                  <h3 className="font-display text-lg font-medium text-brand-black">
                    Your bag is empty
                  </h3>
                  <p className="text-xs text-brand-secondary-text max-w-xs">
                    Explore oversized, boxy, regular, minimal, and graphic T-shirts built for your everyday.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigate('/shop');
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-black text-brand-ivory text-xs tracking-[0.14em] uppercase font-medium hover:bg-brand-mocha transition-colors"
                >
                  <span>Shop T-Shirts</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="py-4 flex gap-4">
                  <Link
                    to={`/product/${item.slug}`}
                    onClick={() => setIsCartDrawerOpen(false)}
                    className="w-20 h-24 bg-brand-ivory shrink-0 overflow-hidden border border-brand-border"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </Link>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <Link
                          to={`/product/${item.slug}`}
                          onClick={() => setIsCartDrawerOpen(false)}
                          className="text-xs font-medium text-brand-black hover:text-brand-mocha transition-colors line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-brand-secondary-text hover:text-red-700 transition-colors"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-brand-secondary-text">
                        <span className="flex items-center gap-1">
                          <span
                            className="inline-block w-2.5 h-2.5 rounded-full border border-black/15"
                            style={{ backgroundColor: item.color.hex }}
                          />
                          {item.color.name}
                        </span>
                        <span>•</span>
                        <label className="flex items-center gap-1">
                          <span>Size</span>
                          <select
                            value={item.size}
                            onChange={(e) =>
                              updateItemVariant(item.id, e.target.value as ProductSize, item.color)
                            }
                            className="bg-white border border-brand-border text-[11px] py-0 px-1 font-mono text-brand-black focus:outline-none"
                          >
                            {standardSizes.map((sz) => (
                              <option key={sz} value={sz}>
                                {sz}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-brand-border bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-xs text-brand-black hover:bg-brand-ivory"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="w-7 text-center text-xs font-mono">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-xs text-brand-black hover:bg-brand-ivory"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-semibold text-brand-black">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-brand-border bg-brand-light space-y-4">
              <div className="space-y-1.5">
                {discountCode ? (
                  <div className="flex items-center justify-between bg-brand-ivory border border-brand-border px-3 py-1.5 text-xs">
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
                      className="flex-1 bg-white border border-brand-border px-3 py-2 text-xs focus:outline-none focus:border-brand-black"
                    />
                    <button
                      type="submit"
                      className="px-4 bg-brand-black text-brand-ivory text-xs uppercase tracking-[0.12em] hover:bg-brand-mocha transition-colors"
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

              <div className="space-y-1.5 text-xs text-brand-secondary-text">
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
                <div className="flex justify-between pt-2 border-t border-brand-border text-sm font-semibold text-brand-black">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleCheckoutClick}
                  className="w-full py-3.5 bg-brand-black text-brand-ivory text-xs tracking-[0.16em] uppercase font-medium hover:bg-brand-mocha transition-colors flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="flex justify-between items-center text-[11px] pt-1 text-brand-secondary-text">
                  <Link
                    to="/cart"
                    onClick={() => setIsCartDrawerOpen(false)}
                    className="underline hover:text-brand-black"
                  >
                    View Full Bag
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsCartDrawerOpen(false)}
                    className="hover:text-brand-black"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
