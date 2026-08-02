CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.claim_admin()
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    RAISE EXCEPTION 'An admin already exists';
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (auth.uid(), 'admin');
  RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION public.claim_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_admin() TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_exists()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin');
$$;
GRANT EXECUTE ON FUNCTION public.admin_exists() TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  country text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Bangladeshi Coins',
  denomination text NOT NULL DEFAULT '',
  currency text NOT NULL DEFAULT '',
  year text NOT NULL DEFAULT '',
  condition text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'Coin',
  description text NOT NULL DEFAULT '',
  price numeric(12,2) NOT NULL DEFAULT 0,
  available boolean NOT NULL DEFAULT true,
  images text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert products" ON public.products FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update products" ON public.products FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete products" ON public.products FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TYPE public.order_status AS ENUM ('Pending', 'Confirmed', 'Cancelled', 'Shipped', 'Delivered');

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_address text NOT NULL,
  note text NOT NULL DEFAULT '',
  total_price numeric(12,2) NOT NULL DEFAULT 0,
  status public.order_status NOT NULL DEFAULT 'Pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.orders TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can place an order" ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can view orders" ON public.orders FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete orders" ON public.orders FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  unit_price numeric(12,2) NOT NULL DEFAULT 0,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.order_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can add order items" ON public.order_items FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can view order items" ON public.order_items FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete order items" ON public.order_items FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.contact_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  facebook text NOT NULL DEFAULT '',
  instagram text NOT NULL DEFAULT '',
  admin_instagram text NOT NULL DEFAULT '',
  whatsapp_channel text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.contact_details TO anon;
GRANT SELECT, INSERT, UPDATE ON public.contact_details TO authenticated;
GRANT ALL ON public.contact_details TO service_role;
ALTER TABLE public.contact_details ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view contact details" ON public.contact_details FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert contact details" ON public.contact_details FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update contact details" ON public.contact_details FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER contact_details_updated_at BEFORE UPDATE ON public.contact_details FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.contact_details (facebook, instagram, admin_instagram, whatsapp_channel, phone)
VALUES ('@username', '@discoveryofcoins', '@username', '@username', '01700000000');

CREATE POLICY "Public can view product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Admins can upload product images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update product images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete product images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

INSERT INTO public.products (name, country, category, denomination, currency, year, condition, type, description, price) VALUES
('100 Taka Banknote','Bangladesh','Bangladeshi Banknotes','100 Taka','Taka','1988','UNC','Banknote','A crisp uncirculated 100 Taka note from Bangladesh, showcasing the country''s cultural heritage and detailed engraving work.',500),
('1 Taka Coin','Bangladesh','Bangladeshi Coins','1 Taka','Taka','2010','AU','Coin','A well-preserved 1 Taka circulation coin, ideal for collectors starting a Bangladeshi coin set.',120),
('Fisherman Stamp','Bangladesh','Bangladeshi Stamps','10 Poisha','Poisha','1972','Mint','Stamp','A commemorative postage stamp celebrating Bangladesh''s riverine life and early postal history.',85),
('Silver Certificate','United States','Foreign Banknotes','1 Dollar','Dollar','1923','VF','Banknote','A historic large-size Silver Certificate from the United States, valued for its classic design.',3200),
('One Pound Note','United Kingdom','Foreign Banknotes','1 Pound','Pound','1981','UNC','Banknote','A crisp uncirculated British one pound note from the final series before polymer notes.',1500),
('50 Centimes Coin','France','Foreign Coins','50 Centimes','Franc','1963','XF','Coin','A charming French 50 Centimes coin in extra fine condition, perfect for European coin collectors.',450),
('10 Yen Coin','Japan','Foreign Coins','10 Yen','Yen','1964','AU','Coin','A reflective 10 Yen coin from the Tokyo Olympic era, showing strong detail and original luster.',280),
('Rome Olympics Stamp','Italy','Foreign Stamps','25 Lire','Lire','1960','Mint','Stamp','A mint Italian stamp issued for the 1960 Rome Summer Olympics, featuring classical sporting imagery.',650),
('2 Taka Coin','Bangladesh','Bangladeshi Coins','2 Taka','Taka','2004','UNC','Coin','A bright uncirculated 2 Taka coin with sharp relief and clean surfaces.',175),
('50 Taka Banknote','Bangladesh','Bangladeshi Banknotes','50 Taka','Taka','1996','AU','Banknote','A lightly handled 50 Taka note featuring Bangladeshi national symbols and intricate patterns.',350),
('Royal Bengal Tiger Stamp','Bangladesh','Bangladeshi Stamps','50 Poisha','Poisha','1974','Mint','Stamp','A beloved wildlife stamp depicting the Royal Bengal Tiger, Bangladesh''s national animal.',95),
('Brandenburg Gate Stamp','Germany','Foreign Stamps','100 Pfennig','Mark','1989','Mint','Stamp','A German commemorative stamp showing the Brandenburg Gate, issued near the fall of the Berlin Wall.',520);