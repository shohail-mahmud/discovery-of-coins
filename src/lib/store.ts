import { supabase } from '@/integrations/supabase/client';
import type { Category, Product } from '@/data/products';

export const PRODUCT_BUCKET = 'product-images';

type ProductRow = {
  id: string;
  name: string;
  country: string;
  category: string;
  denomination: string;
  currency: string;
  year: string;
  condition: string;
  type: string;
  description: string;
  price: number | string;
  available: boolean;
  stock?: number | null;
  images: string[] | null;
};

export function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    country: row.country,
    category: row.category as Category,
    denomination: row.denomination,
    currency: row.currency,
    year: row.year,
    condition: row.condition,
    type: (row.type as Product['type']) ?? 'Coin',
    description: row.description,
    price: Number(row.price),
    available: row.available,
    stock: Number(row.stock ?? 0),
    images: row.images ?? [],
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []).map((row) => mapProduct(row as unknown as ProductRow));
}

export async function fetchImageUrl(path: string): Promise<string | null> {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const { data, error } = await supabase.storage
    .from(PRODUCT_BUCKET)
    .createSignedUrl(path, 60 * 60 * 24 * 7);
  if (error) return null;
  return data?.signedUrl ?? null;
}

export function formatPrice(price: number) {
  return `৳${price.toLocaleString('en-BD')}`;
}

export const COURIERS = [
  { name: 'Steadfast', charge: 120 },
  { name: 'Shundarban', charge: 50 },
] as const;

export function isInStock(product: { available: boolean; stock: number }) {
  return product.available && product.stock > 0;
}

export interface CartLine {
  id: string;
  kind: 'product' | 'combo';
  name: string;
  image?: string | undefined;
  meta?: string;
  price: number;
  quantity: number;
  maxQuantity: number;
  href?: string;
}
