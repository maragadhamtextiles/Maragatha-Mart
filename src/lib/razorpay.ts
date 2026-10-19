import { supabase } from "./supabase";
import { BRAND } from "../config/brand";
import { SITE_URL } from "./site";

/**
 * Online payment through Razorpay Checkout.
 *
 * The browser never decides an amount. It names an order (plus the phone it
 * was placed with); the razorpay-order edge function works out what is due
 * from the database and creates the Razorpay order; after Checkout, the
 * razorpay-verify function checks Razorpay's signature before anything is
 * recorded as paid. See supabase/migrations/20261019080000_razorpay_payments.sql.
 */

/** Online payment is offered only once the shop's Razorpay key is configured. */
export const RAZORPAY_ENABLED = Boolean(import.meta.env.VITE_RAZORPAY_KEY_ID);

const CHECKOUT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open(): void;
  on(event: "payment.failed", cb: (r: { error?: { description?: string } }) => void): void;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

let loading: Promise<void> | null = null;

/** Loads checkout.js once, on first use, so shoppers who never pay online never download it. */
function loadCheckout(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  loading ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = CHECKOUT_SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      loading = null;
      reject(new Error("Could not load the payment window. Check your connection and try again."));
    };
    document.body.appendChild(s);
  });
  return loading;
}

async function callFunction<T>(name: string, body: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke(name, { body });
  if (error) {
    // The function's own message ("This order is already paid in full") is in
    // the response body; supabase-js wraps it in a generic error.
    let message = error.message;
    try {
      const ctx = (error as { context?: Response }).context;
      const parsed = ctx ? await ctx.json() : null;
      if (parsed?.error) message = parsed.error;
    } catch {
      /* keep the generic message */
    }
    throw new Error(message);
  }
  if (data?.error) throw new Error(data.error);
  return data as T;
}

export interface PaymentResult {
  short_id: string | null;
  payment_status: string;
  amount_received: number;
}

/**
 * Opens Razorpay Checkout for an order and resolves once the payment is
 * verified on the server. Rejects with a readable message if the customer
 * closes the window, the payment fails, or verification does not pass.
 */
export async function payOrderOnline(orderId: string, phone: string): Promise<PaymentResult> {
  const [order] = await Promise.all([
    callFunction<{
      key_id: string;
      razorpay_order_id: string;
      amount: number;
      currency: string;
      short_id: string | null;
      prefill: { name?: string; email?: string; contact?: string };
    }>("razorpay-order", { order_id: orderId, phone }),
    loadCheckout(),
  ]);

  return new Promise<PaymentResult>((resolve, reject) => {
    // After a failed attempt Checkout stays open so the customer can try
    // another method; the failure is only reported if they then close it.
    let lastFailure: string | null = null;
    const rzp = new window.Razorpay!({
      key: order.key_id,
      order_id: order.razorpay_order_id,
      amount: order.amount,
      currency: order.currency,
      name: BRAND.name,
      description: order.short_id ? `Order ${order.short_id}` : "Order payment",
      image: `${SITE_URL}${BRAND.logo}`,
      prefill: order.prefill,
      notes: { order_id: orderId },
      theme: { color: "#0E6B47" },
      handler: (response: RazorpayResponse) => {
        callFunction<PaymentResult>("razorpay-verify", { ...response }).then(resolve, (err) =>
          reject(
            new Error(
              `${err.message}. If money left your account, it will be matched to your order automatically — please contact us with order ${order.short_id ?? ""}.`
            )
          )
        );
      },
      modal: {
        ondismiss: () => reject(new Error(lastFailure ?? "Payment was cancelled")),
      },
    });
    rzp.on("payment.failed", (r) => {
      lastFailure = r.error?.description || "The payment failed";
    });
    rzp.open();
  });
}
