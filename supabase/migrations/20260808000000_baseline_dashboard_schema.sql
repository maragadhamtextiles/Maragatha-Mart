/*
  Columns and tables the first database gained through the Supabase dashboard
  (and the hand-run scheme_query.sql / fix_orders_schema.sql), never through a
  migration. Later migrations assume them: seasons_phase1 copies
  products.product_code, apr, is_active and friends into the season tables,
  and the app writes orders.address, user_profiles.city and the scheme tables.

  On the original database every statement here is a no-op (IF NOT EXISTS);
  on a database built from these files alone it supplies what the dashboard
  once did, so `supabase db reset` and a fresh project both work.

  Left out of scheme_query.sql on purpose:
    - its sample schemes, whose features promised "Bonus Crackers" and whose
      last row had a wrong total; schemes are created in the admin panel;
    - its order triggers, which posted to a placeholder
      https://YOUR_EDGE_FUNCTION_URL and would fail every order insert.
*/

-- products ------------------------------------------------------------------

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS product_code text,
  ADD COLUMN IF NOT EXISTS yt_link text,
  ADD COLUMN IF NOT EXISTS product_type text,
  ADD COLUMN IF NOT EXISTS apr numeric,
  ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS reorder_level integer,
  ADD COLUMN IF NOT EXISTS "order" integer;

ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS "order" integer;

-- orders --------------------------------------------------------------------

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS discount_amt numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS discount_percentage text DEFAULT '',
  ADD COLUMN IF NOT EXISTS referred_by text,
  ADD COLUMN IF NOT EXISTS full_name text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS alternate_phone text,
  ADD COLUMN IF NOT EXISTS address text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS district text,
  ADD COLUMN IF NOT EXISTS state text,
  ADD COLUMN IF NOT EXISTS pincode text,
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS short_id text;

CREATE INDEX IF NOT EXISTS idx_orders_short_id ON public.orders (short_id);

-- user_profiles ---------------------------------------------------------------

ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS alternate_phone text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS state text,
  ADD COLUMN IF NOT EXISTS pincode text,
  ADD COLUMN IF NOT EXISTS country text,
  -- Read by the phone-login flow (src/lib/legacyPasswordStore.ts). Storing a
  -- recoverable password is a known weakness to remove, not a design to copy.
  ADD COLUMN IF NOT EXISTS pwd text;

-- Monthly savings scheme ------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.schemes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  installment varchar(10) NOT NULL,
  duration varchar(20) NOT NULL,
  total_amount varchar(20) NOT NULL,
  bonus_amount varchar(20) NOT NULL,
  total_value varchar(20) NOT NULL,
  features text[] NOT NULL DEFAULT '{}',
  is_active boolean DEFAULT true,
  max_participants integer,
  current_participants integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.scheme_selections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  scheme_id uuid NOT NULL REFERENCES public.schemes (id),
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  status varchar(20) NOT NULL
    CHECK (status IN ('active', 'completed', 'cancelled', 'delayed')),
  amount_paid numeric DEFAULT 0,
  next_due_date timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- One running scheme per customer. The original UNIQUE (user_id, status) also
-- stopped anyone from ever finishing a second scheme.
CREATE UNIQUE INDEX IF NOT EXISTS scheme_selections_one_active
  ON public.scheme_selections (user_id) WHERE status = 'active';

CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scheme_selection_id uuid NOT NULL REFERENCES public.scheme_selections (id) ON DELETE CASCADE,
  amount numeric(10, 2) NOT NULL,
  payment_date timestamptz NOT NULL,
  status varchar(20) NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
  transaction_id varchar(100),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_scheme_selections_user_id ON public.scheme_selections (user_id);
CREATE INDEX IF NOT EXISTS idx_payments_scheme_selection_id ON public.payments (scheme_selection_id);

ALTER TABLE public.schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheme_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'schemes' AND policyname = 'Anyone can view active schemes') THEN
    CREATE POLICY "Anyone can view active schemes" ON public.schemes
      FOR SELECT USING (is_active = true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'schemes' AND policyname = 'Only admins can manage schemes') THEN
    CREATE POLICY "Only admins can manage schemes" ON public.schemes
      FOR ALL TO authenticated
      USING (auth.uid() IN (
        SELECT up.user_id FROM public.user_profiles up
        JOIN public.roles r ON r.id = up.role_id
        WHERE r.name IN ('admin', 'superadmin')))
      WITH CHECK (auth.uid() IN (
        SELECT up.user_id FROM public.user_profiles up
        JOIN public.roles r ON r.id = up.role_id
        WHERE r.name IN ('admin', 'superadmin')));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'scheme_selections' AND policyname = 'Users can view their own scheme selections') THEN
    CREATE POLICY "Users can view their own scheme selections" ON public.scheme_selections
      FOR SELECT USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'scheme_selections' AND policyname = 'Users can create their own scheme selections') THEN
    CREATE POLICY "Users can create their own scheme selections" ON public.scheme_selections
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'scheme_selections' AND policyname = 'Users can update their own scheme selections') THEN
    CREATE POLICY "Users can update their own scheme selections" ON public.scheme_selections
      FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'payments' AND policyname = 'Users can view their own payments') THEN
    CREATE POLICY "Users can view their own payments" ON public.payments
      FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.scheme_selections s
        WHERE s.id = payments.scheme_selection_id AND s.user_id = auth.uid()));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'payments' AND policyname = 'Users can create their own payments') THEN
    CREATE POLICY "Users can create their own payments" ON public.payments
      FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM public.scheme_selections s
        WHERE s.id = payments.scheme_selection_id AND s.user_id = auth.uid()));
  END IF;
END $$;
