import React from 'react';
import { useCart } from '../context/CartContext';
import { Check, X } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { notificationMessage, dismissNotification } = useCart();

  if (!notificationMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-fade-in-up">
      <div className="bg-brand-black text-brand-ivory p-4 shadow-2xl border border-brand-sand/30 flex items-center justify-between space-x-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-5 h-5 rounded-full bg-brand-mocha/30 flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 text-brand-sand" />
          </div>
          <p className="text-xs font-medium tracking-wide">{notificationMessage}</p>
        </div>
        <button
          type="button"
          onClick={dismissNotification}
          className="text-brand-sand hover:text-white transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
