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
import { OurStory } from './pages/OurStory';
import { Support } from './pages/Support';
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
          {/* Main Top Header */}
          <Header
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenAccount={() => setIsAccountOpen(true)}
          />

          {/* Main Content Router */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:slug" element={<ProductDetails />} />
              <Route path="/lookbook" element={<Lookbook />} />
              <Route path="/story" element={<OurStory />} />
              <Route path="/support" element={<Support />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          {/* Global Modals & Drawers */}
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

          {/* Bottom Footer */}
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
};

export default App;
