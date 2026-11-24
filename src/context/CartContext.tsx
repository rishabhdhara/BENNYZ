import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ProductColor, ProductSize } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, size: ProductSize, color: ProductColor, quantity?: number) => { success: boolean; message?: string };
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, newQty: number) => void;
  updateItemVariant: (itemId: string, newSize: ProductSize, newColor: ProductColor) => void;
  clearCart: () => void;
  subtotal: number;
  discount: number;
  discountCode: string;
  applyDiscountCode: (code: string) => { success: boolean; message: string };
  removeDiscountCode: () => void;
  shippingFee: number;
  freeShippingThreshold: number;
  total: number;
  totalItemsCount: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  lastAddedItem: CartItem | null;
  notificationMessage: string | null;
  dismissNotification: () => void;
}

const CART_STORAGE_KEY = 'bennys_cart_v1';
const FREE_SHIPPING_THRESHOLD = 1999;
const STANDARD_SHIPPING_FEE = 99;

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  // Show transient toast notification
  const triggerNotification = (msg: string) => {
    setNotificationMessage(msg);
    setTimeout(() => {
      setNotificationMessage(null);
    }, 4000);
  };

  const dismissNotification = () => setNotificationMessage(null);

  const addToCart = (
    product: Product,
    size: ProductSize,
    color: ProductColor,
    quantity: number = 1
  ): { success: boolean; message?: string } => {
    if (!size) {
      return { success: false, message: 'Please select a size to proceed.' };
    }

    const maxStock = product.stockCount[size] || 0;
    if (maxStock <= 0) {
      return { success: false, message: `Size ${size} is currently out of stock.` };
    }

    const itemId = `${product.id}-${color.code}-${size}`;
    const existingIndex = cart.findIndex((item) => item.id === itemId);

    let updatedCart = [...cart];
    if (existingIndex > -1) {
      const currentQty = updatedCart[existingIndex].quantity;
      const desiredQty = currentQty + quantity;

      if (desiredQty > maxStock) {
        triggerNotification(`Only ${maxStock} units available for size ${size}.`);
        return {
          success: false,
          message: `Only ${maxStock} units available for size ${size}.`
        };
      }

      updatedCart[existingIndex].quantity = desiredQty;
      setLastAddedItem(updatedCart[existingIndex]);
    } else {
      if (quantity > maxStock) {
        return {
          success: false,
          message: `Only ${maxStock} units available in size ${size}.`
        };
      }

      const newItem: CartItem = {
        id: itemId,
        productId: product.id,
        name: product.name,
        price: product.price,
        color,
        size,
        quantity,
        image: product.images.front,
        fit: product.fit,
        maxStock
      };

      updatedCart.push(newItem);
      setLastAddedItem(newItem);
    }

    setCart(updatedCart);
    triggerNotification(`Added "${product.name}" (${size}) to your bag.`);
    setIsCartDrawerOpen(true);
    return { success: true };
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
    triggerNotification('Item removed from shopping bag.');
  };

  const updateQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          if (newQty > item.maxStock) {
            triggerNotification(`Maximum available quantity is ${item.maxStock}.`);
            return { ...item, quantity: item.maxStock };
          }
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const updateItemVariant = (itemId: string, newSize: ProductSize, newColor: ProductColor) => {
    setCart((prev) => {
      const itemToUpdate = prev.find((it) => it.id === itemId);
      if (!itemToUpdate) return prev;

      const newId = `${itemToUpdate.productId}-${newColor.code}-${newSize}`;
      const filtered = prev.filter((it) => it.id !== itemId);
      const existingMatch = filtered.find((it) => it.id === newId);

      if (existingMatch) {
        return filtered.map((it) =>
          it.id === newId ? { ...it, quantity: Math.min(it.quantity + itemToUpdate.quantity, it.maxStock) } : it
        );
      } else {
        return [
          ...filtered,
          {
            ...itemToUpdate,
            id: newId,
            size: newSize,
            color: newColor
          }
        ];
      }
    });
  };

  const clearCart = () => {
    setCart([]);
    setDiscountCode('');
    setDiscountPercent(0);
  };

  const applyDiscountCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'FIRSTDROP' || cleanCode === 'BENNYS10') {
      setDiscountCode(cleanCode);
      setDiscountPercent(10);
      return { success: true, message: 'Code FIRSTDROP applied: 10% discount on order.' };
    } else if (cleanCode === 'ELEVATED15' || cleanCode === 'BENNYS15') {
      setDiscountCode(cleanCode);
      setDiscountPercent(15);
      return { success: true, message: 'Code applied: 15% VIP discount.' };
    }
    return { success: false, message: 'Invalid or expired promotional code.' };
  };

  const removeDiscountCode = () => {
    setDiscountCode('');
    setDiscountPercent(0);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = Math.round((subtotal * discountPercent) / 100);
  const afterDiscount = subtotal - discount;
  const shippingFee = subtotal === 0 || afterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const total = Math.max(0, afterDiscount + shippingFee);
  const totalItemsCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
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
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        total,
        totalItemsCount,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        lastAddedItem,
        notificationMessage,
        dismissNotification
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
