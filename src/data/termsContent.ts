export interface TermsSection {
  number: number;
  title: string;
  paragraphs: string[];
  linkTo?: {
    label: string;
    path: string;
  };
}

/**
 * Editable metadata and placeholders for the BENNYZ Terms and Conditions page.
 * Replace all bracketed placeholders with verified legal and operational details
 * and have the document reviewed by qualified legal counsel before launch.
 */
export const TERMS_META = {
  pageTitle: 'Terms and Conditions',
  tagline: 'Built for your everyday.',
  lastUpdated: '[Insert last updated date, e.g., DD Month YYYY]',
  websiteUrl: '[Insert official website URL, e.g., https://bennyz.in]',
  legalBusinessName: '[Insert legal business name]',
  registrationNumber: '[Insert business registration / CIN / LLPIN, if applicable]',
  gstin: '[Insert GSTIN, if applicable]',
  businessAddress: '[Insert registered business address]',
  supportEmail: '[Insert customer support email]',
  supportPhone: '[Insert customer support phone number]',
  supportHours: '[Insert customer support hours]',
  jurisdiction: '[Insert applicable city and state jurisdiction in India]',
  draftNotice:
    'Pre-launch editable template: Replace all bracketed placeholders with your verified business, tax, shipping, return, and payment details, and have these terms reviewed against applicable Indian consumer protection and e-commerce rules prior to going live. This template does not constitute legal advice or guarantee legal compliance.',
  intro:
    'Welcome to BENNYZ (“Built for your everyday.”). These Terms and Conditions explain the rules for browsing, using, and placing orders through our online store in India. Please read them carefully before using the website or making a purchase.',
};

export const TERMS_SECTIONS: TermsSection[] = [
  {
    number: 1,
    title: 'Introduction and Acceptance of Terms',
    paragraphs: [
      `These Terms and Conditions ("Terms") govern your access to and use of the BENNYZ website located at ${TERMS_META.websiteUrl} (the "Website") and any purchases of men's T-shirts and apparel made through it.`,
      'By accessing, browsing, or placing an order on this Website, you confirm that you have read, understood, and agree to be bound by these Terms, along with our Privacy Policy, Shipping Policy, and Returns and Refunds Policy. If you do not agree with any part of these Terms, please discontinue use of the Website.',
    ],
  },
  {
    number: 2,
    title: 'About BENNYZ',
    paragraphs: [
      `BENNYZ ("Built for your everyday.") is an online men's apparel brand offering T-shirts and everyday clothing in India, operated by ${TERMS_META.legalBusinessName}.`,
      `Business registration details: ${TERMS_META.registrationNumber}. GST registration: ${TERMS_META.gstin}. Principal / registered office: ${TERMS_META.businessAddress}.`,
    ],
  },
  {
    number: 3,
    title: 'Eligibility to Use the Website',
    paragraphs: [
      'You may use this Website and enter into binding transactions only if you are at least 18 years of age and legally competent to contract under applicable Indian law (including the Indian Contract Act, 1872).',
      'If you are under 18 years of age, you may browse or place orders only under the involvement and supervision of a parent or legal guardian who agrees to be bound by these Terms on your behalf.',
    ],
  },
  {
    number: 4,
    title: 'Account Registration and Account Security',
    paragraphs: [
      'Certain features of the Website may allow you to browse as a guest or sign in with an account. Where account functionality is enabled, you agree to provide accurate, current, and complete information and to keep your contact details updated.',
      'You are responsible for maintaining the confidentiality of your account credentials and for all activity conducted under your account. Please notify us promptly at ' +
        TERMS_META.supportEmail +
        ' if you suspect any unauthorized access or security issue.',
    ],
  },
  {
    number: 5,
    title: 'Product Information and Product Images',
    paragraphs: [
      'We aim to display our T-shirts, silhouettes (including Oversized, Boxy, and Regular fits), product descriptions, and sizing guides as accurately as possible. However, slight variations in colour, shade, or texture may occur due to photography lighting and individual screen settings.',
      'Measurements provided in our size guides are approximate garment reference measurements and should be reviewed alongside fit notes prior to ordering. Unless explicitly confirmed on the live product listing, placeholder specifications in pre-launch builds are subject to final production verification.',
    ],
  },
  {
    number: 6,
    title: 'Prices, Taxes, and Payment',
    paragraphs: [
      'All product prices on the Website are listed in Indian Rupees (INR / ₹). Any applicable taxes (such as GST) and delivery charges, if applicable, will be clearly displayed prior to checkout confirmation.',
      `Payment processing arrangements: ${'[Insert authorized payment gateway provider(s) and accepted payment methods once configured, e.g., UPI, cards, net banking, or Cash on Delivery]'}. While the storefront is in demonstration mode, no live payments are processed or charged.`,
      'We reserve the right to update product prices at any time prior to order acceptance without prior notice.',
    ],
  },
  {
    number: 7,
    title: 'Orders and Order Acceptance',
    paragraphs: [
      'Placing an item in your shopping bag or submitting the checkout form constitutes an offer to purchase, not a final confirmation of sale. All orders are subject to verification, stock confirmation, and acceptance by BENNYZ.',
      'We reserve the right to cancel or refuse an order in circumstances such as stock unavailability, pricing or listing errors, incomplete or unserviceable delivery details, or suspected fraudulent or unauthorized activity. If an order is cancelled after a live payment has been collected, any applicable refund will be handled according to our Returns and Refunds Policy.',
    ],
  },
  {
    number: 8,
    title: 'Product Availability',
    paragraphs: [
      'All T-shirts and sizes shown on the Website are subject to availability. Certain fits, colours, or graphic releases may be produced in limited quantities and may sell out without advance notice.',
      'Adding a product to your shopping bag does not reserve inventory until an order is completed and confirmed.',
    ],
  },
  {
    number: 9,
    title: 'Shipping and Delivery',
    paragraphs: [
      `Orders are dispatched to serviceable PIN codes within India through our logistics partners. Estimated processing and delivery timelines: ${'[Insert verified dispatch and delivery timelines once courier arrangements are finalized]'}.`,
      'Delivery timelines are estimates and may vary due to location, public holidays, weather, or courier delays beyond our reasonable control. Please ensure your shipping address, PIN code, and phone number are accurate at checkout.',
    ],
    linkTo: {
      label: 'Read our Shipping Policy',
      path: '/shipping-policy',
    },
  },
  {
    number: 10,
    title: 'Returns, Exchanges, and Refunds',
    paragraphs: [
      `Return and exchange eligibility criteria: ${'[Insert specific return/exchange eligibility window, item condition requirements, and non-returnable exceptions]'}.`,
      `Refund processing details: ${'[Insert exact refund timeline and refund mode details once finalized]'}.`,
      'For full instructions on requesting a size exchange, return, or reporting a damaged or incorrect item, please review our Returns and Refunds page.',
    ],
    linkTo: {
      label: 'Read our Returns and Refunds Policy',
      path: '/returns-and-refunds',
    },
  },
  {
    number: 11,
    title: 'Promotions and Discount Codes',
    paragraphs: [
      'Promotional offers, seasonal markdowns, and discount codes are subject to specific eligibility rules, validity periods, and minimum order values communicated at the time of the offer.',
      'Unless expressly stated otherwise, discount codes cannot be combined with other offers, transferred for cash, or applied retroactively to completed orders. We reserve the right to modify or withdraw any promotion at any time.',
    ],
  },
  {
    number: 12,
    title: 'Intellectual Property and Brand Assets',
    paragraphs: [
      'All content on this Website — including the BENNYZ name, custom wordmark, BZ monogram, tagline ("Built for your everyday."), product graphics, photographs, layout, text, and code — is owned by or licensed to ' +
        TERMS_META.legalBusinessName +
        ' and protected under applicable intellectual property laws.',
      'You may view and use the Website solely for personal, non-commercial shopping. You may not copy, reproduce, modify, distribute, or commercially exploit any brand assets or Website content without prior written permission.',
    ],
  },
  {
    number: 13,
    title: 'Website Use and Prohibited Activities',
    paragraphs: [
      'You agree to use the Website lawfully and respectfully. You must not attempt to disrupt, overload, scrape, reverse-engineer, bypass security controls, introduce malicious code, or use automated bots to place orders or extract data from the Website.',
      'We may restrict or terminate access to the Website if we reasonably believe a user is violating these Terms or engaging in abusive or fraudulent behaviour.',
    ],
  },
  {
    number: 14,
    title: 'Third-Party Services and Links',
    paragraphs: [
      'Our Website may integrate or link to third-party services such as courier partners, payment gateways, or social media platforms (including Instagram).',
      'Third-party websites and services operate under their own terms and privacy policies. BENNYZ is not responsible for the content, availability, or practices of external sites outside our direct control.',
    ],
  },
  {
    number: 15,
    title: 'Limitation of Liability',
    paragraphs: [
      'To the maximum extent permitted by applicable Indian law, ' +
        TERMS_META.legalBusinessName +
        ' shall not be liable for any indirect, incidental, special, or consequential losses arising out of your use of, or inability to use, the Website.',
      'Nothing in these Terms excludes or limits liability where doing so would be unlawful under applicable Indian consumer protection laws, including liability for defective products or statutory consumer rights that cannot be waived by contract.',
    ],
  },
  {
    number: 16,
    title: 'Disclaimer of Warranties',
    paragraphs: [
      'While we work to keep the Website accurate, secure, and accessible, the Website and its content are provided on an "as is" and "as available" basis without warranties of uninterrupted availability or error-free operation.',
      'We may occasionally update product listings, correct typographical errors, or perform maintenance that temporarily affects Website access.',
    ],
  },
  {
    number: 17,
    title: 'Privacy and Personal Information',
    paragraphs: [
      'Your privacy matters to us. Any personal details you share while browsing, contacting support, or placing an order are handled in accordance with our Privacy Policy.',
      'Please review our Privacy Policy to understand what information is collected, how it is used, and how you can reach us regarding your data.',
    ],
    linkTo: {
      label: 'Read our Privacy Policy',
      path: '/privacy-policy',
    },
  },
  {
    number: 18,
    title: 'Changes to These Terms',
    paragraphs: [
      'We may update these Terms and Conditions from time to time to reflect changes in our store operations, policies, or applicable legal requirements.',
      'Any updates will be posted on this page with a revised "Last updated" date. Continued use of the Website after changes are posted indicates your acceptance of the updated Terms.',
    ],
  },
  {
    number: 19,
    title: 'Governing Law and Jurisdiction',
    paragraphs: [
      'These Terms and Conditions and any transactions entered into through the Website are governed by and construed in accordance with the laws of India.',
      `Subject to applicable Indian consumer protection laws, any disputes arising in connection with these Terms shall be subject to the courts in ${TERMS_META.jurisdiction}.`,
    ],
  },
  {
    number: 20,
    title: 'Contact Information',
    paragraphs: [
      'If you have questions about these Terms and Conditions, your order, or our policies, please reach out to us:',
      `Legal Entity: ${TERMS_META.legalBusinessName} | Support Email: ${TERMS_META.supportEmail} | Phone: ${TERMS_META.supportPhone} | Support Hours: ${TERMS_META.supportHours} | Address: ${TERMS_META.businessAddress}`,
    ],
    linkTo: {
      label: 'Go to Contact Page',
      path: '/contact',
    },
  },
];
