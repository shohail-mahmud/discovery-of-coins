import { supabase } from '@/integrations/supabase/client';

export interface CategoryRow {
  id: string;
  name: string;
  visible: boolean;
  sort_order: number;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  enabled: boolean;
}

export interface ComboItem {
  id: string;
  combo_id: string;
  slot_number: number;
  country: string;
  denomination: string;
  description: string;
}

export interface Combo {
  id: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
  item_count: number;
  images: string[];
  items: ComboItem[];
}

export const MAX_COMBO_SLOTS = 50;

export async function fetchCategories(): Promise<CategoryRow[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, visible, sort_order')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? []) as CategoryRow[];
}

export async function fetchFaqs(): Promise<Faq[]> {
  const { data, error } = await supabase
    .from('faqs')
    .select('id, question, answer, display_order, enabled')
    .order('display_order', { ascending: true });
  if (error) throw error;
  return (data ?? []) as Faq[];
}

export async function fetchCombos(): Promise<Combo[]> {
  const { data, error } = await supabase
    .from('combos')
    .select('*, combo_items(*)')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []).map((row) => {
    const record = row as unknown as Record<string, unknown>;
    const items = ((record.combo_items as ComboItem[]) ?? [])
      .slice()
      .sort((a, b) => a.slot_number - b.slot_number);
    return {
      id: String(record.id),
      name: String(record.name ?? ''),
      description: String(record.description ?? ''),
      price: Number(record.price ?? 0),
      available: Boolean(record.available),
      item_count: Number(record.item_count ?? items.length),
      images: (record.images as string[]) ?? [],
      items,
    } satisfies Combo;
  });
}
