/**
 * Where customers pay, written down once.
 *
 * Shown and copied on the order confirmation (Cart.tsx) and on the Pay Now
 * page (Payment.tsx).
 *
 * Both are empty on purpose until Maragatha Mart's own account is set: the
 * previous storefront's UPI ID and QR belonged to another business, and a
 * customer paying them would be paying a stranger. While UPI_ID is empty the
 * pay screens hide the QR and UPI blocks and say that payment details are
 * shared when the order is confirmed.
 *
 * To go live: set UPI_ID, put the matching QR picture at
 * public/assets/img/payment/upi-qr.png, and set PAYMENT_QR to that path. The
 * QR encodes its own UPI ID, so the two must be for the same account.
 */
export const UPI_ID = "";
export const PAYMENT_QR: string | null = null;
