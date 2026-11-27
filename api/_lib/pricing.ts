import crypto from 'node:crypto';

export interface ServerOrderItemInput {
  productId: string;
  size: string;
  colorCode?: string;
  quantity: number;
}

/**
 * Authoritative product price map (INR) matching src/data/products.ts.
 * Server-side totals are always computed from this catalog rather than client inputs.
 */
export const CATALOG_PRICES_INR: Record<string, { name: string; price: number }> = {
  'bennyz-001': { name: 'Essentials Ivory Boxy Tee', price: 1199 },
  'bennyz-002': { name: 'Core Onyx Oversized Tee', price: 1299 },
  'bennyz-003': { name: 'Mocha Drop-Shoulder Tee', price: 1349 },
  'bennyz-004': { name: 'Gridline Graphic Back Tee', price: 1499 },
  'bennyz-005': { name: 'Daily Regular Crew — Black', price: 999 },
  'bennyz-006': { name: 'Sand Emblem Graphic Tee', price: 1399 },
  'bennyz-007': { name: 'Bone Boxy Minimal Tee', price: 1199 },
  'bennyz-008': { name: 'Midnight Regular Minimal Tee', price: 1099 },
  'bennyz-009': { name: 'Washed Olive Relaxed Tee', price: 1299 },
  'bennyz-010': { name: 'Forest Green Heavyweight Boxy Tee', price: 1399 },
  'bennyz-011': { name: 'Oxblood Gallery Crest Oversized Tee', price: 1499 },
  'bennyz-012': { name: 'Vintage Copper Garage Washed Tee', price: 1449 },
  'bennyz-013': { name: 'Midnight Structured Boxy Tee', price: 1299 },
};

const FREE_SHIPPING_THRESHOLD_INR = 1999;
const STANDARD_SHIPPING_FEE_INR = 99;

const PROMO_CODES: Record<string, number> = {
  EVERYDAY10: 10,
  BENNYZ10: 10,
};

export interface CalculatedOrderTotals {
  subtotal: number;
  discount: number;
  shippingFee: number;
  gstRatePercent: number;
  taxableAmount: number;
  taxAmount: number;
  total: number;
  amountInPaise: number;
  validatedItems: Array<{
    productId: string;
    name: string;
    size: string;
    colorCode: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
}

export function calculateServerOrderTotals(
  items: ServerOrderItemInput[],
  discountCode?: string
): CalculatedOrderTotals {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Order must contain at least one item.');
  }

  const validatedItems = items.map((item) => {
    const product = CATALOG_PRICES_INR[item.productId];
    if (!product) {
      throw new Error(`Unknown product ID: ${item.productId}`);
    }
    const qty = Math.floor(Number(item.quantity));
    if (!Number.isFinite(qty) || qty < 1 || qty > 25) {
      throw new Error(`Invalid quantity for ${product.name}`);
    }

    return {
      productId: item.productId,
      name: product.name,
      size: String(item.size || ''),
      colorCode: String(item.colorCode || ''),
      quantity: qty,
      unitPrice: product.price,
      lineTotal: product.price * qty,
    };
  });

  const subtotal = validatedItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const normalizedCode = (discountCode || '').trim().toUpperCase();
  const discountPercent = PROMO_CODES[normalizedCode] || 0;
  const discount = Math.round((subtotal * discountPercent) / 100);
  const afterDiscount = Math.max(0, subtotal - discount);
  const shippingFee = afterDiscount >= FREE_SHIPPING_THRESHOLD_INR ? 0 : STANDARD_SHIPPING_FEE_INR;
  const total = afterDiscount + shippingFee;

  // Tax-inclusive reverse calculation on total payable
  const rawGst = Number(process.env.GST_RATE_PERCENT ?? 5);
  const gstRatePercent = Number.isFinite(rawGst) && rawGst >= 0 && rawGst <= 28 ? rawGst : 5;
  const taxableAmount = Number((total / (1 + gstRatePercent / 100)).toFixed(2));
  const taxAmount = Number((total - taxableAmount).toFixed(2));

  return {
    subtotal,
    discount,
    shippingFee,
    gstRatePercent,
    taxableAmount,
    taxAmount,
    total,
    amountInPaise: total * 100,
    validatedItems,
  };
}

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string
): boolean {
  if (!orderId || !paymentId || !signature || !secret) return false;
  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  const expectedBuf = Buffer.from(expected, 'utf8');
  const providedBuf = Buffer.from(signature, 'utf8');
  if (expectedBuf.length !== providedBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, providedBuf);
}

export function verifyRazorpayWebhookSignature(
  rawBody: string,
  signature: string,
  webhookSecret: string
): boolean {
  if (!rawBody || !signature || !webhookSecret) return false;
  const expected = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  const expectedBuf = Buffer.from(expected, 'utf8');
  const providedBuf = Buffer.from(signature, 'utf8');
  if (expectedBuf.length !== providedBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, providedBuf);
}

export function generateInvoiceNumber(orderNumber: string): string {
  const year = new Date().getFullYear();
  const suffix = orderNumber.replace(/[^A-Z0-9]/gi, '').slice(-6) || Date.now().toString().slice(-6);
  return `INV-BZ-${year}-${suffix}`;
}
