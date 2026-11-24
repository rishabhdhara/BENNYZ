import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';
import { ProductSize } from '../types';
import { Trash2, ShoppingBag, ArrowRight, Check, Tag, ShieldCheck } from 'lucide-react';

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
    totalItemsCount
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

  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - (subtotal - discount));
  const shippingProgress = Math.min(100, Math.round(((subtotal - discount) / freeShippingThreshold) * 100));

  const standardSizes: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <div className="border-b border-brand-sand/30 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <span className="text-[10px] tracking-ultra uppercase text-brand-mocha font-semibold">
            YOUR SELECTION
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-brand-black font-normal mt-1">
            Shopping Bag ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'})
          </h1>
        </div>
        <Link to="/shop" className="text-xs uppercase tracking-luxury text-brand-black hover:underline">
          Continue Browsing Collection
        </Link>
      </div>

      {cart.length === 0 ? (
        <div className="py-24 text-center bg-white border border-brand-sand/30 p-8 space-y-4">
          <div className="w-16 h-16 rounded-full border border-brand-sand/40 flex items-center justify-center mx-auto text-brand-secondary">
            <ShoppingBag className="w-6 h-6 stroke-[1]" />
          </div>
          <h3 className="font-serif text-2xl text-brand-black">Your shopping bag is currently empty</h3>
          <p className="text-xs text-brand-secondary max-w-sm mx-auto font-light leading-relaxed">
            The pieces from Drop 001 are engineered to be the anchor of your wardrobe.
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center space-x-2 px-8 py-3.5 bg-brand-black text-brand-ivory text-xs font-semibold tracking-luxury uppercase hover:bg-brand-mocha transition-colors"
            >
              <span>EXPLORE THE COLLECTION</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Items Table */}
          <div className="lg:col-span-8 space-y-6">
            {/* Free Shipping Alert Bar */}
            <div className="p-4 bg-brand-ivory/50 border border-brand-sand/30 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-brand-black">
                  {amountNeededForFreeShipping === 0 ? (
                    <span className="text-emerald-800 font-semibold flex items-center gap-1.5">
                      <Check className="w-4 h-4" /> Qualified for Complimentary Express Shipping across India
                    </span>
                  ) : (
                    <span>
                      Add <strong className="text-brand-black">{formatPrice(amountNeededForFreeShipping)}</strong> more to receive Free Shipping
                    </span>
                  )}
                </span>
                <span className="text-[11px] font-mono text-brand-secondary">{shippingProgress}%</span>
              </div>
              <div className="w-full bg-brand-sand/30 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-brand-black h-full transition-all duration-500 ease-out"
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
            </div>

            <div className="bg-white border border-brand-sand/30 divide-y divide-brand-sand/20">
              {cart.map((item) => (
                <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-24 object-cover border border-brand-sand/30 shrink-0"
                    />
                    <div className="space-y-1">
                      <Link
                        to={`/product/${item.productId}`}
                        className="text-sm font-semibold text-brand-black hover:text-brand-mocha transition-colors"
                      >
                        {item.name}
                      </Link>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-brand-secondary">
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
                        <div className="flex items-center space-x-1">
                          <span>Size:</span>
                          <select
                            value={item.size}
                            onChange={(e) =>
                              updateItemVariant(item.id, e.target.value as ProductSize, item.color)
                            }
                            className="bg-transparent border border-brand-sand/40 text-xs py-0.5 px-1 font-semibold text-brand-black"
                          >
                            {standardSizes.map((sz) => (
                              <option key={sz} value={sz}>{sz}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <p className="text-xs font-semibold text-brand-black pt-1">
                        {formatPrice(item.price)} each
                      </p>
                    </div>
                  </div>

                  {/* Quantity and Controls */}
                  <div className="flex items-center justify-between sm:justify-end sm:space-x-8 pt-2 sm:pt-0 border-t sm:border-0 border-brand-sand/15">
                    <div className="flex items-center border border-brand-sand/50 bg-white">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-xs text-brand-black hover:bg-brand-sand/20"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-semibold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-xs text-brand-black hover:bg-brand-sand/20"
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
                        className="text-[11px] text-brand-secondary/60 hover:text-red-600 underline transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-xs text-brand-secondary">
              <button
                type="button"
                onClick={clearCart}
                className="underline hover:text-brand-black"
              >
                Clear Entire Bag
              </button>
              <span>Prices inclusive of all applicable GST.</span>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4 bg-white border border-brand-sand/30 p-6 sm:p-8 space-y-6 sticky top-28">
            <h3 className="font-serif text-xl text-brand-black border-b border-brand-sand/30 pb-3">
              Order Summary
            </h3>

            {/* Promo Code Input */}
            <div className="space-y-2">
              {discountCode ? (
                <div className="flex items-center justify-between bg-brand-mocha/10 border border-brand-mocha/30 px-3 py-2 text-xs">
                  <span className="flex items-center space-x-1.5 font-medium text-brand-black">
                    <Tag className="w-3.5 h-3.5 text-brand-mocha" />
                    <span>CODE: {discountCode} (Active)</span>
                  </span>
                  <button
                    type="button"
                    onClick={removeDiscountCode}
                    className="text-[11px] underline text-brand-secondary hover:text-brand-black"
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
                    placeholder="PROMO CODE (e.g. FIRSTDROP)"
                    className="flex-1 bg-brand-off-white border border-brand-sand/40 px-3 py-2 text-xs uppercase focus:outline-none focus:border-brand-black"
                  />
                  <button
                    type="submit"
                    className="px-4 bg-brand-black text-brand-ivory text-xs uppercase tracking-editorial"
                  >
                    Apply
                  </button>
                </form>
              )}
              {promoFeedback && (
                <p className={`text-[10px] ${promoFeedback.success ? 'text-emerald-700' : 'text-red-600'}`}>
                  {promoFeedback.message}
                </p>
              )}
            </div>

            {/* Breakdown */}
            <div className="space-y-2.5 text-xs text-brand-secondary font-light pt-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-brand-black">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-800 font-medium">
                  <span>Promotional Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span>{shippingFee === 0 ? 'Complimentary' : formatPrice(shippingFee)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-brand-sand/30 text-base font-semibold text-brand-black">
                <span>Total Amount</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-brand-black text-brand-ivory text-xs tracking-luxury uppercase font-semibold hover:bg-brand-mocha transition-colors flex items-center justify-center space-x-2"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-[11px] text-brand-secondary/80 space-y-1.5 border-t border-brand-sand/20">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-brand-mocha shrink-0" />
                <span>100% Secure Checkout with 256-Bit Encryption</span>
              </div>
              <p>• Doorstep exchange within 14 days of delivery.</p>
              <p>• UPI, Credit Cards, Net Banking & COD accepted.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
