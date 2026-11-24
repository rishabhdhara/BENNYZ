import { Product, LookbookLook } from '../types';

export const SAMPLE_SPECIFICATION_NOTICE = 
  "Specifications shown (GSM, yarn count, fabric weave) are illustrative sample data for the BENNYS Drop 001 prototype collection.";

export const PRODUCTS: Product[] = [
  {
    id: "bennys-001",
    slug: "the-essential-white-tee",
    name: "The Essential White Tee",
    tagline: "Crisp architectural cut in heavyweight combed cotton.",
    price: 1499,
    compareAtPrice: 1899,
    description: 
      "A masterclass in daily understatement. Cut from custom 220 GSM ring-spun combed cotton, The Essential White Tee features a structured ribbed collar that never sags, dropped shoulders for a modern drape, and blind-stitched hems.",
    story: 
      "We spent 8 months testing 24 collar ribs to guarantee a neckline that stays sharp after 50 washes. Finished with an enzyme wash for an impossibly soft handfeel that retains its architectural shape.",
    fit: "Boxy",
    category: "Essential",
    colors: [
      { name: "Chalk White", hex: "#FFFFFF", code: "WHT" },
      { name: "Warm Ivory", hex: "#EDE6D9", code: "IVR" },
      { name: "Onyx Black", hex: "#171717", code: "BLK" }
    ],
    defaultColor: { name: "Chalk White", hex: "#FFFFFF", code: "WHT" },
    availableSizes: ["XS", "S", "M", "L", "XL", "XXL"],
    inStock: true,
    stockCount: { XS: 4, S: 12, M: 18, L: 15, XL: 8, XXL: 5 },
    images: {
      front: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85",
      back: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=85",
      detail: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=85",
      lifestyle: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=85",
      extra: [
        "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=85"
      ]
    },
    specifications: {
      gsm: 220,
      composition: "100% Long-Staple Combed Cotton",
      weave: "Single Jersey (28s count)",
      origin: "Knit & Crafted in Tirupur, India",
      careInstructions: [
        "Cold machine wash at 30°C inside out",
        "Do not bleach or dry clean",
        "Hang dry in shade to maintain drape",
        "Warm iron on reverse side"
      ],
      sampleNotice: SAMPLE_SPECIFICATION_NOTICE
    },
    modelInfo: {
      height: "6'1\" (185 cm)",
      chest: "39 inches",
      sizeWorn: "L"
    },
    isNewArrival: true,
    isBestseller: true,
    dropNumber: "DROP 001"
  },
  {
    id: "bennys-002",
    slug: "the-essential-black-tee",
    name: "The Essential Black Tee",
    tagline: "Deep carbon shade in our signature heavyweight silhouette.",
    price: 1699,
    compareAtPrice: 2099,
    description: 
      "The cornerstone of modern minimal dressing. Made with 240 GSM dense cotton jersey, finished with reactive dye to retain pure deep carbon black without fading. Cut with an easy oversized shoulder and clean sleeve pitch.",
    story: 
      "Tailored to fall away from the torso cleanly rather than cling. A subtle side split at the hem allows fluid movement and seamless layering over shirts or jackets.",
    fit: "Oversized",
    category: "Essential",
    colors: [
      { name: "Onyx Black", hex: "#171717", code: "BLK" },
      { name: "Slate Charcoal", hex: "#323232", code: "CHR" },
      { name: "Midnight Navy", hex: "#1F2937", code: "NVY" }
    ],
    defaultColor: { name: "Onyx Black", hex: "#171717", code: "BLK" },
    availableSizes: ["S", "M", "L", "XL", "XXL"],
    inStock: true,
    stockCount: { XS: 0, S: 10, M: 22, L: 20, XL: 11, XXL: 4 },
    images: {
      front: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=85",
      back: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=85",
      detail: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85",
      lifestyle: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=85",
      extra: [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85"
      ]
    },
    specifications: {
      gsm: 240,
      composition: "100% Ringspun Compact Cotton",
      weave: "Heavy Single Jersey",
      origin: "Knit & Crafted in Tirupur, India",
      careInstructions: [
        "Machine wash cold with like dark colours",
        "Wash inside out to preserve dye depth",
        "Line dry in shade",
        "Do not tumble dry"
      ],
      sampleNotice: SAMPLE_SPECIFICATION_NOTICE
    },
    modelInfo: {
      height: "6'0\" (183 cm)",
      chest: "38 inches",
      sizeWorn: "M"
    },
    isNewArrival: false,
    isBestseller: true,
    dropNumber: "DROP 001"
  },
  {
    id: "bennys-003",
    slug: "the-mocha-oversized-tee",
    name: "The Mocha Oversized Tee",
    tagline: "Warm tonal sophistication with sculpted relaxed drape.",
    price: 1899,
    compareAtPrice: 2299,
    description: 
      "The definition of quiet luxury. Tinted in our signature espresso-infused mocha tone, this 260 GSM heavyweight tee offers substantive weight and a clean, box-cut silhouette that feels structured yet effortless.",
    story: 
      "Developed inspired by mid-century earth pigments. Each batch is yarn-dyed before knitting to ensure luminous color saturation and zero surface pilling.",
    fit: "Oversized",
    category: "Seasonal",
    colors: [
      { name: "Mocha Brown", hex: "#92785F", code: "MCH" },
      { name: "Muted Sand", hex: "#B8A58C", code: "SND" },
      { name: "Warm Ivory", hex: "#EDE6D9", code: "IVR" }
    ],
    defaultColor: { name: "Mocha Brown", hex: "#92785F", code: "MCH" },
    availableSizes: ["XS", "S", "M", "L", "XL"],
    inStock: true,
    stockCount: { XS: 3, S: 8, M: 14, L: 16, XL: 7, XXL: 0 },
    images: {
      front: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=85",
      back: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85",
      detail: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=85",
      lifestyle: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=1000&q=85",
      extra: [
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=85"
      ]
    },
    specifications: {
      gsm: 260,
      composition: "100% Cotton French Terry Loopback",
      weave: "Knitted French Terry",
      origin: "Crafted in Coimbatore, India",
      careInstructions: [
        "Gentle cycle wash at 30°C",
        "Wash with similar earth hues",
        "Reshape while damp",
        "Iron medium on reverse"
      ],
      sampleNotice: SAMPLE_SPECIFICATION_NOTICE
    },
    modelInfo: {
      height: "6'2\" (188 cm)",
      chest: "40 inches",
      sizeWorn: "L"
    },
    isNewArrival: true,
    isBestseller: true,
    dropNumber: "DROP 001"
  },
  {
    id: "bennys-004",
    slug: "the-stone-boxy-tee",
    name: "The Stone Boxy Tee",
    tagline: "Sculpted architectural lines with shortened body length.",
    price: 1599,
    compareAtPrice: 1999,
    description: 
      "Engineered for the contemporary silhouette. The Stone Boxy Tee features a slightly cropped torso and widened chest measurements that pair effortlessly with wide-leg trousers and tailored shorts.",
    story: 
      "The stone wash treatment gives this piece a soft, matte tactile texture reminiscent of travertine stone, celebrating natural mineral hues.",
    fit: "Boxy",
    category: "Signature",
    colors: [
      { name: "Muted Sand", hex: "#B8A58C", code: "SND" },
      { name: "Warm Ivory", hex: "#EDE6D9", code: "IVR" },
      { name: "Ash Grey", hex: "#A8A29E", code: "ASH" }
    ],
    defaultColor: { name: "Muted Sand", hex: "#B8A58C", code: "SND" },
    availableSizes: ["XS", "S", "M", "L", "XL", "XXL"],
    inStock: true,
    stockCount: { XS: 6, S: 15, M: 20, L: 18, XL: 9, XXL: 3 },
    images: {
      front: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=85",
      back: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85",
      detail: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=85",
      lifestyle: "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=1000&q=85",
      extra: [
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=85"
      ]
    },
    specifications: {
      gsm: 220,
      composition: "100% Compact Organic Cotton",
      weave: "Silicone Washed Jersey",
      origin: "Knit & Crafted in Tirupur, India",
      careInstructions: [
        "Machine wash cold",
        "Wash separately for first two washes",
        "Dry flat away from direct sunlight",
        "Iron on low heat"
      ],
      sampleNotice: SAMPLE_SPECIFICATION_NOTICE
    },
    modelInfo: {
      height: "5'11\" (180 cm)",
      chest: "37 inches",
      sizeWorn: "M"
    },
    isNewArrival: false,
    isBestseller: true,
    dropNumber: "DROP 001"
  },
  {
    id: "bennys-005",
    slug: "the-midnight-navy-tee",
    name: "The Midnight Navy Tee",
    tagline: "Sleek tailored drape in mercerized high-gauge cotton.",
    price: 1399,
    compareAtPrice: 1799,
    description: 
      "Understated refinement for formal and casual transitions. Crafted with 210 GSM mercerized cotton, granting a subtle natural sheen, crisper drape, and high resistance to shrinkage.",
    story: 
      "The regular fit is subtly tapered at the waist for an uncluttered look under an unconstructed blazer or worn solo with ecru linen trousers.",
    fit: "Regular",
    category: "Classic",
    colors: [
      { name: "Midnight Navy", hex: "#1E293B", code: "NVY" },
      { name: "Onyx Black", hex: "#171717", code: "BLK" },
      { name: "Chalk White", hex: "#FFFFFF", code: "WHT" }
    ],
    defaultColor: { name: "Midnight Navy", hex: "#1E293B", code: "NVY" },
    availableSizes: ["S", "M", "L", "XL", "XXL"],
    inStock: true,
    stockCount: { XS: 0, S: 7, M: 16, L: 14, XL: 8, XXL: 2 },
    images: {
      front: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=1000&q=85",
      back: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85",
      detail: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=85",
      lifestyle: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=1000&q=85",
      extra: []
    },
    specifications: {
      gsm: 210,
      composition: "100% Double-Mercerized Long Staple Cotton",
      weave: "Fine Interlock Knit",
      origin: "Knit & Crafted in Tirupur, India",
      careInstructions: [
        "Delicate wash cycle in cold water",
        "Wash with mild liquid detergent",
        "Do not wring",
        "Steam or cool iron on reverse"
      ],
      sampleNotice: SAMPLE_SPECIFICATION_NOTICE
    },
    modelInfo: {
      height: "6'1\" (185 cm)",
      chest: "39 inches",
      sizeWorn: "L"
    },
    isNewArrival: false,
    isBestseller: false,
    dropNumber: "DROP 001"
  },
  {
    id: "bennys-006",
    slug: "the-classic-grey-tee",
    name: "The Classic Grey Tee",
    tagline: "Two-tone heather loopback cotton with substantial hand.",
    price: 1499,
    compareAtPrice: 1899,
    description: 
      "The undisputed foundational piece. Spun from two-tone melange yarns to achieve depth and texture, this 220 GSM boxy tee provides athletic heritage with quiet luxury finishing.",
    story: 
      "We adjusted the sleeve pitch by 7 degrees to guarantee that the fabric falls naturally without bunching around the underarm or shoulder seam.",
    fit: "Boxy",
    category: "Signature",
    colors: [
      { name: "Heather Grey", hex: "#9CA3AF", code: "HGR" },
      { name: "Onyx Black", hex: "#171717", code: "BLK" },
      { name: "Chalk White", hex: "#FFFFFF", code: "WHT" }
    ],
    defaultColor: { name: "Heather Grey", hex: "#9CA3AF", code: "HGR" },
    availableSizes: ["XS", "S", "M", "L", "XL", "XXL"],
    inStock: true,
    stockCount: { XS: 5, S: 11, M: 19, L: 17, XL: 9, XXL: 4 },
    images: {
      front: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=85",
      back: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85",
      detail: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=85",
      lifestyle: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=85",
      extra: []
    },
    specifications: {
      gsm: 220,
      composition: "90% Combed Cotton, 10% Micro Poly-Melange",
      weave: "Heathered Single Jersey",
      origin: "Knit & Crafted in Tirupur, India",
      careInstructions: [
        "Standard machine wash cold",
        "Wash with light and grey tones",
        "Line dry in shade",
        "Iron on medium"
      ],
      sampleNotice: SAMPLE_SPECIFICATION_NOTICE
    },
    modelInfo: {
      height: "6'0\" (183 cm)",
      chest: "38 inches",
      sizeWorn: "M"
    },
    isNewArrival: false,
    isBestseller: true,
    dropNumber: "DROP 001"
  },
  {
    id: "bennys-007",
    slug: "the-washed-olive-tee",
    name: "The Washed Olive Tee",
    tagline: "Pigment dyed heavyweight cotton with soft vintage patina.",
    price: 1799,
    compareAtPrice: 2199,
    description: 
      "Artfully garment-dyed in small batches with mineral pigments to create subtle highs and lows along the seams and collar. A 240 GSM heavy silhouette built for relaxed, confident days.",
    story: 
      "Pre-shrunk and enzyme washed to ensure the relaxed drape you buy on day one remains unchanged after months of regular wear.",
    fit: "Oversized",
    category: "Seasonal",
    colors: [
      { name: "Washed Olive", hex: "#556B2F", code: "OLV" },
      { name: "Mocha Brown", hex: "#92785F", code: "MCH" },
      { name: "Onyx Black", hex: "#171717", code: "BLK" }
    ],
    defaultColor: { name: "Washed Olive", hex: "#556B2F", code: "OLV" },
    availableSizes: ["S", "M", "L", "XL"],
    inStock: true,
    stockCount: { XS: 0, S: 8, M: 15, L: 12, XL: 6, XXL: 0 },
    images: {
      front: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85",
      back: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=85",
      detail: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=85",
      lifestyle: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=85",
      extra: []
    },
    specifications: {
      gsm: 240,
      composition: "100% Pigment-Dyed Ringspun Cotton",
      weave: "Heavy Open-End Jersey",
      origin: "Knit & Crafted in Tirupur, India",
      careInstructions: [
        "Cold wash inside out",
        "Wash with dark or olive colours",
        "Color will gently evolve and personalize over time",
        "Line dry in shade"
      ],
      sampleNotice: SAMPLE_SPECIFICATION_NOTICE
    },
    modelInfo: {
      height: "6'2\" (188 cm)",
      chest: "41 inches",
      sizeWorn: "L"
    },
    isNewArrival: true,
    isBestseller: false,
    dropNumber: "DROP 001"
  },
  {
    id: "bennys-008",
    slug: "the-raw-sand-minimal-tee",
    name: "The Raw Sand Minimal Tee",
    tagline: "Unbleached natural ecru tones with tactile organic hand.",
    price: 1599,
    compareAtPrice: 1999,
    description: 
      "Honoring raw cotton in its most authentic state. Crafted from unbleached combed cotton retaining micro specks of natural cotton seed, creating an organic tactile surface that breathes impeccably.",
    story: 
      "Eliminating the bleaching phase reduces water consumption by 35% while yielding a warm, timeless ivory hue that pairs effortlessly with dark denim or earthy chinos.",
    fit: "Regular",
    category: "Signature",
    colors: [
      { name: "Raw Sand", hex: "#D7C4B7", code: "SND" },
      { name: "Warm Ivory", hex: "#EDE6D9", code: "IVR" },
      { name: "Chalk White", hex: "#FFFFFF", code: "WHT" }
    ],
    defaultColor: { name: "Raw Sand", hex: "#D7C4B7", code: "SND" },
    availableSizes: ["XS", "S", "M", "L", "XL", "XXL"],
    inStock: true,
    stockCount: { XS: 4, S: 10, M: 17, L: 14, XL: 8, XXL: 3 },
    images: {
      front: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=85",
      back: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=85",
      detail: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=85",
      lifestyle: "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=1000&q=85",
      extra: []
    },
    specifications: {
      gsm: 230,
      composition: "100% Unbleached Virgin Cotton",
      weave: "Natural Seed Jersey",
      origin: "Knit & Crafted in Tirupur, India",
      careInstructions: [
        "Cold wash with gentle eco detergent",
        "Do not use optical brighteners or bleach",
        "Reshape and hang dry",
        "Medium steam iron"
      ],
      sampleNotice: SAMPLE_SPECIFICATION_NOTICE
    },
    modelInfo: {
      height: "6'1\" (185 cm)",
      chest: "39 inches",
      sizeWorn: "L"
    },
    isNewArrival: true,
    isBestseller: true,
    dropNumber: "DROP 001"
  }
];

export const LOOKBOOK_LOOKS: LookbookLook[] = [
  {
    id: "look-01",
    title: "Monochrome Study in Ivory & Chalk",
    season: "Drop 001 / Edition Summer-Fall",
    location: "Studio Brutalist, New Delhi",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85",
    quote: "A silhouette that holds its ground without shouting.",
    taggedProductIds: ["bennys-001"],
    stylingNotes: "Paired with relaxed wide-leg ecru trousers and leather slide sandals."
  },
  {
    id: "look-02",
    title: "The Architecture of Heavyweight Cotton",
    season: "Drop 001 / Architectural Series",
    location: "Jawahar Kala Kendra, Jaipur",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=85",
    quote: "The weight of the cloth dictates the beauty of the drape.",
    taggedProductIds: ["bennys-003", "bennys-004"],
    stylingNotes: "Layered with tailored mocha pleated shorts and raw canvas tote."
  },
  {
    id: "look-03",
    title: "Dusk in Charcoal & Onyx",
    season: "Drop 001 / Nocturne",
    location: "Concrete Pavilions, Chandigarh",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85",
    quote: "Pure black, zero compromise on fabric structure.",
    taggedProductIds: ["bennys-002"],
    stylingNotes: "Worn solo over washed black relaxed denim with matte derby shoes."
  },
  {
    id: "look-04",
    title: "Minimalist Geometry & Raw Earth",
    season: "Drop 001 / Earth Studies",
    location: "Minimalist Villa, Bangalore",
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=1200&q=85",
    quote: "Everyday clothing, elevated into an art form.",
    taggedProductIds: ["bennys-007", "bennys-008"],
    stylingNotes: "Styled with olive relaxed fatigue pants and understated silver ring."
  },
  {
    id: "look-05",
    title: "The Boxy Proportion Under Daylight",
    season: "Drop 001 / Sun & Shadow",
    location: "Fort Kochi Waterfront, Kerala",
    image: "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=1200&q=85",
    quote: "Proportion over decoration. Fit over flash.",
    taggedProductIds: ["bennys-004", "bennys-006"],
    stylingNotes: "Combined with charcoal linen trousers and acetate sunglasses."
  }
];

export const SIZE_CHART_DATA = [
  { size: "XS", chestInches: "36 - 38", chestCm: "91 - 96", lengthInches: "27.5", lengthCm: "70", shoulderInches: "19.5" },
  { size: "S", chestInches: "38 - 40", chestCm: "96 - 101", lengthInches: "28.5", lengthCm: "72", shoulderInches: "20.5" },
  { size: "M", chestInches: "40 - 42", chestCm: "101 - 107", lengthInches: "29.5", lengthCm: "75", shoulderInches: "21.5" },
  { size: "L", chestInches: "42 - 44", chestCm: "107 - 112", lengthInches: "30.5", lengthCm: "77", shoulderInches: "22.5" },
  { size: "XL", chestInches: "44 - 46", chestCm: "112 - 117", lengthInches: "31.5", lengthCm: "80", shoulderInches: "23.5" },
  { size: "XXL", chestInches: "46 - 48", chestCm: "117 - 122", lengthInches: "32.5", lengthCm: "82", shoulderInches: "24.5" },
];
