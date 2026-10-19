/*
  Signing in failed with a 500: reading your own profile (user_profiles with
  roles embedded) raised "infinite recursion detected in policy for relation
  roles".

  - "Only superadmin can manage roles" was FOR ALL, so it applied to SELECT
    as well, and its check joined roles from inside a roles policy.
  - is_admin() and is_superadmin() read user_profiles and roles as the
    caller, so every policy that used them re-entered those tables' policies.

  The original database had these settled by hand; the migrations never did.
  Both helpers now run as SECURITY DEFINER with a fixed search_path, the way
  season_is_admin() already does, and the roles policy covers writes only.
  Reading roles stays open ("Roles are viewable by everyone").
*/

CREATE OR REPLACE FUNCTION public.is_admin(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    JOIN public.roles r ON up.role_id = r.id
    WHERE up.user_id = user_uuid AND r.name = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_superadmin(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    JOIN public.roles r ON up.role_id = r.id
    WHERE up.user_id = user_uuid AND r.name = 'superadmin'
  );
$$;

DROP POLICY IF EXISTS "Only superadmin can manage roles" ON public.roles;

CREATE POLICY "Superadmin can add roles" ON public.roles
  FOR INSERT TO authenticated
  WITH CHECK (public.is_superadmin(auth.uid()));

CREATE POLICY "Superadmin can change roles" ON public.roles
  FOR UPDATE TO authenticated
  USING (public.is_superadmin(auth.uid()))
  WITH CHECK (public.is_superadmin(auth.uid()));

CREATE POLICY "Superadmin can remove roles" ON public.roles
  FOR DELETE TO authenticated
  USING (public.is_superadmin(auth.uid()));
