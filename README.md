# BENNYS — EVERYDAY. ELEVATED.
### Premium Men's T-Shirt Contemporary Fashion E-Commerce Platform

---

## 1. BRAND IDENTITY & CREATIVE VISION

**BENNYS** is an affordable-luxury menswear label engineered around the philosophy of **"Everyday clothing, elevated through fit, fabric, details and presentation."**

- **Brand Tagline:** *"EVERYDAY. ELEVATED."*
- **Positioning:** Contemporary minimal luxury menswear.
- **Target Demographic:** Men aged 18–35 in India seeking substantial fabric weight, calibrated drapes, and timeless design without fast-fashion degradation or four-figure luxury markups.
- **Price Range:** ₹1,000 – ₹3,000 (all prices shown in Indian Rupees ₹).
- **Core Product Silhouettes:**
  - **The Oversized Cut:** 240–260 GSM heavyweight cotton with dropped shoulders and relaxed drape.
  - **The Boxy Silhouette:** 220 GSM compact cotton with squared chest and shortened body length.
  - **The Classic Regular:** 210 GSM double-mercerized cotton for formal and casual layering.

---

## 2. LUXURY DESIGN SYSTEM

The visual identity follows a quiet-luxury, editorial magazine aesthetic inspired by contemporary fashion ateliers (*The Row, Lemaire, Studio Nicholson*).

### Color Palette
- **Primary Black (`#171717`):** Signature carbon black for typography, hero backgrounds, and primary CTAs.
- **Warm Ivory (`#EDE6D9`):** Refined secondary accent, badge pill background, and editorial borders.
- **Off-White (`#F7F5F0`):** Soft, natural paper background reducing optical glare.
- **Mocha Brown (`#92785F`):** Earthy luxury tone for sub-headings, icons, and highlights.
- **Muted Sand (`#B8A58C`):** Architectural stone tint used in borders and dividers.
- **Secondary Text (`#77736C`):** Low-contrast understated text color for metadata and descriptions.

### Typography
- **Editorial Headings:** `Cormorant Garamond` (Google Fonts serif) — high-fashion typography for hero banners, brand statements, and collection titles.
- **Navigation & Commerce UI:** `Plus Jakarta Sans` (Google Fonts geometric sans-serif) — high legibility, crisp letter spacing, and clean modern execution.

---

## 3. PROJECT ARCHITECTURE

```
d:\Bennys\
├── index.html                  # HTML5 entry with Google Fonts & luxury SEO tags
├── package.json                # Project dependencies and script scripts
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite 6 configuration (Port 3000, React plugin)
├── tailwind.config.js          # Custom theme with brand colors and typography
├── postcss.config.js           # PostCSS and Autoprefixer
├── src/
│   ├── main.tsx                # React application entrypoint
│   ├── App.tsx                 # Master layout and client-side router
│   ├── types/
│   │   └── index.ts            # Full TypeScript schemas for Products, Cart, Address, etc.
│   ├── data/
│   │   └── products.ts         # Central product catalogue & lookbook database
│   ├── context/
│   │   └── CartContext.tsx     # Reactive cart state, localStorage sync & promo logic
│   ├── utils/
│   │   └── formatters.ts       # INR currency formatter & Indian PIN code validator
│   ├── styles/
│   │   └── index.css           # Tailwind directives & luxury scrollbar styling
│   ├── components/
│   │   ├── Header.tsx          # Sticky glass navigation, announcement bar & mobile drawer
│   │   ├── Footer.tsx          # Editorial footer with newsletter, policies & trust badges
│   │   ├── ProductCard.tsx     # Hover image swap, color swatches & quick size add
│   │   ├── CartDrawer.tsx      # Slide-over shopping bag with free shipping progress
│   │   ├── SizeChartModal.tsx  # Measurement table (Inches/CM toggle) & fit guide
│   │   ├── DeliveryChecker.tsx # Indian PIN code delivery & COD estimator
│   │   ├── QuickSearchModal.tsx# Instant live product search modal
│   │   ├── AccountModal.tsx    # VIP client suite & simulated order tracking lookup
│   │   ├── ToastNotification.tsx # Reactive luxury toast notifications
│   │   └── ScrollToTop.tsx     # Automatic scroll restoration on page change
│   └── pages/
│       ├── Home.tsx            # High-fashion editorial homepage
│       ├── Shop.tsx            # Product catalogue with sidebar & drawer filtering
│       ├── ProductDetails.tsx  # Gallery, size selector, GSM info & delivery checker
│       ├── Lookbook.tsx        # Curated editorial gallery with shoppable links
│       ├── OurStory.tsx        # "Built Around The Everyday" brand manifesto
│       ├── Support.tsx         # Contact concierge, FAQs, shipping, returns, order track
│       ├── Cart.tsx            # Dedicated shopping bag page
│       ├── Checkout.tsx        # Indian customer checkout with UPI, Cards, COD & demo mode
│       └── NotFound.tsx        # Minimalist 404 error page
```

---

## 4. INSTRUCTIONS & COMMANDS

### Installation
```bash
# Install dependencies
npm install
```

### Development Server
```bash
# Launch development server
npm run dev
# The server runs at http://localhost:3000
```

### Production Build
```bash
# Build production bundle with TypeScript checking
npm run build

# Preview production build locally
npm run preview
```

---

## 5. CUSTOMIZATION GUIDE

### A. How to Add or Modify Products
All product inventory is centralized in:
`src/data/products.ts`

To add a new product, append a new object to the `PRODUCTS` array:
```typescript
{
  id: "bennys-009",
  slug: "the-terracotta-oversized-tee",
  name: "The Terracotta Oversized Tee",
  tagline: "Rich mineral dye in 240 GSM dense cotton.",
  price: 1799,
  compareAtPrice: 2199,
  description: "Detailed description of the garment architecture...",
  story: "Inspiration and knitting details...",
  fit: "Oversized", // "Oversized" | "Boxy" | "Regular"
  category: "Seasonal",
  colors: [
    { name: "Terracotta", hex: "#C86D51", code: "TER" }
  ],
  defaultColor: { name: "Terracotta", hex: "#C86D51", code: "TER" },
  availableSizes: ["S", "M", "L", "XL"],
  inStock: true,
  stockCount: { XS: 0, S: 10, M: 15, L: 12, XL: 6, XXL: 0 },
  images: {
    front: "https://your-cdn.com/front.jpg",
    back: "https://your-cdn.com/back.jpg",
    detail: "https://your-cdn.com/detail.jpg",
    lifestyle: "https://your-cdn.com/lifestyle.jpg"
  },
  specifications: {
    gsm: 240,
    composition: "100% Combed Cotton",
    weave: "Heavy Single Jersey",
    origin: "Knit & Crafted in Tirupur, India",
    careInstructions: ["Cold machine wash", "Line dry in shade"],
    sampleNotice: SAMPLE_SPECIFICATION_NOTICE
  },
  modelInfo: {
    height: "6'1\" (185 cm)",
    chest: "39 inches",
    sizeWorn: "L"
  },
  isNewArrival: true,
  isBestseller: false,
  dropNumber: "DROP 001"
}
```

### B. How to Replace Photographs
High-resolution photography is referenced inside `src/data/products.ts` under each product's `images` object.
You can replace image URLs with your own CDN assets or local images stored in `public/images/`.

### C. Connecting Real Razorpay Payments
The checkout architecture (`src/pages/Checkout.tsx`) is designed for seamless Razorpay drop-in:
1. Install Razorpay script in `index.html`:
   ```html
   <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
   ```
2. In `src/pages/Checkout.tsx`, call the Razorpay order creation API:
   ```javascript
   const options = {
     key: "YOUR_RAZORPAY_KEY_ID",
     amount: total * 100, // in paise
     currency: "INR",
     name: "BENNYS",
     description: "Order #" + generatedOrderId,
     order_id: razorpayOrderId,
     handler: function (response) {
       // Verify payment signature on your backend
       console.log(response.razorpay_payment_id);
     },
     prefill: {
       name: address.fullName,
       email: address.email,
       contact: address.phone
     },
     theme: {
       color: "#171717"
     }
   };
   const rzp = new window.Razorpay(options);
   rzp.open();
   ```

### D. Deploying the Website
- **Vercel:** Run `vercel` or link your Git repository. Build command: `npm run build`, Output directory: `dist`.
- **Netlify:** Build command: `npm run build`, Publish directory: `dist`. Add `_redirects` with `/* /index.html 200` for client-side routing.
- **Cloudflare Pages:** Connect GitHub repo, Framework preset: `Vite`, Output: `dist`.
# BENNYZ
