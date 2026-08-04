export type Category =
  | 'All'
  | 'Bangladeshi Coins'
  | 'Bangladeshi Banknotes'
  | 'Bangladeshi Stamps'
  | 'Foreign Banknotes'
  | 'Foreign Coins'
  | 'Foreign Stamps'
  | 'Accessories'
  | (string & {});

export const categories: Category[] = [
  'All',
  'Bangladeshi Coins',
  'Bangladeshi Banknotes',
  'Bangladeshi Stamps',
  'Foreign Banknotes',
  'Foreign Coins',
  'Foreign Stamps',
  'Accessories',
];

export const productCategories = categories.filter((c) => c !== 'All');

export const productTypes = ['Coin', 'Banknote', 'Stamp'] as const;

export interface Product {
  id: string;
  country: string;
  name: string;
  denomination: string;
  currency: string;
  year: string;
  condition: string;
  price: number;
  category: Category;
  type: 'Coin' | 'Banknote' | 'Stamp';
  description: string;
  available: boolean;
  stock: number;
  images: string[];
}
