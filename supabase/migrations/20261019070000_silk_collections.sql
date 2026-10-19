/*
  The Maragatha Silks collections (Kanchipuram, Wedding, Soft Silk, ...) move
  from code to the database, with a photograph each, so the home page band and
  the /silks page show real sarees and staff can change them from Admin
  Settings → Homepage.

  keywords decide which products a collection lists: a product belongs when
  its name or its category's name contains one of them. There is still no
  product-level flag; naming is the contract (see src/lib/silk.ts).

  Photos are from Unsplash (Unsplash License); sources in
  public/assets/img/IMAGE_CREDITS.md.
*/

CREATE TABLE IF NOT EXISTS public.silk_collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]+$'),
  name text NOT NULL,
  blurb text,
  image_url text,
  keywords text[] NOT NULL DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.silk_collections ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'silk_collections' AND policyname = 'Anyone sees active collections') THEN
    CREATE POLICY "Anyone sees active collections" ON public.silk_collections
      FOR SELECT USING (is_active OR public.season_is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'silk_collections' AND policyname = 'Admins manage collections') THEN
    CREATE POLICY "Admins manage collections" ON public.silk_collections
      FOR ALL TO authenticated
      USING (public.season_is_admin())
      WITH CHECK (public.season_is_admin());
  END IF;
END $$;

INSERT INTO public.silk_collections (slug, name, blurb, image_url, keywords, sort_order) VALUES
  ('kanchipuram', 'Kanchipuram Pattu',
   'Heavy mulberry silk with contrast korvai borders and pure zari pallus.',
   '/assets/img/collections/kanchipuram.jpg', ARRAY['kanchi', 'kanjeevaram', 'kanjivaram', 'pattu'], 1),
  ('wedding', 'Wedding Silks',
   'Muhurtham sarees in auspicious reds and golds, made to be remembered.',
   '/assets/img/collections/wedding.jpg', ARRAY['wedding', 'bridal', 'muhurtham', 'muhurtam'], 2),
  ('soft-silk', 'Soft Silk',
   'Feather-light drapes for festivals, functions and long days.',
   '/assets/img/collections/soft-silk.jpg', ARRAY['soft silk', 'softsilk', 'soft'], 3),
  ('banarasi', 'Banarasi Silk',
   'Intricate brocade and meenakari weaves from the looms of Varanasi.',
   '/assets/img/collections/banarasi.jpg', ARRAY['banarasi', 'banaras', 'benarasi'], 4),
  ('silk-cotton', 'Silk Cotton & Semi Silk',
   'The sheen of silk with the ease of cotton, for everyday elegance.',
   '/assets/img/collections/silk-cotton.jpg', ARRAY['silk cotton', 'cotton silk', 'semi silk', 'semi-silk', 'kora'], 5),
  ('men', 'Silk Dhotis & Veshtis',
   'Pure silk veshtis and angavastrams with fine zari borders.',
   '/assets/img/collections/men.jpg', ARRAY['dhoti', 'veshti', 'vesti', 'angavastram', 'men'], 6)
ON CONFLICT (slug) DO NOTHING;
