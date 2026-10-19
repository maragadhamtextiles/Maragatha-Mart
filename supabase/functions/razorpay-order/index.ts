import { corsHeaders, env, json, razorpay, serviceClient } from '../_shared/razorpay.ts';

/**
 * Starts an online payment for one of our orders.
 *
 * In:  { order_id, phone }  (the phone the order was placed with: the same
 *      proof Track Order asks for, so an order id alone pays nothing)
 * Out: what Razorpay Checkout needs: key, Razorpay order id, amount.
 *
 * The amount is whatever the database says is still due on the order. The
 * browser does not send one.
 */

interface Prepared {
  order_id: string;
  short_id: string | null;
  amount_due: number;
  amount_paise: number;
  name: string | null;
  email: string | null;
  phone: string | null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  try {
    const { order_id, phone } = await req.json().catch(() => ({}));
    if (typeof order_id !== 'string' || typeof phone !== 'string') {
      return json({ error: 'order_id and phone are required' }, 400);
    }

    const db = serviceClient();
    const { data, error } = await db.rpc('razorpay_prepare_payment', { p_order_id: order_id, p_phone: phone });
    if (error) return json({ error: error.message }, 400);
    const order = data as Prepared;

    const rzp = await razorpay<{ id: string; amount: number; currency: string }>('/orders', {
      method: 'POST',
      body: JSON.stringify({
        amount: order.amount_paise,
        currency: 'INR',
        receipt: order.short_id ?? order.order_id.slice(0, 40),
        notes: { order_id: order.order_id, short_id: order.short_id ?? '' },
      }),
    });

    const { error: attemptError } = await db.rpc('razorpay_record_attempt', {
      p_order_id: order.order_id,
      p_provider_order_id: rzp.id,
      p_amount_paise: rzp.amount,
    });
    if (attemptError) throw new Error(attemptError.message);

    // A guest order with no email is stored as "-"; Checkout would show it.
    const email = order.email && order.email.includes('@') ? order.email : undefined;

    return json({
      key_id: env('RAZORPAY_KEY_ID'),
      razorpay_order_id: rzp.id,
      amount: rzp.amount,
      currency: rzp.currency,
      short_id: order.short_id,
      amount_due: order.amount_due,
      prefill: { name: order.name ?? undefined, email, contact: order.phone ?? undefined },
    });
  } catch (err) {
    console.error('razorpay-order failed:', err);
    return json({ error: err instanceof Error ? err.message : 'Could not start the payment' }, 500);
  }
});
