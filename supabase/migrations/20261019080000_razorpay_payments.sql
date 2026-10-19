/*
  Online payment through Razorpay.

  ## Every order is priced by the database first

  A signed-in customer's checkout used to insert orders and order_items from
  the browser, with whatever prices and total the browser sent. That was
  already wrong; with online payment it would let a customer pay ₹1 for a
  saree, since Razorpay charges the order's total. The cart now places every
  customer order through create_guest_order (which prices from the active
  season and stamps auth.uid() when signed in), and customers lose the right
  to insert orders and lines directly. Admins keep it: converting a quotation
  inserts an order at the prices staff agreed.

  ## How a payment flows

  1. The browser asks the razorpay-order edge function to pay order X,
     giving the phone it was placed with (the same proof Track Order uses).
  2. The function calls razorpay_prepare_payment() to check the order and
     work out the amount still due *from the database*, creates a Razorpay
     order for exactly that, and records it in payment_attempts.
  3. Razorpay Checkout takes the money. The browser sends the result to
     razorpay-verify, which checks Razorpay's signature with the secret key;
     Razorpay also calls razorpay-webhook directly. Either one calls
     razorpay_mark_paid(), which is idempotent: a payment is entered in the
     order_payments ledger once, however many times it is reported.

  The amount recorded is the amount of the Razorpay order the server created,
  never a figure from the browser. All three functions below are callable by
  service_role only (the edge functions); browsers cannot reach them.
*/

-- 1. Customers place orders only through create_guest_order ------------------

DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create their own order items" ON public.order_items;

DROP POLICY IF EXISTS "Admins can create orders" ON public.orders;
CREATE POLICY "Admins can create orders" ON public.orders
  FOR INSERT TO authenticated
  WITH CHECK (public.season_is_admin());

-- 2. Razorpay orders created for our orders ------------------------------------

CREATE TABLE IF NOT EXISTS public.payment_attempts (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id            uuid NOT NULL REFERENCES public.orders (id) ON DELETE CASCADE,
  provider            text NOT NULL DEFAULT 'razorpay',
  provider_order_id   text NOT NULL UNIQUE,
  amount_paise        integer NOT NULL CHECK (amount_paise > 0),
  currency            text NOT NULL DEFAULT 'INR',
  status              text NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'paid', 'failed')),
  provider_payment_id text,
  paid_at             timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS payment_attempts_order_idx ON public.payment_attempts (order_id);

ALTER TABLE public.payment_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins see payment attempts" ON public.payment_attempts;
CREATE POLICY "Admins see payment attempts" ON public.payment_attempts
  FOR SELECT TO authenticated USING (public.season_is_admin());

-- One ledger row per Razorpay payment, so the verify call and the webhook
-- cannot both count it.
CREATE UNIQUE INDEX IF NOT EXISTS order_payments_razorpay_once
  ON public.order_payments (reference) WHERE method = 'razorpay';

-- 3. The steps, for the edge functions only ------------------------------------

CREATE OR REPLACE FUNCTION public.razorpay_prepare_payment(p_order_id uuid, p_phone text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  o     record;
  v_due numeric;
BEGIN
  SELECT id, short_id, status, total_amount, COALESCE(discount_amt, 0) AS discount,
         COALESCE(amount_received, 0) AS received, full_name, email, phone
    INTO o
  FROM public.orders WHERE id = p_order_id;

  -- The same proof as order tracking: the order id alone is not enough.
  IF o.id IS NULL
     OR right(regexp_replace(COALESCE(o.phone, ''), '\D', '', 'g'), 10)
        <> right(regexp_replace(COALESCE(p_phone, ''), '\D', '', 'g'), 10) THEN
    RAISE EXCEPTION 'Order not found for this phone number';
  END IF;

  IF o.status = 'Cancelled' THEN
    RAISE EXCEPTION 'This order has been cancelled';
  END IF;

  v_due := round(GREATEST(o.total_amount - o.discount, 0) - o.received, 2);
  IF v_due <= 0 THEN
    RAISE EXCEPTION 'This order is already paid in full';
  END IF;

  RETURN jsonb_build_object(
    'order_id', o.id,
    'short_id', o.short_id,
    'amount_due', v_due,
    'amount_paise', (round(v_due * 100))::integer,
    'name', o.full_name,
    'email', o.email,
    'phone', o.phone
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.razorpay_record_attempt(
  p_order_id uuid, p_provider_order_id text, p_amount_paise integer
)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  INSERT INTO public.payment_attempts (order_id, provider_order_id, amount_paise)
  VALUES (p_order_id, p_provider_order_id, p_amount_paise);
$$;

CREATE OR REPLACE FUNCTION public.razorpay_mark_paid(
  p_provider_order_id text, p_payment_id text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  a record;
  o record;
BEGIN
  -- Locked so a verify call and a webhook arriving together queue up.
  SELECT * INTO a FROM public.payment_attempts
  WHERE provider_order_id = p_provider_order_id
  FOR UPDATE;

  IF a.id IS NULL THEN
    RAISE EXCEPTION 'Unknown Razorpay order %', p_provider_order_id;
  END IF;

  IF a.status <> 'paid' THEN
    INSERT INTO public.order_payments (order_id, amount, method, reference, note)
    VALUES (a.order_id, a.amount_paise / 100.0, 'razorpay', p_payment_id,
            'Paid online (Razorpay order ' || p_provider_order_id || ')')
    ON CONFLICT (reference) WHERE method = 'razorpay' DO NOTHING;

    UPDATE public.payment_attempts
    SET status = 'paid', provider_payment_id = p_payment_id, paid_at = now()
    WHERE id = a.id;
  END IF;

  SELECT short_id, payment_status, amount_received INTO o
  FROM public.orders WHERE id = a.order_id;

  RETURN jsonb_build_object(
    'order_id', a.order_id,
    'short_id', o.short_id,
    'payment_status', o.payment_status,
    'amount_received', o.amount_received
  );
END;
$$;

REVOKE ALL ON FUNCTION public.razorpay_prepare_payment(uuid, text) FROM public, anon, authenticated;
REVOKE ALL ON FUNCTION public.razorpay_record_attempt(uuid, text, integer) FROM public, anon, authenticated;
REVOKE ALL ON FUNCTION public.razorpay_mark_paid(text, text) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.razorpay_prepare_payment(uuid, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.razorpay_record_attempt(uuid, text, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.razorpay_mark_paid(text, text) TO service_role;
