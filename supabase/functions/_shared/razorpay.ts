import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

/**
 * What the three Razorpay functions share. Secrets come from the function
 * environment (`supabase secrets set ...`), never from the browser:
 *
 *   RAZORPAY_KEY_ID          rzp_test_… / rzp_live_… (public, sent to Checkout)
 *   RAZORPAY_KEY_SECRET      signs API calls and payment signatures
 *   RAZORPAY_WEBHOOK_SECRET  the secret typed into the Razorpay webhook form
 *
 * SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided by Supabase.
 */

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

export function env(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`${name} is not set for this function`);
  return value;
}

/** A client that acts as the database owner: only the payment RPCs are used. */
export function serviceClient() {
  return createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'), {
    auth: { persistSession: false },
  });
}

/** Calls the Razorpay REST API with the account's key pair. */
export async function razorpay<T>(path: string, init: RequestInit = {}): Promise<T> {
  const auth = btoa(`${env('RAZORPAY_KEY_ID')}:${env('RAZORPAY_KEY_SECRET')}`);
  const res = await fetch(`https://api.razorpay.com/v1${path}`, {
    ...init,
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json', ...(init.headers ?? {}) },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const reason = body?.error?.description ?? `Razorpay answered ${res.status}`;
    throw new Error(reason);
  }
  return body as T;
}

async function hmacHex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, '0')).join('');
}

/** Compares without leaking, through timing, how much of the signature matched. */
function sameText(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * Checkout's proof of payment: HMAC-SHA256 of "order_id|payment_id" with the
 * key secret. Only Razorpay and this server know the secret.
 */
export async function checkoutSignatureValid(orderId: string, paymentId: string, signature: string) {
  const expected = await hmacHex(env('RAZORPAY_KEY_SECRET'), `${orderId}|${paymentId}`);
  return sameText(expected, signature);
}

/** A webhook's proof: HMAC-SHA256 of the raw body with the webhook secret. */
export async function webhookSignatureValid(rawBody: string, signature: string) {
  const expected = await hmacHex(env('RAZORPAY_WEBHOOK_SECRET'), rawBody);
  return sameText(expected, signature);
}
