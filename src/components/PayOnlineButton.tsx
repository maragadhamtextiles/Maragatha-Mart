import { useState } from "react";
import toast from "react-hot-toast";
import { CheckCircle2, CreditCard, Loader2 } from "lucide-react";
import { payOrderOnline, RAZORPAY_ENABLED, type PaymentResult } from "../lib/razorpay";

/**
 * "Pay online" for one order: opens Razorpay Checkout and turns into a
 * receipt line once the server has verified the payment. Renders nothing
 * until the shop's Razorpay key is configured.
 */
export function PayOnlineButton({
  orderId,
  phone,
  amount,
  onPaid,
  className = "",
}: {
  orderId: string;
  phone: string;
  /** Shown on the button. The amount charged is always the server's. */
  amount?: number;
  onPaid?: (result: PaymentResult) => void;
  className?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [paid, setPaid] = useState<PaymentResult | null>(null);

  if (!RAZORPAY_ENABLED) return null;

  if (paid) {
    return (
      <div className={`flex items-center justify-center gap-2 rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-green-800 ${className}`}>
        <CheckCircle2 className="w-5 h-5" />
        <span className="font-semibold">
          Payment received{paid.short_id ? ` for ${paid.short_id}` : ""}. Thank you!
        </span>
      </div>
    );
  }

  const pay = async () => {
    setBusy(true);
    try {
      const result = await payOrderOnline(orderId, phone);
      setPaid(result);
      toast.success("Payment received. Thank you!");
      onPaid?.(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "The payment did not go through";
      if (message === "Payment was cancelled") toast(message);
      else toast.error(message, { duration: 8000 });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={pay}
        disabled={busy}
        className="btn-primary w-full flex items-center justify-center gap-2 text-lg disabled:opacity-60 disabled:cursor-wait"
      >
        {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
        {busy
          ? "Opening secure payment…"
          : amount
          ? `Pay ₹${amount.toLocaleString("en-IN")} online`
          : "Pay online"}
      </button>
      <p className="text-xs text-text/60 text-center mt-2">
        UPI, cards, netbanking and wallets — secured by Razorpay
      </p>
    </div>
  );
}
