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

export interface ContactDetails {
  id: string;
  facebook: string;
  instagram: string;
  admin_instagram: string;
  whatsapp_channel: string;
  phone: string;
}

export async function fetchContactDetails(): Promise<ContactDetails | null> {
  const { data, error } = await supabase
    .from('contact_details')
    .select('*')
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return (data as ContactDetails | null) ?? null;
}

export function isFullUrl(value: string): boolean {
  return /^https?:\/\//i.test(value.trim());
}

// Builds a clickable URL from a stored value. If the value is already a full
// URL it is returned as-is; otherwise it is treated as a handle (e.g.
// "my-page" or "@my-page") and prefixed with the platform's base URL.
export function socialUrl(
  value: string,
  base: 'facebook' | 'instagram' | 'whatsapp',
): string | null {
  const v = value.trim();
  if (!v) return null;
  if (isFullUrl(v)) return v;
  const handle = v.replace(/^@/, '');
  if (base === 'whatsapp') return `https://whatsapp.com/channel/${handle}`;
  return `https://${base}.com/${handle}`;
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
    const record = row as unknown as {
      id: string;
      name?: string;
      description?: string;
      price?: number | string;
      available?: boolean;
      item_count?: number;
      images?: string[] | null;
      combo_items?: ComboItem[] | null;
    };
    const items = (record.combo_items ?? [])
      .slice()
      .sort((a, b) => a.slot_number - b.slot_number);
    return {
      id: record.id,
      name: record.name ?? '',
      description: record.description ?? '',
      price: Number(record.price ?? 0),
      available: Boolean(record.available),
      item_count: Number(record.item_count ?? items.length),
      images: record.images ?? [],
      items,
    } satisfies Combo;
  });
}
