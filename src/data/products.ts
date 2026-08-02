export type Category =
  | 'All'
  | 'Bangladeshi Coins'
  | 'Bangladeshi Banknotes'
  | 'Bangladeshi Stamps'
  | 'Foreign Banknotes'
  | 'Foreign Coins'
  | 'Foreign Stamps';

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
}

export const categories: Category[] = [
  'All',
  'Bangladeshi Coins',
  'Bangladeshi Banknotes',
  'Bangladeshi Stamps',
  'Foreign Banknotes',
  'Foreign Coins',
  'Foreign Stamps',
];

export const products: Product[] = [
  {
    id: 'bd-100-taka-1988',
    country: 'Bangladesh',
    name: '100 Taka Banknote',
    denomination: '100 Taka',
    currency: 'Taka',
    year: '1988',
    condition: 'UNC',
    price: 500,
    category: 'Bangladeshi Banknotes',
    type: 'Banknote',
    description:
      'A crisp uncirculated 100 Taka note from Bangladesh, showcasing the country’s cultural heritage and detailed engraving work.',
  },
  {
    id: 'bd-1-taka-coin-2010',
    country: 'Bangladesh',
    name: '1 Taka Coin',
    denomination: '1 Taka',
    currency: 'Taka',
    year: '2010',
    condition: 'AU',
    price: 120,
    category: 'Bangladeshi Coins',
    type: 'Coin',
    description:
      'A well-preserved 1 Taka circulation coin, ideal for collectors starting a Bangladeshi coin set.',
  },
  {
    id: 'bd-stamp-fisherman-1972',
    country: 'Bangladesh',
    name: 'Fisherman Stamp',
    denomination: '10 Poisha',
    currency: 'Poisha',
    year: '1972',
    condition: 'Mint',
    price: 85,
    category: 'Bangladeshi Stamps',
    type: 'Stamp',
    description:
      'A commemorative postage stamp celebrating Bangladesh’s riverine life and early postal history.',
  },
  {
    id: 'us-1-dollar-1923',
    country: 'United States',
    name: 'Silver Certificate',
    denomination: '1 Dollar',
    currency: 'Dollar',
    year: '1923',
    condition: 'VF',
    price: 3200,
    category: 'Foreign Banknotes',
    type: 'Banknote',
    description:
      'A historic large-size Silver Certificate from the United States, valued for its classic design.',
  },
  {
    id: 'uk-1-pound-1981',
    country: 'United Kingdom',
    name: 'One Pound Note',
    denomination: '1 Pound',
    currency: 'Pound',
    year: '1981',
    condition: 'UNC',
    price: 1500,
    category: 'Foreign Banknotes',
    type: 'Banknote',
    description:
      'A crisp uncirculated British one pound note from the final series before polymer notes.',
  },
  {
    id: 'fr-50-centimes-1963',
    country: 'France',
    name: '50 Centimes Coin',
    denomination: '50 Centimes',
    currency: 'Franc',
    year: '1963',
    condition: 'XF',
    price: 450,
    category: 'Foreign Coins',
    type: 'Coin',
    description:
      'A charming French 50 Centimes coin in extra fine condition, perfect for European coin collectors.',
  },
  {
    id: 'jp-10-yen-1964',
    country: 'Japan',
    name: '10 Yen Coin',
    denomination: '10 Yen',
    currency: 'Yen',
    year: '1964',
    condition: 'AU',
    price: 280,
    category: 'Foreign Coins',
    type: 'Coin',
    description:
      'A reflective 10 Yen coin from the Tokyo Olympic era, showing strong detail and original luster.',
  },
  {
    id: 'it-stamp-olympics-1960',
    country: 'Italy',
    name: 'Rome Olympics Stamp',
    denomination: '25 Lire',
    currency: 'Lire',
    year: '1960',
    condition: 'Mint',
    price: 650,
    category: 'Foreign Stamps',
    type: 'Stamp',
    description:
      'A mint Italian stamp issued for the 1960 Rome Summer Olympics, featuring classical sporting imagery.',
  },
  {
    id: 'bd-2-taka-coin-2004',
    country: 'Bangladesh',
    name: '2 Taka Coin',
    denomination: '2 Taka',
    currency: 'Taka',
    year: '2004',
    condition: 'UNC',
    price: 175,
    category: 'Bangladeshi Coins',
    type: 'Coin',
    description:
      'A bright uncirculated 2 Taka coin with sharp relief and clean surfaces.',
  },
  {
    id: 'bd-50-taka-1996',
    country: 'Bangladesh',
    name: '50 Taka Banknote',
    denomination: '50 Taka',
    currency: 'Taka',
    year: '1996',
    condition: 'AU',
    price: 350,
    category: 'Bangladeshi Banknotes',
    type: 'Banknote',
    description:
      'A lightly handled 50 Taka note featuring Bangladeshi national symbols and intricate patterns.',
  },
  {
    id: 'bd-stamp-tiger-1974',
    country: 'Bangladesh',
    name: 'Royal Bengal Tiger Stamp',
    denomination: '50 Poisha',
    currency: 'Poisha',
    year: '1974',
    condition: 'Mint',
    price: 95,
    category: 'Bangladeshi Stamps',
    type: 'Stamp',
    description:
      'A beloved wildlife stamp depicting the Royal Bengal Tiger, Bangladesh’s national animal.',
  },
  {
    id: 'de-stamp-brandenburg-1989',
    country: 'Germany',
    name: 'Brandenburg Gate Stamp',
    denomination: '100 Pfennig',
    currency: 'Mark',
    year: '1989',
    condition: 'Mint',
    price: 520,
    category: 'Foreign Stamps',
    type: 'Stamp',
    description:
      'A German commemorative stamp showing the Brandenburg Gate, issued near the fall of the Berlin Wall.',
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getRelatedProducts(currentId: string, count = 4): Product[] {
  return products
    .filter((product) => product.id !== currentId)
    .slice(0, count);
}
