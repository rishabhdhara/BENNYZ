import { createClient } from '@supabase/supabase-js';
import type { CalculatedOrderTotals } from './pricing';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isSupabaseAdminConfigured = Boolean(supabaseUrl && serviceRoleKey);

export const supabaseAdmin = isSupabaseAdminConfigured
  ? createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;

/**
 * Validates the user's Supabase JWT from the Authorization header so
 * client requests cannot spoof another customer's user_id.
 */
export async function resolveUserIdFromAuthHeader(
  authHeader?: string
): Promise<string | null> {
  if (!supabaseAdmin || !authHeader) return null;
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;

  const { data, error } = await supabaseAdmin.auth.getUser(match[1]);
  if (error || !data?.user) return null;
  return data.user.id;
}

export interface PersistOrderInput {
  orderNumber: string;
  userId: string | null;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: Record<string, unknown>;
  paymentMethod: string;
  paymentStatus: 'paid' | 'cod_pending';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  discountCode?: string;
  totals: CalculatedOrderTotals;
  itemMetadata?: Array<{ productId: string; fit?: string; colorName?: string }>;
}

export async function persistConfirmedOrder(
  input: PersistOrderInput
): Promise<{ saved: boolean; orderId?: string; error?: string }> {
  if (!supabaseAdmin) {
    return { saved: false, error: 'Supabase server credentials not configured.' };
  }

  const { data: orderRow, error: orderErr } = await supabaseAdmin
    .from('orders')
    .insert({
      order_number: input.orderNumber,
      user_id: input.userId,
      customer_email: input.customerEmail,
      customer_name: input.customerName,
      customer_phone: input.customerPhone,
      shipping_address: input.shippingAddress,
      payment_method: input.paymentMethod,
      payment_status: input.paymentStatus,
      order_status: 'confirmed',
      razorpay_order_id: input.razorpayOrderId || null,
      razorpay_payment_id: input.razorpayPaymentId || null,
      discount_code: input.discountCode || null,
      subtotal: input.totals.subtotal,
      discount: input.totals.discount,
      shipping_fee: input.totals.shippingFee,
      total: input.totals.total,
    })
    .select('id')
    .single();

  if (orderErr || !orderRow) {
    return { saved: false, error: orderErr?.message || 'Failed to insert order.' };
  }

  const itemRows = input.totals.validatedItems.map((it, idx) => {
    const meta = input.itemMetadata?.[idx];
    return {
      order_id: orderRow.id,
      product_id: it.productId,
      product_name: it.name,
      fit: meta?.fit || '',
      color_name: meta?.colorName || it.colorCode || '',
      size: it.size,
      quantity: it.quantity,
      unit_price: it.unitPrice,
      line_total: it.lineTotal,
    };
  });

  const { error: itemsErr } = await supabaseAdmin.from('order_items').insert(itemRows);
  if (itemsErr) {
    return { saved: false, orderId: orderRow.id, error: itemsErr.message };
  }

  return { saved: true, orderId: orderRow.id };
}
