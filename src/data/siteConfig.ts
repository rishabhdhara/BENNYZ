export interface AnnouncementConfig {
  enabled: boolean;
  message: string;
  ctaText?: string;
  ctaLink?: string;
}

/**
 * Editable store-wide announcement bar configuration.
 * Update `message`, `ctaText`, or `enabled` here without touching layout components.
 */
export const ANNOUNCEMENT_CONFIG: AnnouncementConfig = {
  enabled: true,
  message: 'Introducing the BENNYZ essentials collection',
  ctaText: 'Shop T-Shirts',
  ctaLink: '/shop',
};

/**
 * Central brand identity & editable contact/placeholder configuration.
 * Replace placeholder strings with verified operational details before production launch.
 */
export const BRAND_CONFIG = {
  name: 'BENNYZ',
  tagline: 'Built for your everyday.',
  instagramHandle: '@bennyz.wear',
  instagramUrl: 'https://instagram.com',
  supportEmail: 'hello@bennyz.in', // Editable placeholder email
  supportHours: 'Monday – Saturday, 10:00 AM – 6:30 PM IST',
  currencySymbol: '₹',
  freeShippingThreshold: 1999,
  standardShippingFee: 99,
  promoCodes: {
    EVERYDAY10: { percent: 10, description: '10% off your everyday essentials order' },
  },
};

/**
 * Editable garment specification placeholders.
 * Per brand standards, unverified fabric weights (GSM), certifications, or origin claims
 * are kept as clearly marked editable placeholders until mill test reports are finalized.
 */
export const SPEC_PLACEHOLDERS = {
  fabricWeight: '[Fabric weight / GSM — add verified mill spec]',
  composition: '[Fabric composition — e.g., 100% Cotton, update with verified spec]',
  weave: '[Knit structure — update with verified spec]',
  origin: '[Manufacturing & finishing location — update before launch]',
  careInstructions: [
    'Machine wash cold, inside out, with similar colours',
    'Use mild detergent; do not bleach',
    'Line dry in shade to preserve shape',
    'Warm iron on reverse if needed',
  ],
  specNotice:
    'Placeholder product specification: Update fabric weight (GSM), exact yarn composition, and origin details in src/data/products.ts once final production samples are verified.',
};
