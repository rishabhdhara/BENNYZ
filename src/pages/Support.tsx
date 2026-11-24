import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Mail,
  Phone,
  Clock,
  Truck,
  RotateCcw,
  Shield,
  HelpCircle,
  Package,
  Ruler,
  ChevronDown,
  CheckCircle2
} from 'lucide-react';
import { SIZE_CHART_DATA } from '../data/products';

export const Support: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'contact' | 'faq' | 'shipping' | 'returns' | 'size' | 'tracking' | 'legal'>('contact');

  // Interactive Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('Product / Fit Inquiry');
  const [contactMessage, setContactMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Order Tracking State
  const [trackId, setTrackId] = useState('');
  const [trackingInfo, setTrackingInfo] = useState<any | null>(null);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Check hash or URL search
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash === 'track') setActiveTab('tracking');
    else if (hash === 'size-guide') setActiveTab('size');
    else if (hash === 'shipping') setActiveTab('shipping');
    else if (hash === 'returns') setActiveTab('returns');
    else if (hash === 'faq') setActiveTab('faq');
    else if (hash === 'terms' || hash === 'privacy') setActiveTab('legal');
  }, [location.hash]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackId.trim()) return;

    setTrackingInfo({
      id: trackId.toUpperCase(),
      status: 'In Transit with BlueDart Express',
      awb: 'BLU-884920491',
      courier: 'BlueDart Express Air',
      destination: 'Bengaluru, Karnataka (560001)',
      estimatedDate: 'Tomorrow, by 7:00 PM',
      timeline: [
        { title: 'Order Confirmed & Payment Verified', time: 'Yesterday 04:30 PM', completed: true },
        { title: 'Quality Audited & Packaged in Recycled Box', time: 'Yesterday 08:00 PM', completed: true },
        { title: 'Dispatched from Tirupur Central Hub', time: 'Today 06:15 AM', completed: true },
        { title: 'Arrived at Destination Airport Hub', time: 'Today 11:45 AM', completed: true },
        { title: 'Out for Doorstep Delivery', time: 'Scheduled for Tomorrow', completed: false }
      ]
    });
  };

  const faqs = [
    {
      q: 'What makes BENNYS T-shirts different from standard high-street tees?',
      a: 'We use 210 to 260 GSM long-staple ring-spun combed cotton. Standard commercial tees generally use 140–160 GSM open-end yarn that thins, curls, and shrinks. Our heavier fabric holds its silhouette, drapes cleanly, and features a high-density 1x1 ribbed collar that refuses to sag.'
    },
    {
      q: 'How does your 14-day exchange policy work?',
      a: 'If your t-shirt does not fit exactly how you prefer, we arrange a doorstep exchange anywhere in India. Our courier partner picks up the unworn item (with tags intact) and provides your replacement size without extra charge.'
    },
    {
      q: 'Are BENNYS T-shirts pre-shrunk?',
      a: 'Yes. All our fabrics undergo an enzyme pre-wash cycle during knitting and dyeing, restricting residual shrinkage to under 1.5% under standard 30°C cold washing instructions.'
    },
    {
      q: 'What are your delivery timelines across India?',
      a: 'Metropolitan cities (Delhi NCR, Mumbai, Bengaluru, Chennai, Hyderabad, Kolkata) generally receive orders within 2 to 3 business days. Other regions take 3 to 5 business days via BlueDart and Delhivery Express Air.'
    },
    {
      q: 'Do you offer Cash on Delivery (COD)?',
      a: 'Yes, Cash on Delivery is available across 19,000+ Indian PIN codes. We offer complimentary shipping on all orders over ₹1,999 regardless of payment method.'
    },
    {
      q: 'Which fit should I choose: Oversized, Boxy, or Regular?',
      a: 'Choose Oversized if you prefer dropped shoulders and extra chest volume for a relaxed streetwear/runway drape. Choose Boxy if you like a wide chest with a slightly cropped body length that pairs cleanly with trousers. Choose Regular if you prefer a classic tailored cut.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-[10px] tracking-ultra uppercase text-brand-mocha font-semibold">
          CLIENT CONCIERGE & SUPPORT
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-brand-black">
          How May We Assist You?
        </h1>
        <p className="text-xs sm:text-sm text-brand-secondary font-light">
          Everything you need regarding orders, sizing, shipping guidelines, and direct client care.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-brand-sand/30 pb-4">
        {[
          { key: 'contact', label: 'Concierge & Contact', icon: Mail },
          { key: 'tracking', label: 'Track Order', icon: Package },
          { key: 'faq', label: 'FAQs', icon: HelpCircle },
          { key: 'shipping', label: 'Shipping Policy', icon: Truck },
          { key: 'returns', label: '14-Day Exchanges', icon: RotateCcw },
          { key: 'size', label: 'Size Matrix', icon: Ruler },
          { key: 'legal', label: 'Legal & Policies', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2.5 text-xs tracking-luxury uppercase font-medium flex items-center space-x-2 border transition-all ${
                isActive
                  ? 'bg-brand-black text-brand-ivory border-brand-black'
                  : 'bg-white text-brand-black border-brand-sand/40 hover:border-brand-black'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Concierge & Contact Form */}
      {activeTab === 'contact' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-5xl mx-auto items-start">
          <div className="lg:col-span-5 space-y-6 bg-white p-6 sm:p-8 border border-brand-sand/30">
            <h3 className="font-serif text-2xl text-brand-black">Client Care Desk</h3>
            <p className="text-xs text-brand-secondary font-light leading-relaxed">
              Our concierge team is available Monday through Saturday to answer questions about fits, custom orders, or order status.
            </p>

            <div className="space-y-4 pt-2 text-xs text-brand-black font-light">
              <div className="flex items-start space-x-3">
                <Mail className="w-4 h-4 text-brand-mocha mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold block uppercase tracking-editorial text-[10px] text-brand-secondary">
                    Email Concierge
                  </span>
                  <span>care@bennys.in (24-hour turnaround)</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="w-4 h-4 text-brand-mocha mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold block uppercase tracking-editorial text-[10px] text-brand-secondary">
                    WhatsApp Client Desk
                  </span>
                  <span>+91 98765 43210 (10 AM - 7 PM IST)</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-4 h-4 text-brand-mocha mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold block uppercase tracking-editorial text-[10px] text-brand-secondary">
                    Fulfillment Hub
                  </span>
                  <span>Tirupur Apparel Park, Tamil Nadu 641603</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white p-6 sm:p-8 border border-brand-sand/30">
            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="font-serif text-2xl text-brand-black">Message Received</h3>
                <p className="text-xs text-brand-secondary max-w-sm mx-auto font-light leading-relaxed">
                  Thank you, <strong className="text-brand-black">{contactName}</strong>. Our client concierge will respond to <strong>{contactEmail}</strong> within 1 business day.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2.5 bg-brand-black text-brand-ivory text-xs uppercase tracking-luxury"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <h3 className="font-serif text-xl text-brand-black">Send a Direct Message</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-editorial font-semibold text-brand-secondary">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Arjun Kapoor"
                      className="w-full bg-brand-off-white border border-brand-sand/40 px-3 py-2 text-xs focus:outline-none focus:border-brand-black"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-editorial font-semibold text-brand-secondary">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="arjun@example.com"
                      className="w-full bg-brand-off-white border border-brand-sand/40 px-3 py-2 text-xs focus:outline-none focus:border-brand-black"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-editorial font-semibold text-brand-secondary">
                    Subject
                  </label>
                  <select
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    className="w-full bg-brand-off-white border border-brand-sand/40 px-3 py-2 text-xs focus:outline-none focus:border-brand-black"
                  >
                    <option value="Product / Fit Inquiry">Product & Fit Consultation</option>
                    <option value="Order Tracking & Logistics">Order Tracking & Logistics</option>
                    <option value="14-Day Exchange Request">14-Day Exchange Request</option>
                    <option value="Press / Styling Inquiry">Press & Editorial Inquiry</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-editorial font-semibold text-brand-secondary">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Tell us how we can help with your order or sizing preference..."
                    className="w-full bg-brand-off-white border border-brand-sand/40 px-3 py-2 text-xs focus:outline-none focus:border-brand-black"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-brand-black text-brand-ivory text-xs tracking-luxury uppercase font-medium hover:bg-brand-mocha transition-colors"
                >
                  TRANSMIT MESSAGE
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Order Tracking UI */}
      {activeTab === 'tracking' && (
        <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 border border-brand-sand/30 space-y-6">
          <div>
            <h3 className="font-serif text-2xl text-brand-black">Real-Time Order Tracking</h3>
            <p className="text-xs text-brand-secondary font-light mt-1">
              Enter your BENNYS Order ID (found in your confirmation email or SMS) to view express courier progress.
            </p>
          </div>

          <form onSubmit={handleTrackSubmit} className="flex gap-2">
            <input
              type="text"
              required
              value={trackId}
              onChange={(e) => setTrackId(e.target.value)}
              placeholder="e.g. BENNYS-8821"
              className="flex-1 bg-brand-off-white border border-brand-sand/40 px-3.5 py-2.5 text-xs uppercase tracking-wider focus:outline-none focus:border-brand-black"
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-brand-black text-brand-ivory text-xs uppercase tracking-luxury font-medium hover:bg-brand-mocha transition-colors shrink-0"
            >
              Locate Package
            </button>
          </form>

          {trackingInfo && (
            <div className="pt-4 border-t border-brand-sand/30 space-y-6 animate-fade-in">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-brand-ivory/30 border border-brand-sand/30 text-xs">
                <div>
                  <span className="text-[10px] text-brand-secondary uppercase block">Order ID</span>
                  <span className="font-semibold text-brand-black">{trackingInfo.id}</span>
                </div>
                <div>
                  <span className="text-[10px] text-brand-secondary uppercase block">Carrier</span>
                  <span className="font-medium text-brand-black">{trackingInfo.courier}</span>
                </div>
                <div>
                  <span className="text-[10px] text-brand-secondary uppercase block">Estimated Delivery</span>
                  <span className="font-semibold text-emerald-800">{trackingInfo.estimatedDate}</span>
                </div>
              </div>

              {/* Steps timeline */}
              <div className="space-y-4 pl-4 border-l-2 border-brand-black/30">
                {trackingInfo.timeline.map((step: any, index: number) => (
                  <div key={index} className="relative pl-4">
                    <div
                      className={`absolute -left-[21px] top-1 w-3.5 h-3.5 rounded-full border-2 ${
                        step.completed
                          ? 'bg-brand-black border-brand-black'
                          : 'bg-white border-brand-sand'
                      }`}
                    />
                    <h5 className={`text-xs ${step.completed ? 'font-semibold text-brand-black' : 'text-brand-secondary'}`}>
                      {step.title}
                    </h5>
                    <span className="text-[11px] text-brand-secondary/80 font-light">{step.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: FAQs */}
      {activeTab === 'faq' && (
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="text-center mb-6">
            <h3 className="font-serif text-2xl text-brand-black">Frequently Addressed Inquiries</h3>
          </div>
          <div className="divide-y divide-brand-sand/30 border border-brand-sand/30 bg-white">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-4 sm:p-5">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex justify-between items-center text-left text-xs sm:text-sm font-semibold text-brand-black hover:text-brand-mocha transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      openFaq === idx ? 'rotate-180 text-brand-mocha' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <p className="mt-3 text-xs text-brand-secondary font-light leading-relaxed">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Shipping Policy */}
      {activeTab === 'shipping' && (
        <div className="max-w-3xl mx-auto bg-white p-6 sm:p-10 border border-brand-sand/30 space-y-6 text-xs text-brand-secondary font-light leading-relaxed">
          <h3 className="font-serif text-2xl text-brand-black">Pan-India Shipping Policy</h3>
          <p>
            At BENNYS, every garment is dispatched in our custom architectural, 100% recyclable shipping box with garment dust bag protection.
          </p>

          <div className="space-y-3 pt-2">
            <h4 className="font-semibold text-brand-black text-xs uppercase tracking-editorial">
              1. Shipping Rates & Thresholds
            </h4>
            <p>
              • <strong>Complimentary Express Shipping:</strong> Orders valued at ₹1,999 or above qualify automatically for zero-cost express air delivery.
              <br />
              • <strong>Standard Shipping:</strong> A flat fee of ₹99 is applied to orders below ₹1,999.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="font-semibold text-brand-black text-xs uppercase tracking-editorial">
              2. Delivery Timelines
            </h4>
            <p>
              • <strong>Tier 1 Metro Hubs (Delhi, Mumbai, Bengaluru, Chennai, Hyderabad):</strong> 2 to 3 business days.
              <br />
              • <strong>Tier 2 & Rest of India:</strong> 3 to 5 business days.
              <br />
              • All orders placed before 2:00 PM IST dispatch the same working day.
            </p>
          </div>
        </div>
      )}

      {/* Tab 5: 14-Day Exchanges Policy */}
      {activeTab === 'returns' && (
        <div className="max-w-3xl mx-auto bg-white p-6 sm:p-10 border border-brand-sand/30 space-y-6 text-xs text-brand-secondary font-light leading-relaxed">
          <h3 className="font-serif text-2xl text-brand-black">14-Day Doorstep Exchange Policy</h3>
          <p>
            Finding the exact fit is personal. We want you to feel confident in your BENNYS piece. If you require a different size or silhouette, our exchange service makes it effortless.
          </p>

          <div className="space-y-3 pt-2">
            <h4 className="font-semibold text-brand-black text-xs uppercase tracking-editorial">
              How Doorstep Exchange Operates:
            </h4>
            <ol className="list-decimal list-inside space-y-2">
              <li>Contact our concierge at care@bennys.in or via WhatsApp (+91 98765 43210) within 14 days of delivery.</li>
              <li>State your order ID and the desired replacement size or color.</li>
              <li>We dispatch our courier partner to collect the unworn garment with tags attached.</li>
              <li>Your replacement is shipped immediately upon pickup.</li>
            </ol>
          </div>
        </div>
      )}

      {/* Tab 6: Size Matrix */}
      {activeTab === 'size' && (
        <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 border border-brand-sand/30 space-y-6">
          <h3 className="font-serif text-2xl text-brand-black">Comprehensive Sizing Matrix</h3>
          <p className="text-xs text-brand-secondary font-light">
            All measurements represent body circumference or garment dimensions in inches.
          </p>
          <div className="overflow-x-auto border border-brand-sand/30">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-ivory text-brand-black uppercase tracking-editorial text-[10px]">
                <tr>
                  <th className="p-3">Size</th>
                  <th className="p-3">Chest (Inches)</th>
                  <th className="p-3">Body Length (Inches)</th>
                  <th className="p-3">Shoulder (Inches)</th>
                  <th className="p-3">Recommended Height</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-sand/20">
                {SIZE_CHART_DATA.map((row) => (
                  <tr key={row.size}>
                    <td className="p-3 font-semibold">{row.size}</td>
                    <td className="p-3">{row.chestInches}"</td>
                    <td className="p-3">{row.lengthInches}"</td>
                    <td className="p-3">{row.shoulderInches}"</td>
                    <td className="p-3 text-brand-secondary font-light">
                      {row.size === 'XS' ? "5'5\" - 5'7\"" : row.size === 'S' ? "5'7\" - 5'9\"" : row.size === 'M' ? "5'9\" - 5'11\"" : row.size === 'L' ? "5'11\" - 6'1\"" : row.size === 'XL' ? "6'1\" - 6'3\"" : "6'3\"+"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 7: Legal, Terms & Privacy */}
      {activeTab === 'legal' && (
        <div className="max-w-3xl mx-auto bg-white p-6 sm:p-10 border border-brand-sand/30 space-y-6 text-xs text-brand-secondary font-light leading-relaxed">
          <h3 className="font-serif text-2xl text-brand-black">Terms of Service & Privacy</h3>
          <div className="space-y-3">
            <h4 className="font-semibold text-brand-black uppercase tracking-editorial text-[11px]">
              Prototype Collection Notice
            </h4>
            <p>
              BENNYS Drop 001 is presented as a demonstration and preview of our contemporary menswear brand. All commercial transactions, payment endpoints, and product inventories shown in this prototype interface are for evaluation and design verification.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="font-semibold text-brand-black uppercase tracking-editorial text-[11px]">
              Privacy & Data Protection
            </h4>
            <p>
              We value your discretion. Any personal details, email addresses, or shipping PIN codes submitted in this client interface are retained strictly in local session storage and are never sold or shared with third-party advertisers.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
