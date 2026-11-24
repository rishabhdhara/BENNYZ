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
    totalItemsCount
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
    if (res.success) {
      setPromoInput('');
    }
  };

  const handleCheckoutClick = () => {
    setIsCartDrawerOpen(false);
    navigate('/checkout');
  };

  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - (subtotal - discount));
  const shippingProgress = Math.min(100, Math.round(((subtotal - discount) / freeShippingThreshold) * 100));

  const standardSizes: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-brand-off-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="px-6 py-5 border-b border-brand-sand/30 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
              <h2 className="text-xs font-semibold tracking-editorial uppercase text-brand-black">
                Your Shopping Bag ({totalItemsCount})
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1 text-brand-black/70 hover:text-brand-black transition-colors"
              aria-label="Close bag"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-brand-ivory/70 px-6 py-3 border-b border-brand-sand/30">
            <div className="flex justify-between items-center text-[11px] mb-1.5">
              <span className="font-medium text-brand-black">
                {amountNeededForFreeShipping === 0 ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Qualified for Complimentary Express Shipping
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-brand-black">{formatPrice(amountNeededForFreeShipping)}</strong> more for Free Shipping
                  </span>
                )}
              </span>
              <span className="text-brand-secondary text-[10px] font-mono">{shippingProgress}%</span>
            </div>
            <div className="w-full bg-brand-sand/30 h-1 rounded-full overflow-hidden">
              <div
                className="bg-brand-black h-full transition-all duration-500 ease-out"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-brand-sand/20">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full border border-brand-sand/40 flex items-center justify-center text-brand-secondary">
                  <ShoppingBag className="w-6 h-6 stroke-[1]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-xl font-medium text-brand-black">
                    Your shopping bag is empty
                  </h3>
                  <p className="text-xs text-brand-secondary max-w-xs font-light">
                    Every piece in Drop 001 is produced in limited batches. Explore our heavyweight silhouettes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigate('/shop');
                  }}
                  className="mt-2 inline-flex items-center space-x-2 px-6 py-3 bg-brand-black text-brand-ivory text-xs tracking-luxury font-medium uppercase hover:bg-brand-mocha transition-colors"
                >
                  <span>Explore The Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="py-4 flex space-x-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-24 bg-brand-sand/20 shrink-0 overflow-hidden border border-brand-sand/30">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          to={`/product/${item.productId}`}
                          onClick={() => setIsCartDrawerOpen(false)}
                          className="text-xs font-medium text-brand-black hover:text-brand-mocha transition-colors line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-brand-secondary/60 hover:text-red-600 transition-colors ml-2"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center space-x-2 mt-1 text-[11px] text-brand-secondary">
                        <span className="flex items-center gap-1">
                          <span
                            className="inline-block w-2.5 h-2.5 rounded-full border border-black/10"
                            style={{ backgroundColor: item.color.hex }}
                          />
                          {item.color.name}
                        </span>
                        <span>•</span>
                        {/* Size Switcher */}
                        <div className="flex items-center space-x-1">
                          <span>Size:</span>
                          <select
                            value={item.size}
                            onChange={(e) =>
                              updateItemVariant(item.id, e.target.value as ProductSize, item.color)
                            }
                            className="bg-transparent border border-brand-sand/40 text-[11px] py-0 px-1 font-medium text-brand-black focus:outline-none"
                          >
                            {standardSizes.map((sz) => (
                              <option key={sz} value={sz}>
                                {sz}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-brand-sand/50 bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-xs text-brand-black hover:bg-brand-sand/20 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="w-7 text-center text-xs font-medium text-brand-black">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-xs text-brand-black hover:bg-brand-sand/20 transition-colors"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Total Item Price */}
                      <span className="text-xs font-semibold text-brand-black">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer / Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-brand-sand/30 bg-brand-ivory/30 space-y-4">
              {/* Promo Code Form */}
              <div className="space-y-2">
                {discountCode ? (
                  <div className="flex items-center justify-between bg-brand-mocha/10 border border-brand-mocha/30 px-3 py-1.5 text-xs text-brand-black">
                    <span className="flex items-center space-x-1.5 font-medium">
                      <Tag className="w-3.5 h-3.5 text-brand-mocha" />
                      <span>CODE: {discountCode} (Applied)</span>
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
                  <form onSubmit={handleApplyPromo} className="flex space-x-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="PROMO CODE (e.g. FIRSTDROP)"
                      className="flex-1 bg-white border border-brand-sand/50 px-3 py-2 text-xs uppercase placeholder:text-brand-secondary/50 focus:outline-none focus:border-brand-black"
                    />
                    <button
                      type="submit"
                      className="px-4 bg-brand-black text-brand-ivory text-xs tracking-editorial uppercase hover:bg-brand-mocha transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {promoFeedback && (
                  <p
                    className={`text-[10px] ${
                      promoFeedback.success ? 'text-emerald-700' : 'text-red-600'
                    }`}
                  >
                    {promoFeedback.message}
                  </p>
                )}
              </div>

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs text-brand-secondary font-light">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-brand-black">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Promotional Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span>{shippingFee === 0 ? 'Complimentary' : formatPrice(shippingFee)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-brand-sand/30 text-sm font-semibold text-brand-black">
                  <span>Estimated Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <p className="text-[10px] text-brand-secondary/70 text-right">
                  Taxes included. Calculated at final checkout.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleCheckoutClick}
                  className="w-full py-3.5 bg-brand-black text-brand-ivory text-xs tracking-luxury uppercase font-medium hover:bg-brand-mocha transition-colors flex items-center justify-center space-x-2 shadow-sm"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="flex justify-between items-center text-[11px] pt-1 text-brand-secondary">
                  <Link
                    to="/cart"
                    onClick={() => setIsCartDrawerOpen(false)}
                    className="underline hover:text-brand-black"
                  >
                    View Detailed Bag
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsCartDrawerOpen(false)}
                    className="hover:text-brand-black"
                  >
                    Continue Browsing
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
