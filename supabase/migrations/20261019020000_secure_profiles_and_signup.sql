/*
  Accounts on the new project, made safe before anyone signs up.

  1. Profiles are created by the database. Sign-up used to insert its own
     user_profiles row from the browser, choosing its own role_id, which
     needed a policy letting any client insert a profile with any role. Now a
     trigger on auth.users creates the row, always as a customer, from the
     name and phone passed as sign-up metadata.

  2. Nobody promotes themselves. "Users can update their own profile" had no
     column limits, so a customer could set role_id to superadmin and inherit
     every admin policy. A trigger now keeps role_id unchanged unless the
     caller is an admin, and only a superadmin can grant superadmin. SQL run
     as postgres / service_role (auth.uid() is null) is unaffected, which is
     how the first superadmin is made.

  3. Nobody signed out reads profiles. The app used to look a profile up by
     email or phone before signing in, which only worked with a policy letting
     anyone read every profile, stored password copies included. That lookup
     is gone from the app and no such policy exists here; the password copy
     column is dropped.

  4. Admin push subscriptions: any signed-in customer could subscribe to
     new-order pushes (names, amounts, cities), and the admin check trusted
     user-editable metadata. Both now use season_is_admin().

  5. Four FAQs from the original seed (a ₹3000/₹5000 minimum order, "12,000
     locations", tracking by LR number) described the previous business.
*/

-- 1. Profiles from sign-up ------------------------------------------------------

-- One profile per account, so the trigger's ON CONFLICT has something to
-- conflict on. A database that already holds duplicates keeps working
-- without the index rather than failing this migration.
DO $$
BEGIN
  CREATE UNIQUE INDEX IF NOT EXISTS user_profiles_user_id_key ON public.user_profiles (user_id);
EXCEPTION WHEN unique_violation THEN
  RAISE NOTICE 'user_profiles has duplicate user_id rows; unique index not created';
END $$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  customer_role uuid;
BEGIN
  SELECT id INTO customer_role FROM public.roles WHERE name = 'customer';

  INSERT INTO public.user_profiles (user_id, role_id, full_name, email, phone, phone_verified)
  VALUES (
    NEW.id,
    customer_role,
    NULLIF(trim(NEW.raw_user_meta_data ->> 'full_name'), ''),
    NEW.email,
    COALESCE(NULLIF(trim(NEW.raw_user_meta_data ->> 'phone'), ''), NEW.phone),
    false
  )
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Role changes ---------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.guard_profile_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  superadmin_role uuid;
BEGIN
  -- Database-side callers (migrations, the SQL editor, service_role) carry no
  -- end-user identity and may set any role.
  IF auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT id INTO superadmin_role FROM public.roles WHERE name = 'superadmin';

  IF TG_OP = 'INSERT' THEN
    IF NOT public.is_admin(auth.uid()) AND NOT public.is_superadmin(auth.uid()) THEN
      SELECT id INTO NEW.role_id FROM public.roles WHERE name = 'customer';
    END IF;
    RETURN NEW;
  END IF;

  IF NEW.role_id IS DISTINCT FROM OLD.role_id THEN
    IF NOT public.is_admin(auth.uid()) AND NOT public.is_superadmin(auth.uid()) THEN
      NEW.role_id := OLD.role_id;
    ELSIF (NEW.role_id = superadmin_role OR OLD.role_id = superadmin_role)
          AND NOT public.is_superadmin(auth.uid()) THEN
      RAISE EXCEPTION 'Only a superadmin can grant or remove superadmin';
    END IF;
  END IF;

  NEW.user_id := OLD.user_id;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.guard_profile_role() FROM public;

DROP TRIGGER IF EXISTS user_profiles_guard_role ON public.user_profiles;
CREATE TRIGGER user_profiles_guard_role
  BEFORE INSERT OR UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.guard_profile_role();

DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can update profiles" ON public.user_profiles;
CREATE POLICY "Admins can update profiles" ON public.user_profiles
  FOR UPDATE TO authenticated
  USING (public.is_admin(auth.uid()) OR public.is_superadmin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()) OR public.is_superadmin(auth.uid()));

-- 3. No recoverable passwords ---------------------------------------------------

ALTER TABLE public.user_profiles DROP COLUMN IF EXISTS pwd;

-- 4. Admin push subscriptions ---------------------------------------------------

DROP POLICY IF EXISTS "Users can insert own subscription" ON public.admin_push_subscriptions;
CREATE POLICY "Admins can insert own subscription" ON public.admin_push_subscriptions
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND public.season_is_admin());

DROP POLICY IF EXISTS "Admins can view all subscriptions" ON public.admin_push_subscriptions;
CREATE POLICY "Admins can view all subscriptions" ON public.admin_push_subscriptions
  FOR SELECT TO authenticated
  USING (public.season_is_admin());

-- 5. Previous business's FAQs ---------------------------------------------------

DELETE FROM public.faqs
WHERE question IN (
  'What is your minimum order value?',
  'Do you offer bulk discounts?',
  'What are your delivery areas?'
)
OR answer ILIKE '%LR number%';
