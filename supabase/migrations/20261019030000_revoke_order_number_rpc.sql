/*
  next_order_short_id() is SECURITY DEFINER and was executable by anon and
  authenticated, so anyone could call it over the REST API and read the next
  order number (how many orders the shop has taken this year). Only the
  database calls it: the orders trigger and create_guest_order, both of which
  run as the function owner, so revoking it from client roles changes nothing
  for real orders.
*/

REVOKE EXECUTE ON FUNCTION public.next_order_short_id() FROM public, anon, authenticated;
