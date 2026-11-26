import React from 'react';
import { Link } from 'react-router-dom';
import { BRAND_CONFIG } from '../data/siteConfig';

interface PolicyShellProps {
  eyebrow: string;
  title: string;
  updatedNote: string;
  children: React.ReactNode;
}

const PolicyShell: React.FC<PolicyShellProps> = ({ eyebrow, title, updatedNote, children }) => (
  <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
    <div className="space-y-2 border-b border-brand-border pb-6">
      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-mocha block">
        {eyebrow}
      </span>
      <h1 className="font-display text-3xl sm:text-5xl font-semibold text-brand-black">
        {title}
      </h1>
      <p className="text-[11px] font-mono text-brand-secondary-text">{updatedNote}</p>
    </div>

    <div className="bg-white border border-brand-border p-6 sm:p-10 space-y-6 text-xs sm:text-sm text-brand-secondary-text leading-relaxed">
      {children}
    </div>
  </div>
);

export const ShippingPolicy: React.FC = () => (
  <PolicyShell
    eyebrow="BENNYZ Policy"
    title="Shipping Policy"
    updatedNote="Editable store policy template — verify courier SLAs prior to launch"
  >
    <div className="space-y-2">
      <h2 className="text-xs font-mono uppercase tracking-[0.14em] text-brand-black font-semibold">
        1. Order Processing
      </h2>
      <p>
        Orders placed on BENNYZ are prepared for dispatch on business days (Monday to Saturday, excluding public holidays). Processing times may adjust during new collection launches.
      </p>
    </div>
    <div className="space-y-2">
      <h2 className="text-xs font-mono uppercase tracking-[0.14em] text-brand-black font-semibold">
        2. Shipping Fees
      </h2>
      <p>
        Orders totaling ₹1,999 or more qualify for complimentary standard shipping across India. Orders under ₹1,999 carry a standard ₹99 shipping fee.
      </p>
    </div>
    <div className="space-y-2">
      <h2 className="text-xs font-mono uppercase tracking-[0.14em] text-brand-black font-semibold">
        3. Estimated Delivery Windows
      </h2>
      <p>
        Estimated delivery times typically range from 2–4 business days in major metro areas and 4–6 business days for other serviceable PIN codes, subject to courier partner schedules.
      </p>
    </div>
    <div className="space-y-2">
      <h2 className="text-xs font-mono uppercase tracking-[0.14em] text-brand-black font-semibold">
        4. Tracking &amp; Support
      </h2>
      <p>
        Once dispatched, tracking details are shared via email. For delivery questions, contact{' '}
        <Link to="/contact" className="underline text-brand-black">{BRAND_CONFIG.supportEmail}</Link>.
      </p>
    </div>
  </PolicyShell>
);

export const ReturnsPolicy: React.FC = () => (
  <PolicyShell
    eyebrow="BENNYZ Policy"
    title="Returns and Refunds"
    updatedNote="Editable store policy template — confirm exact return window prior to launch"
  >
    <div className="space-y-2">
      <h2 className="text-xs font-mono uppercase tracking-[0.14em] text-brand-black font-semibold">
        1. Return &amp; Exchange Eligibility
      </h2>
      <p>
        Items must be unworn, unwashed, free of perfume or stains, and returned with original tags and packaging intact.
      </p>
    </div>
    <div className="space-y-2">
      <h2 className="text-xs font-mono uppercase tracking-[0.14em] text-brand-black font-semibold">
        2. Size Exchanges
      </h2>
      <p>
        If your T-shirt does not fit as expected, you may request a size exchange within the return window by contacting{' '}
        <Link to="/contact" className="underline text-brand-black">{BRAND_CONFIG.supportEmail}</Link>{' '}
        with your order reference and requested size (subject to stock availability).
      </p>
    </div>
    <div className="space-y-2">
      <h2 className="text-xs font-mono uppercase tracking-[0.14em] text-brand-black font-semibold">
        3. Refunds
      </h2>
      <p>
        Approved refunds for prepaid orders are issued back to the original payment method after quality inspection of the returned garment.
      </p>
    </div>
    <div className="space-y-2">
      <h2 className="text-xs font-mono uppercase tracking-[0.14em] text-brand-black font-semibold">
        4. Damaged or Incorrect Items
      </h2>
      <p>
        If you receive a defective or incorrect item, contact us within 48 hours of delivery with photos of the product and outer packaging so we can arrange a prompt replacement.
      </p>
    </div>
  </PolicyShell>
);

export const PrivacyPolicy: React.FC = () => (
  <PolicyShell
    eyebrow="BENNYZ Legal"
    title="Privacy Policy"
    updatedNote="Editable privacy notice — review with legal counsel prior to production launch"
  >
    <div className="space-y-2">
      <h2 className="text-xs font-mono uppercase tracking-[0.14em] text-brand-black font-semibold">
        1. Information We Collect
      </h2>
      <p>
        When you browse or place an order on BENNYZ, we collect only the information necessary to prepare and deliver your order, such as your name, email address, phone number, and shipping address.
      </p>
    </div>
    <div className="space-y-2">
      <h2 className="text-xs font-mono uppercase tracking-[0.14em] text-brand-black font-semibold">
        2. Local Browser Storage
      </h2>
      <p>
        Your shopping bag items are stored locally in your browser (<code className="font-mono text-brand-black">localStorage</code>) so your selection persists across page reloads.
      </p>
    </div>
    <div className="space-y-2">
      <h2 className="text-xs font-mono uppercase tracking-[0.14em] text-brand-black font-semibold">
        3. Payment Security
      </h2>
      <p>
        In this preview build, checkout operates strictly in demo mode and does not transmit or store card data. In production, payments should be processed exclusively through PCI-DSS compliant payment gateways such as Razorpay.
      </p>
    </div>
    <div className="space-y-2">
      <h2 className="text-xs font-mono uppercase tracking-[0.14em] text-brand-black font-semibold">
        4. Contact
      </h2>
      <p>
        For privacy requests, write to {BRAND_CONFIG.supportEmail}.
      </p>
    </div>
  </PolicyShell>
);

