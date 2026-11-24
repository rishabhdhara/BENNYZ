export type FitCategory = 'Oversized' | 'Boxy' | 'Regular';

export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface ProductColor {
  name: string;
  hex: string;
  code: string;
}

export interface ProductSpecification {
  gsm: number;
  composition: string;
  weave: string;
  origin: string;
  careInstructions: string[];
  sampleNotice: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  story: string;
  fit: FitCategory;
  category: string;
  colors: ProductColor[];
  defaultColor: ProductColor;
  availableSizes: ProductSize[];
  inStock: boolean;
  stockCount: Record<ProductSize, number>;
  images: {
    front: string;
    back: string;
    detail: string;
    lifestyle: string;
    extra?: string[];
  };
  specifications: ProductSpecification;
  modelInfo: {
    height: string;
    chest: string;
    sizeWorn: ProductSize;
  };
  isNewArrival?: boolean;
  isBestseller?: boolean;
  dropNumber: string;
}

export interface CartItem {
  id: string; // unique item id (productId + color + size)
  productId: string;
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
  season: string;
  location: string;
  image: string;
  quote?: string;
  taggedProductIds: string[];
  stylingNotes: string;
}
