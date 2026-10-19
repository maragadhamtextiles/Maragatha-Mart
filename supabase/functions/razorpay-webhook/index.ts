import { json, serviceClient, webhookSignatureValid } from '../_shared/razorpay.ts';

/**
 * Razorpay calls this directly when a payment is captured, so a payment is
 * recorded even if the customer closed the browser before Checkout returned.
 *
 * Deployed with --no-verify-jwt (Razorpay sends no Supabase token); the
 * X-Razorpay-Signature header, an HMAC of the raw body with the webhook
 * secret, is what proves the call came from Razorpay.
 *
 * Subscribe the webhook to: payment.captured, order.paid.
 */
Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  // The signature covers the exact bytes sent, so read the body as text and
  // parse it only after checking.
  const raw = await req.text();
  const signature = req.headers.get('x-razorpay-signature') ?? '';
  if (!signature || !(await webhookSignatureValid(raw, signature))) {
    return json({ error: 'Invalid signature' }, 401);
  }

  try {
    const event = JSON.parse(raw);
    const payment = event?.payload?.payment?.entity;
    const interesting = event?.event === 'payment.captured' || event?.event === 'order.paid';
    if (!interesting || !payment?.order_id || !payment?.id) {
      return json({ ok: true, ignored: event?.event ?? 'unknown' });
    }

    const { data, error } = await serviceClient().rpc('razorpay_mark_paid', {
      p_provider_order_id: payment.order_id,
      p_payment_id: payment.id,
    });
    if (error) {
      // A Razorpay order this shop did not create (another site on the same
      // account) is acknowledged, not retried forever.
      if (/Unknown Razorpay order/.test(error.message)) return json({ ok: true, ignored: 'unknown order' });
      throw new Error(error.message);
    }
    return json({ ok: true, ...data });
  } catch (err) {
    console.error('razorpay-webhook failed:', err);
    // A 5xx makes Razorpay retry later, which is what a transient failure needs.
    return json({ error: 'Webhook processing failed' }, 500);
  }
});
