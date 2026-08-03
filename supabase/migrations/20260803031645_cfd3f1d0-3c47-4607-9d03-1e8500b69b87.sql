ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock integer NOT NULL DEFAULT 0;
UPDATE public.products SET stock = 1 WHERE available = true AND stock = 0;

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS subtotal numeric NOT NULL DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS courier text NOT NULL DEFAULT '';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_charge numeric NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION public.place_order(
  _customer_name text,
  _customer_phone text,
  _customer_address text,
  _note text,
  _courier text,
  _delivery_charge numeric,
  _items jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _order_id uuid;
  _item jsonb;
  _pid uuid;
  _qty integer;
  _price numeric;
  _name text;
  _subtotal numeric := 0;
  _updated integer;
BEGIN
  IF _courier NOT IN ('Steadfast', 'Shundarban') THEN
    RAISE EXCEPTION 'Invalid courier';
  END IF;
  IF jsonb_array_length(_items) = 0 THEN
    RAISE EXCEPTION 'No items in order';
  END IF;

  _order_id := gen_random_uuid();

  FOR _item IN SELECT * FROM jsonb_array_elements(_items) LOOP
    _pid := (_item->>'product_id')::uuid;
    _qty := (_item->>'quantity')::int;
    IF _qty IS NULL OR _qty < 1 THEN
      RAISE EXCEPTION 'Invalid quantity';
    END IF;

    UPDATE public.products
      SET stock = stock - _qty,
          available = CASE WHEN stock - _qty <= 0 THEN false ELSE available END,
          updated_at = now()
      WHERE id = _pid AND available = true AND stock >= _qty
      RETURNING price, name INTO _price, _name;

    GET DIAGNOSTICS _updated = ROW_COUNT;
    IF _updated = 0 THEN
      RAISE EXCEPTION 'Not enough stock for one or more items';
    END IF;

    _subtotal := _subtotal + (_price * _qty);
  END LOOP;

  INSERT INTO public.orders (id, customer_name, customer_phone, customer_address, note, subtotal, courier, delivery_charge, total_price)
  VALUES (_order_id, _customer_name, _customer_phone, _customer_address, coalesce(_note, ''), _subtotal, _courier, _delivery_charge, _subtotal + _delivery_charge);

  FOR _item IN SELECT * FROM jsonb_array_elements(_items) LOOP
    _pid := (_item->>'product_id')::uuid;
    _qty := (_item->>'quantity')::int;
    SELECT price, name INTO _price, _name FROM public.products WHERE id = _pid;
    INSERT INTO public.order_items (order_id, product_id, product_name, unit_price, quantity)
    VALUES (_order_id, _pid, _name, _price, _qty);
  END LOOP;

  RETURN _order_id;
END;
$$;

REVOKE ALL ON FUNCTION public.place_order(text, text, text, text, text, numeric, jsonb) FROM public;
GRANT EXECUTE ON FUNCTION public.place_order(text, text, text, text, text, numeric, jsonb) TO anon, authenticated, service_role;