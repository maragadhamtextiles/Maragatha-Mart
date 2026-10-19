/*
  The second half of the dashboard-made schema (see
  20260808000000_baseline_dashboard_schema.sql): tables the app has always
  used that no migration created. expense_people (next) alters expenses, so a
  fresh database stopped there.

  - expenses: the cash book behind the Expenses page. spend_by_id and
    reference_no are added by expense_people; image_path holds an attachment
    in the "expenses" storage bucket.
  - order_audits: who changed what on an order, written by EditOrderModal.
  - states / districts: the checkout's address pickers. Seeded with every
    state and union territory, and districts for Tamil Nadu, Puducherry and
    Kerala, where most orders go. Other states' districts are typed in at
    checkout until rows are added here.

  Everything is IF NOT EXISTS / ON CONFLICT, so on the original database this
  file changes nothing.
*/

-- expenses --------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL DEFAULT current_date,
  details text,
  spend_by text,
  amount numeric NOT NULL DEFAULT 0,
  reason text,
  type text NOT NULL DEFAULT 'spend' CHECK (type IN ('credit', 'spend', 'purchase', 'rent')),
  image_path text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS expenses_date_idx ON public.expenses (date DESC);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'expenses' AND policyname = 'Admins manage expenses') THEN
    CREATE POLICY "Admins manage expenses" ON public.expenses
      FOR ALL TO authenticated
      USING (public.season_is_admin())
      WITH CHECK (public.season_is_admin());
  END IF;
END $$;

-- order_audits ----------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.order_audits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders (id) ON DELETE CASCADE,
  changed_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  changes jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS order_audits_order_idx ON public.order_audits (order_id, created_at DESC);

ALTER TABLE public.order_audits ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'order_audits' AND policyname = 'Admins read and write order audits') THEN
    CREATE POLICY "Admins read and write order audits" ON public.order_audits
      FOR ALL TO authenticated
      USING (public.season_is_admin())
      WITH CHECK (public.season_is_admin());
  END IF;
END $$;

-- states / districts ----------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.states (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.districts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  state_id uuid NOT NULL REFERENCES public.states (id) ON DELETE CASCADE,
  name text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (state_id, name)
);

ALTER TABLE public.states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'states' AND policyname = 'Anyone reads states') THEN
    CREATE POLICY "Anyone reads states" ON public.states FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'states' AND policyname = 'Admins manage states') THEN
    CREATE POLICY "Admins manage states" ON public.states FOR ALL TO authenticated
      USING (public.season_is_admin()) WITH CHECK (public.season_is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'districts' AND policyname = 'Anyone reads districts') THEN
    CREATE POLICY "Anyone reads districts" ON public.districts FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'districts' AND policyname = 'Admins manage districts') THEN
    CREATE POLICY "Admins manage districts" ON public.districts FOR ALL TO authenticated
      USING (public.season_is_admin()) WITH CHECK (public.season_is_admin());
  END IF;
END $$;

INSERT INTO public.states (name) VALUES
  ('Andhra Pradesh'), ('Arunachal Pradesh'), ('Assam'), ('Bihar'), ('Chhattisgarh'),
  ('Goa'), ('Gujarat'), ('Haryana'), ('Himachal Pradesh'), ('Jharkhand'),
  ('Karnataka'), ('Kerala'), ('Madhya Pradesh'), ('Maharashtra'), ('Manipur'),
  ('Meghalaya'), ('Mizoram'), ('Nagaland'), ('Odisha'), ('Punjab'),
  ('Rajasthan'), ('Sikkim'), ('Tamil Nadu'), ('Telangana'), ('Tripura'),
  ('Uttar Pradesh'), ('Uttarakhand'), ('West Bengal'),
  ('Andaman and Nicobar Islands'), ('Chandigarh'),
  ('Dadra and Nagar Haveli and Daman and Diu'), ('Delhi'),
  ('Jammu and Kashmir'), ('Ladakh'), ('Lakshadweep'), ('Puducherry')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.districts (state_id, name)
SELECT s.id, d.name
FROM public.states s
JOIN (VALUES
  ('Tamil Nadu', 'Ariyalur'), ('Tamil Nadu', 'Chengalpattu'), ('Tamil Nadu', 'Chennai'),
  ('Tamil Nadu', 'Coimbatore'), ('Tamil Nadu', 'Cuddalore'), ('Tamil Nadu', 'Dharmapuri'),
  ('Tamil Nadu', 'Dindigul'), ('Tamil Nadu', 'Erode'), ('Tamil Nadu', 'Kallakurichi'),
  ('Tamil Nadu', 'Kanchipuram'), ('Tamil Nadu', 'Kanniyakumari'), ('Tamil Nadu', 'Karur'),
  ('Tamil Nadu', 'Krishnagiri'), ('Tamil Nadu', 'Madurai'), ('Tamil Nadu', 'Mayiladuthurai'),
  ('Tamil Nadu', 'Nagapattinam'), ('Tamil Nadu', 'Namakkal'), ('Tamil Nadu', 'Nilgiris'),
  ('Tamil Nadu', 'Perambalur'), ('Tamil Nadu', 'Pudukkottai'), ('Tamil Nadu', 'Ramanathapuram'),
  ('Tamil Nadu', 'Ranipet'), ('Tamil Nadu', 'Salem'), ('Tamil Nadu', 'Sivaganga'),
  ('Tamil Nadu', 'Tenkasi'), ('Tamil Nadu', 'Thanjavur'), ('Tamil Nadu', 'Theni'),
  ('Tamil Nadu', 'Thoothukudi'), ('Tamil Nadu', 'Tiruchirappalli'), ('Tamil Nadu', 'Tirunelveli'),
  ('Tamil Nadu', 'Tirupathur'), ('Tamil Nadu', 'Tiruppur'), ('Tamil Nadu', 'Tiruvallur'),
  ('Tamil Nadu', 'Tiruvannamalai'), ('Tamil Nadu', 'Tiruvarur'), ('Tamil Nadu', 'Vellore'),
  ('Tamil Nadu', 'Viluppuram'), ('Tamil Nadu', 'Virudhunagar'),
  ('Puducherry', 'Puducherry'), ('Puducherry', 'Karaikal'), ('Puducherry', 'Mahe'),
  ('Puducherry', 'Yanam'),
  ('Kerala', 'Alappuzha'), ('Kerala', 'Ernakulam'), ('Kerala', 'Idukki'), ('Kerala', 'Kannur'),
  ('Kerala', 'Kasaragod'), ('Kerala', 'Kollam'), ('Kerala', 'Kottayam'), ('Kerala', 'Kozhikode'),
  ('Kerala', 'Malappuram'), ('Kerala', 'Palakkad'), ('Kerala', 'Pathanamthitta'),
  ('Kerala', 'Thiruvananthapuram'), ('Kerala', 'Thrissur'), ('Kerala', 'Wayanad')
) AS d (state, name) ON d.state = s.name
ON CONFLICT (state_id, name) DO NOTHING;

-- user_profiles.district --------------------------------------------------------
-- The cart pre-fills the delivery district from the profile.

ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS district text;
