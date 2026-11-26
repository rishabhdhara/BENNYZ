import React, { useState } from 'react';
import { Mail, Clock, Instagram, CheckCircle2 } from 'lucide-react';
import { BRAND_CONFIG } from '../data/siteConfig';

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Sizing & Fit');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <div className="space-y-2 border-b border-brand-border pb-6">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-mocha block">
          Client Care
        </span>
        <h1 className="font-display text-3xl sm:text-5xl font-semibold text-brand-black">
          Contact BENNYZ
        </h1>
        <p className="text-xs sm:text-sm text-brand-secondary-text max-w-xl">
          Questions about sizing, orders, or upcoming releases? Reach out using the form below or via our support email.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-5 bg-white border border-brand-border p-6 sm:p-8 space-y-6">
          <h2 className="font-display text-xl font-semibold text-brand-black">Direct Channels</h2>

          <div className="space-y-4 text-xs text-brand-secondary-text">
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-brand-mocha shrink-0 mt-0.5" />
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand-black block">
                  Email Support
                </span>
                <span>{BRAND_CONFIG.supportEmail}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-brand-mocha shrink-0 mt-0.5" />
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand-black block">
                  Support Hours
                </span>
                <span>{BRAND_CONFIG.supportHours}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Instagram className="w-4 h-4 text-brand-mocha shrink-0 mt-0.5" />
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand-black block">
                  Instagram
                </span>
                <span>{BRAND_CONFIG.instagramHandle}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white border border-brand-border p-6 sm:p-8">
          {submitted ? (
            <div className="py-10 text-center space-y-3">
              <CheckCircle2 className="w-9 h-9 text-brand-mocha mx-auto" />
              <h2 className="font-display text-2xl font-semibold text-brand-black">Message Noted</h2>
              <p className="text-xs text-brand-secondary-text max-w-sm mx-auto leading-relaxed">
                Thanks, <strong className="text-brand-black">{name}</strong>. In production, this form submits to your email or helpdesk endpoint for <strong className="text-brand-black">{email}</strong>.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setMessage('');
                }}
                className="mt-2 px-6 py-2.5 bg-brand-black text-brand-ivory text-xs uppercase tracking-[0.14em]"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-brand-black">Send a Message</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-brand-secondary-text">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full bg-brand-off-white border border-brand-border px-3 py-2.5 text-xs focus:outline-none focus:border-brand-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-brand-secondary-text">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-brand-off-white border border-brand-border px-3 py-2.5 text-xs focus:outline-none focus:border-brand-black"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-brand-secondary-text">
                  Topic
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-brand-off-white border border-brand-border px-3 py-2.5 text-xs focus:outline-none focus:border-brand-black"
                >
                  <option value="Sizing & Fit">Sizing &amp; Fit Question</option>
                  <option value="Order Support">Order Support</option>
                  <option value="Returns & Exchanges">Returns &amp; Exchanges</option>
                  <option value="General">General Inquiry</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-brand-secondary-text">
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help?"
                  className="w-full bg-brand-off-white border border-brand-border px-3 py-2.5 text-xs focus:outline-none focus:border-brand-black"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-brand-black text-brand-ivory text-xs tracking-[0.16em] uppercase font-semibold hover:bg-brand-mocha transition-colors"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
