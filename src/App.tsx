import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { QuickSearchModal } from './components/QuickSearchModal';
import { AccountModal } from './components/AccountModal';
import { ToastNotification } from './components/ToastNotification';
import { ScrollToTop } from './components/ScrollToTop';

// Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { Lookbook } from './pages/Lookbook';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Faq } from './pages/Faq';
import {
  ShippingPolicy,
  ReturnsPolicy,
  PrivacyPolicy,
} from './pages/PolicyPages';
import { TermsAndConditions } from './pages/TermsAndConditions';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { NotFound } from './pages/NotFound';

export const App: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-brand-off-white text-brand-black selection:bg-brand-black selection:text-brand-ivory">
          <Header
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenAccount={() => setIsAccountOpen(true)}
          />

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:slug" element={<ProductDetails />} />
              <Route path="/lookbook" element={<Lookbook />} />
              <Route path="/about" element={<About />} />
              <Route path="/story" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/returns-and-refunds" element={<ReturnsPolicy />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <CartDrawer />
          <QuickSearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
          />
          <AccountModal
            isOpen={isAccountOpen}
            onClose={() => setIsAccountOpen(false)}
          />
          <ToastNotification />

          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
};

export default App;
