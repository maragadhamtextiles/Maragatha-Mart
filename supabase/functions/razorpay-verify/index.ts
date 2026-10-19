import { checkoutSignatureValid, corsHeaders, json, razorpay, serviceClient } from '../_shared/razorpay.ts';

/**
 * Called by the browser when Razorpay Checkout reports success.
 *
 * In:  { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 *
 * The signature is checked with the key secret, so a browser cannot invent a
 * successful payment. The payment is then fetched from Razorpay to make sure
 * it belongs to that order and has really been taken, before it is entered
 * in the ledger. razorpay-webhook records the same payment independently;
 * whichever arrives second changes nothing.
 */

interface Payment {
  id: string;
  order_id: string;
  status: string;
  amount: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json().catch(() => ({}));
    if (![razorpay_order_id, razorpay_payment_id, razorpay_signature].every((v) => typeof v === 'string' && v)) {
      return json({ error: 'Payment details are missing' }, 400);
    }

    if (!(await checkoutSignatureValid(razorpay_order_id, razorpay_payment_id, razorpay_signature))) {
      return json({ error: 'The payment could not be verified' }, 400);
    }

    const payment = await razorpay<Payment>(`/payments/${encodeURIComponent(razorpay_payment_id)}`);
    if (payment.order_id !== razorpay_order_id) {
      return json({ error: 'The payment does not belong to this order' }, 400);
    }
    // "authorized" is accepted too: the account captures automatically, and
    // the webhook confirms the capture.
    if (payment.status !== 'captured' && payment.status !== 'authorized') {
      return json({ error: `The payment is ${payment.status}` }, 400);
    }

    const { data, error } = await serviceClient().rpc('razorpay_mark_paid', {
      p_provider_order_id: razorpay_order_id,
      p_payment_id: razorpay_payment_id,
    });
    if (error) throw new Error(error.message);

    return json({ ok: true, ...data });
  } catch (err) {
    console.error('razorpay-verify failed:', err);
    return json({ error: err instanceof Error ? err.message : 'Could not confirm the payment' }, 500);
  }
});
