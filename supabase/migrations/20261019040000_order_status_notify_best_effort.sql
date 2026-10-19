/*
  notify_order_status_change() runs on every order status change and posted
  to an edge function through pg_net, at a URL read from the custom setting
  app.settings.edge_function_url. On a project where pg_net is not enabled or
  the setting was never made (any new project), the call raised an error and
  rolled back the status change itself: confirming, packing or shipping an
  order failed outright.

  A notification is a side effect; it must never decide whether the order
  changes. The function now sends only when both pg_net and the URL exist,
  and a failure to send is logged as a warning instead of aborting the
  update. To turn notifications on for a project:

    create extension if not exists pg_net;
    alter database postgres set app.settings.edge_function_url
      = 'https://<project-ref>.supabase.co/functions/v1';
*/

CREATE OR REPLACE FUNCTION public.notify_order_status_change()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_base text := nullif(current_setting('app.settings.edge_function_url', true), '');
BEGIN
  IF OLD.status IS NOT DISTINCT FROM NEW.status THEN
    RETURN NEW;
  END IF;

  IF v_base IS NULL OR to_regnamespace('net') IS NULL THEN
    RETURN NEW;
  END IF;

  BEGIN
    EXECUTE
      'SELECT net.http_post(url := $1, body := $2::jsonb, headers := $3)'
    USING
      v_base || '/notify-order-status',
      json_build_object(
        'orderId', NEW.id,
        'status', NEW.status,
        'customerName', NEW.full_name,
        'customerEmail', NEW.email,
        'customerPhone', NEW.phone
      )::text,
      '{"Content-Type": "application/json"}'::jsonb;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'order status notification not sent for %: %', NEW.id, SQLERRM;
  END;

  RETURN NEW;
END;
$$;
