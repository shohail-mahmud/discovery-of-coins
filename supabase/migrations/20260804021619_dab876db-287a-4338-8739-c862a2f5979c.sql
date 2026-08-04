-- CATEGORIES
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  visible boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert categories" ON public.categories FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update categories" ON public.categories FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete categories" ON public.categories FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE TRIGGER categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.categories (name, visible, sort_order) VALUES
  ('Bangladeshi Coins', true, 1),
  ('Bangladeshi Banknotes', true, 2),
  ('Bangladeshi Stamps', false, 3),
  ('Foreign Banknotes', true, 4),
  ('Foreign Coins', true, 5),
  ('Foreign Stamps', false, 6),
  ('Accessories', true, 7);

-- FAQS
CREATE TABLE public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL DEFAULT '',
  display_order integer NOT NULL DEFAULT 0,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.faqs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.faqs TO authenticated;
GRANT ALL ON public.faqs TO service_role;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view faqs" ON public.faqs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert faqs" ON public.faqs FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update faqs" ON public.faqs FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete faqs" ON public.faqs FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE TRIGGER faqs_updated_at BEFORE UPDATE ON public.faqs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.faqs (question, answer, display_order, enabled) VALUES
  ('Are all items authentic?', 'Yes. Every banknote, coin and collectible we list is verified for authenticity before it goes on sale.', 1, true),
  ('How long does delivery take?', 'Orders are usually dispatched within 1-2 working days. Delivery time depends on the courier you select at checkout.', 2, true),
  ('Which couriers do you use?', 'We deliver through Steadfast and Shundarban. You choose your preferred courier during checkout.', 3, true),
  ('Can I return an item?', 'Please contact us within 3 days of receiving your order if there is any issue and our team will help you.', 4, true);

-- COMBOS
CREATE TABLE public.combos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric NOT NULL DEFAULT 0,
  available boolean NOT NULL DEFAULT true,
  item_count integer NOT NULL DEFAULT 1,
  images text[] NOT NULL DEFAULT '{}'::text[],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.combos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.combos TO authenticated;
GRANT ALL ON public.combos TO service_role;
ALTER TABLE public.combos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view combos" ON public.combos FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert combos" ON public.combos FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update combos" ON public.combos FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete combos" ON public.combos FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE TRIGGER combos_updated_at BEFORE UPDATE ON public.combos FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- COMBO ITEMS
CREATE TABLE public.combo_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  combo_id uuid NOT NULL REFERENCES public.combos(id) ON DELETE CASCADE,
  slot_number integer NOT NULL DEFAULT 1,
  country text NOT NULL DEFAULT '',
  denomination text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX combo_items_combo_id_idx ON public.combo_items (combo_id, slot_number);
GRANT SELECT ON public.combo_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.combo_items TO authenticated;
GRANT ALL ON public.combo_items TO service_role;
ALTER TABLE public.combo_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view combo items" ON public.combo_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert combo items" ON public.combo_items FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update combo items" ON public.combo_items FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete combo items" ON public.combo_items FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE TRIGGER combo_items_updated_at BEFORE UPDATE ON public.combo_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();