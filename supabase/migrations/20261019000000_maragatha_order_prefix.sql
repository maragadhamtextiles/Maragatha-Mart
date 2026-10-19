/*
  # Order numbers: MMO<year><4 random>-<sequence>

      MMO2026K7P2-0005

  The shop is now Maragatha Mart, so new orders are numbered MMO -- Maragatha
  Mart, Order -- instead of the old prefix. Nothing else about the number
  changes: the year, the 4 unguessable characters and the yearly sequence
  keep the jobs they had in 20260915070000.

  `next_order_short_id()` is the same function with the new prefix. Its
  sequence counts the numbers already issued this year under every format
  (MMO..., and the older SWCO... and SWC-O-...), so switching prefix
  mid-year carries the count on rather than issuing a second 0001.

  `assign_order_short_id()` has to change with it. It keeps a number only
  when it is in the current format and replaces anything else; left alone it
  would treat every MMO number as stale and swap it for a fresh one, so the
  guest checkout would tell the customer one number and store another.

  Existing orders keep the numbers they were given -- customers already have
  them on their confirmations. Lookup is unaffected: `track_guest_order`
  matches through `order_reference_matches`, which compares the whole number,
  the row uuid or the numeric tail and has no prefix in it, so SWC-###,
  SWC-O-..., SWCO... and MMO... all resolve the same way.
*/

CREATE OR REPLACE FUNCTION public.next_order_short_id()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  -- 31 characters: A-Z and 2-9, without the ones people misread.
  c_alphabet constant text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  v_year   text := to_char(now() AT TIME ZONE 'Asia/Kolkata', 'YYYY');
  v_next   integer;
  v_bytes  bytea;
  v_random text;
  v_id     text;
  i        integer;
BEGIN
  -- Every caller queues here, so no two orders read the same "highest so far".
  PERFORM pg_advisory_xact_lock(hashtext('orders.short_id'));

  SELECT COALESCE(MAX(seq), 0) + 1
    INTO v_next
  FROM (
    SELECT (regexp_match(short_id, '^MMO' || v_year || '[A-Z0-9]{4}-(\d+)$'))[1]::integer AS seq
    FROM public.orders
    WHERE short_id LIKE 'MMO' || v_year || '%'
    UNION ALL
    -- Legacy formats, so the year's count carries on across the rename.
    SELECT (regexp_match(short_id, '^SWCO' || v_year || '[A-Z0-9]{4}-(\d+)$'))[1]::integer
    FROM public.orders
    WHERE short_id LIKE 'SWCO' || v_year || '%'
    UNION ALL
    SELECT (regexp_match(short_id, '^SWC-O-' || v_year || '-[A-Z0-9]{8}-(\d+)$'))[1]::integer
    FROM public.orders
    WHERE short_id LIKE 'SWC-O-' || v_year || '-%'
  ) issued;

  LOOP
    -- gen_random_uuid() draws from the system's secure random source;
    -- random() is predictable.
    v_bytes  := uuid_send(gen_random_uuid());
    v_random := '';
    FOR i IN 0..3 LOOP
      v_random := v_random ||
        substr(c_alphabet, (get_byte(v_bytes, i) % length(c_alphabet)) + 1, 1);
    END LOOP;

    -- lpad cuts a longer string down, so order 10000 keeps all its digits.
    v_id := 'MMO' || v_year || v_random || '-' ||
            lpad(v_next::text, greatest(4, length(v_next::text)), '0');

    -- The sequence alone already makes it unique; this guards the impossible.
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.orders WHERE short_id = v_id);
  END LOOP;

  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.next_order_short_id() FROM public;
GRANT EXECUTE ON FUNCTION public.next_order_short_id() TO anon, authenticated;

-- Every insert gets a number, whichever path it came through. A number in the
-- current format is kept (the guest checkout issues its number first and
-- inserts it); anything else, an older format from a browser still running
-- old code included, is replaced.
CREATE OR REPLACE FUNCTION public.assign_order_short_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.short_id IS NULL
     OR NEW.short_id !~ '^MMO\d{4}[A-Z0-9]{4}-\d{4,}$' THEN
    NEW.short_id := public.next_order_short_id();
  END IF;
  RETURN NEW;
END;
$$;

CREATE UNIQUE INDEX IF NOT EXISTS orders_short_id_unique_mmo
  ON public.orders (short_id)
  WHERE short_id LIKE 'MMO%';
