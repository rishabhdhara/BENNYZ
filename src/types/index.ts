export type FitCategory = 'Oversized' | 'Boxy' | 'Regular';

export type StyleCategory = 'Essentials' | 'Minimal' | 'Graphic';

export type PaletteCollection = 'Forest Green' | 'Oxblood' | 'Vintage' | 'Midnight';

export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface ProductColor {
  name: string;
  hex: string;
  code: string;
}

export interface ProductSpecification {
  fabricWeight: string;
  composition: string;
  weave: string;
  origin: string;
  careInstructions: string[];
  specNotice: string;
}

export interface ProductImages {
  frontImage: string;
  backImage?: string;
  detailImage?: string;
  lifestyleImage?: string;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  tagline: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  fitNotes: string;
  fit: FitCategory;
  category: StyleCategory;
  collection?: PaletteCollection;
  colors: ProductColor[];
  defaultColor: ProductColor;
  availableSizes: ProductSize[];
  inStock: boolean;
  stockCount: Record<ProductSize, number>;
  images: ProductImages;
  specifications: ProductSpecification;
  modelInfo: {
    height: string;
    chest: string;
    sizeWorn: ProductSize;
  };
  isNewArrival?: boolean;
  isBestseller?: boolean;
  releaseTag: string;
}

export interface CartItem {
  id: string; // productId + color.code + size
  productId: string;
  slug: string;
  name: string;
  price: number;
  color: ProductColor;
  size: ProductSize;
  quantity: number;
  image: string;
  fit: FitCategory;
  maxStock: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  pinCode: string;
}

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod';

export interface LookbookLook {
  id: string;
  title: string;
  edition: string;
  setting: string;
  image: string;
  caption: string;
  taggedProductIds: string[];
  stylingNotes: string;
}
