/*
  The home page's pictures and words come from the database, not the code.

  1. hero_slides: the banner carousel. Each slide is a photo plus its words
     and buttons, edited from Admin Settings → Homepage. The site falls back
     to drawn brand slides only when no slide is active.

  2. categories: seeded with the store's starting departments, each with a
     photo. Pictures are paths under /assets/img/categories/ (shipped with the
     site) or full links to the product-images bucket for ones uploaded later.
     Seeding skips any name that already exists, so a live catalogue is
     untouched.

  3. Gaps in admin access found while doing this: categories had no write
     policy at all (nobody could add one), and staff could not see customers'
     savings-scheme sign-ups or payments.

  The photos are from Unsplash (Unsplash License); sources are listed in
  public/assets/img/IMAGE_CREDITS.md.
*/

-- 1. Hero slides --------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.hero_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  eyebrow text,
  title text NOT NULL,
  subtitle text,
  cta_label text,
  cta_link text,
  secondary_label text,
  secondary_link text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS hero_slides_order_idx ON public.hero_slides (is_active, sort_order);

ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'hero_slides' AND policyname = 'Anyone sees active slides') THEN
    CREATE POLICY "Anyone sees active slides" ON public.hero_slides
      FOR SELECT USING (is_active OR public.season_is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'hero_slides' AND policyname = 'Admins manage slides') THEN
    CREATE POLICY "Admins manage slides" ON public.hero_slides
      FOR ALL TO authenticated
      USING (public.season_is_admin())
      WITH CHECK (public.season_is_admin());
  END IF;
END $$;

INSERT INTO public.hero_slides
  (image_url, eyebrow, title, subtitle, cta_label, cta_link, secondary_label, secondary_link, sort_order)
SELECT * FROM (VALUES
  ('/assets/img/hero/kanchipuram-purple-gold.jpg',
   'Welcome to Maragatha Mart', 'Tradition Woven in Elegance',
   'Silk sarees from Maragatha Silks and a carefully chosen range of everyday essentials, from Kayathar to your doorstep.',
   'Explore Silks', '/silks', 'Shop All', '/shop', 1),
  ('/assets/img/hero/silk-pink-orange.jpg',
   'Maragatha Silks', 'Kanchipuram & Soft Silk Sarees',
   'Rich zari borders, temple motifs and colours chosen for weddings, festivals and every celebration in between.',
   'View the Silk Collection', '/silks', NULL, NULL, 2),
  ('/assets/img/hero/bridal-red-gold.jpg',
   'For the big day', 'Wedding Silks to Remember',
   'Muhurtham sarees in auspicious reds and golds, picked one by one for the bride and her family.',
   'See Wedding Silks', '/silks?c=wedding', NULL, NULL, 3),
  ('/assets/img/hero/peacock-silk.jpg',
   'Festive edit', 'Colours of the Season',
   'Peacock blues, temple greens and rich purples with contrast borders, ready for every function.',
   'Shop Festive Silks', '/silks', 'Quick Order', '/quick-order', 4),
  ('/assets/img/hero/classic-blue-silk.jpg',
   'One store, many needs', 'Everything for Home & Family',
   'Textiles, home, kitchen, gifting and festive essentials, picked with the same care as our silks.',
   'Start Shopping', '/shop', NULL, NULL, 5)
) AS s (image_url, eyebrow, title, subtitle, cta_label, cta_link, secondary_label, secondary_link, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.hero_slides);

-- 2. Starting categories --------------------------------------------------------

INSERT INTO public.categories (name, description, image_url, "order")
SELECT c.name, c.description, c.image_url, c.ord
FROM (VALUES
  ('Silk Sarees', 'Kanchipuram and pure silk sarees with zari borders', '/assets/img/categories/silk-sarees.jpg', 1),
  ('Soft Silk Sarees', 'Light, flowing silks for festivals and functions', '/assets/img/categories/soft-silk.jpg', 2),
  ('Wedding Sarees', 'Muhurtham and bridal silks', '/assets/img/categories/wedding-sarees.jpg', 3),
  ('Cotton & Fabrics', 'Cotton sarees, silk cotton and dress materials', '/assets/img/categories/cotton-fabrics.jpg', 4),
  ('Dhotis & Veshtis', 'Silk and cotton veshtis, dhotis and angavastrams', '/assets/img/categories/dhotis-veshtis.jpg', 5),
  ('Kids Wear', 'Pattu pavadai and festive wear for children', '/assets/img/categories/kids-wear.jpg', 6),
  ('Home Textiles', 'Bedsheets, towels and furnishings', '/assets/img/categories/home-textiles.jpg', 7),
  ('Kitchen Essentials', 'Brass, steel and everyday kitchenware', '/assets/img/categories/kitchen-essentials.jpg', 8),
  ('Pooja & Festive', 'Lamps, pooja items and festive needs', '/assets/img/categories/pooja-festive.jpg', 9),
  ('Gifts', 'Gift sets and return gifts for every occasion', '/assets/img/categories/gifts.jpg', 10)
) AS c (name, description, image_url, ord)
WHERE NOT EXISTS (SELECT 1 FROM public.categories x WHERE lower(x.name) = lower(c.name));

-- 3. Admin access gaps ----------------------------------------------------------

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'categories' AND policyname = 'Admins manage categories') THEN
    CREATE POLICY "Admins manage categories" ON public.categories
      FOR ALL TO authenticated
      USING (public.season_is_admin())
      WITH CHECK (public.season_is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'scheme_selections' AND policyname = 'Admins see scheme selections') THEN
    CREATE POLICY "Admins see scheme selections" ON public.scheme_selections
      FOR SELECT TO authenticated USING (public.season_is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'payments' AND policyname = 'Admins see scheme payments') THEN
    CREATE POLICY "Admins see scheme payments" ON public.payments
      FOR SELECT TO authenticated USING (public.season_is_admin());
  END IF;
END $$;
