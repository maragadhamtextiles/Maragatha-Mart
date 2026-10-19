/*
  The storefront is now Maragatha Mart, a silk and general-goods store in
  Kayathar, and no longer a fireworks shop.

  1. app_settings: the single settings row still carried the old name, the old
     uploaded logo, the orange palette, the old fonts and the old hero banners
     (all fireworks artwork). The code ignores the old palette and name even
     before this runs; this makes the stored row agree so Admin Settings shows
     the truth. logo_url and favicon_url are cleared so the bundled emblem
     (/assets/img/logo/) is used. Business details (phone, email, address,
     legal name, GSTIN, signature) that belong to the previous business are
     cleared, not replaced: they are re-entered in Admin Settings, and this
     file should not guess them. Printing another company's GSTIN on this
     shop's invoices would be wrong in law, not just in branding.

  2. faqs: questions about fireworks, minimum cracker orders and the 2018
     Supreme Court order are removed and replaced with questions a saree and
     general-store customer asks. FAQs that are not about crackers are kept.

  3. blogs: posts in the database about crackers are removed. The new articles
     ship with the site in src/data/blogPosts.ts.

  Products and categories are not touched. They are the shop's real catalogue
  and are replaced from the admin panel, not by a migration.
*/

-- 1. Settings ---------------------------------------------------------------

ALTER TABLE app_settings
  ALTER COLUMN site_title SET DEFAULT 'Maragatha Mart',
  ALTER COLUMN primary_color SET DEFAULT '#0E6B47',
  ALTER COLUMN secondary_color SET DEFAULT '#7A1F3D',
  ALTER COLUMN accent_color SET DEFAULT '#C9A227',
  ALTER COLUMN background_color SET DEFAULT '#FDFBF5',
  ALTER COLUMN text_color SET DEFAULT '#1C241F',
  ALTER COLUMN font_family SET DEFAULT 'Lato';

UPDATE app_settings
SET site_title      = 'Maragatha Mart',
    logo_url        = NULL,
    favicon_url     = NULL,
    primary_color   = '#0E6B47',
    secondary_color = '#7A1F3D',
    accent_color    = '#C9A227',
    background_color = '#FDFBF5',
    text_color      = '#1C241F',
    font_family     = 'Lato',
    hero_banners    = NULL,
    updated_at      = now();

UPDATE app_settings
SET business_phone = NULL
WHERE business_phone ~* '(9363515184|9789794518)';

UPDATE app_settings
SET business_email = NULL
WHERE business_email ~* '(sound ?wave|cracker)';

UPDATE app_settings
SET business_address = NULL
WHERE business_address ~* '(sivakasi|vembakottai|kananjampatti|sound ?wave)';

UPDATE app_settings
SET business_legal_name = NULL,
    gstin = NULL,
    signature_path = NULL
WHERE business_legal_name ~* '(sound ?wave|cracker)';

-- 2. FAQs -------------------------------------------------------------------

DELETE FROM faqs
WHERE question || ' ' || answer ~* '(cracker|firework|sivakasi|sound ?wave|diwali|supreme court|explosive|sparkler|rocket)';

INSERT INTO faqs (question, answer, "order") VALUES
  ('How do I know a silk saree is pure silk?',
   'Every silk saree we sell is checked in our store before it is listed. Ask us for the details of any saree, including the type of zari, and we will tell you exactly what you are buying. Our Silk Journal also explains the checks you can do yourself.',
   1),
  ('Does the saree come with a blouse piece?',
   'Most of our silk sarees include a matching or contrast blouse piece. The product description says so where it does; if you are unsure, message us before ordering.',
   2),
  ('Do you sell anything other than sarees?',
   'Yes. Maragatha Mart carries textiles, home and kitchen essentials, gifting and festive items alongside our silk collection.',
   3),
  ('How do I place an order?',
   'Add what you like to the cart and send your order. We confirm stock and the final amount with you by phone or WhatsApp, then share payment details. You can also use Quick Order to pick items from one list.',
   4),
  ('Which payment methods do you accept?',
   'UPI, Google Pay, PhonePe and bank transfer. Payment details are shared when we confirm your order and are also listed on our Payment page.',
   5),
  ('How can I track my order?',
   'Open Track Order and enter your order number with the phone number you ordered with.',
   6),
  ('Can I return or exchange a saree?',
   'Unused sarees with their tags intact can be exchanged within the period given in our Returns & Exchange policy. Sarees with falls, pico or other customisation done for you cannot be returned.',
   7),
  ('How should I store my silk saree?',
   'Wrap it in a cotton or muslin cloth, refold it every few months so the zari does not crease along one line, and keep it away from moisture and perfume.',
   8);

-- 3. Blog posts -------------------------------------------------------------

DELETE FROM blogs
WHERE title || ' ' || slug || ' ' || content ~* '(cracker|firework|sivakasi|sound ?wave|diwali)';

-- 4. Seed fireworks -----------------------------------------------------------
-- The first migration seeds three firework categories and three products as
-- sample data, so a database built from scratch would open as a fireworks
-- shop. Remove them, but only where nothing depends on them: a product on an
-- order or in stock history is real history and stays (deactivate it from
-- Stock Management instead), and a category goes only once it is empty,
-- because deleting a category cascades to its products.

DO $$
DECLARE
  p record;
BEGIN
  FOR p IN
    SELECT id FROM products
    WHERE name IN ('Sparkle Supreme', 'Thunder King', 'Rainbow Burst')
  LOOP
    BEGIN
      DELETE FROM products WHERE id = p.id;
    EXCEPTION WHEN foreign_key_violation THEN
      NULL;
    END;
  END LOOP;
END $$;

DELETE FROM categories c
WHERE c.name IN ('Aerial Fireworks', 'Ground Spinners', 'Sparklers')
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.category_id = c.id);
