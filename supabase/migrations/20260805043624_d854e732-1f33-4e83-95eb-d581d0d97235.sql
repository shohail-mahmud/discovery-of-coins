CREATE OR REPLACE FUNCTION public.place_order(_customer_name text, _customer_phone text, _customer_address text, _note text, _courier text, _delivery_charge numeric, _items jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _order_id uuid;
  _item jsonb;
  _pid uuid;
  _cid uuid;
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

  INSERT INTO public.orders (id, customer_name, customer_phone, customer_address, note, subtotal, courier, delivery_charge, total_price)
  VALUES (_order_id, _customer_name, _customer_phone, _customer_address, coalesce(_note, ''), 0, _courier, _delivery_charge, 0);

  FOR _item IN SELECT * FROM jsonb_array_elements(_items) LOOP
    _pid := nullif(_item->>'product_id', '')::uuid;
    _cid := nullif(_item->>'combo_id', '')::uuid;
    _qty := (_item->>'quantity')::int;
    IF _qty IS NULL OR _qty < 1 THEN
      RAISE EXCEPTION 'Invalid quantity';
    END IF;

    IF _cid IS NOT NULL THEN
      SELECT price, name INTO _price, _name
      FROM public.combos
      WHERE id = _cid AND available = true;
      IF _name IS NULL THEN
        RAISE EXCEPTION 'Combo is no longer available';
      END IF;

      INSERT INTO public.order_items (order_id, product_id, product_name, unit_price, quantity)
      VALUES (_order_id, NULL, 'Combo: ' || _name, _price, _qty);
    ELSE
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

      INSERT INTO public.order_items (order_id, product_id, product_name, unit_price, quantity)
      VALUES (_order_id, _pid, _name, _price, _qty);
    END IF;

    _subtotal := _subtotal + (_price * _qty);
  END LOOP;

  UPDATE public.orders
    SET subtotal = _subtotal,
        total_price = _subtotal + _delivery_charge
  WHERE id = _order_id;

  RETURN _order_id;
END;
$function$;