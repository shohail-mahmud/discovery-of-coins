import { Link } from '@/lib/router-compat';
import type { ReactNode } from 'react';
import { CategoryCube } from './CategoryCube';
import { useVisibleCategories } from '@/hooks/useContent';

function CoinIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="24" cy="24" r="20" />
      <circle cx="24" cy="24" r="14" />
      <path d="M24 17v14M17 24h14" />
    </svg>
  );
}

function BanknoteIcon() {
  return (
    <svg viewBox="0 0 48 32" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="6" width="44" height="20" rx="2" />
      <circle cx="24" cy="16" r="5" />
      <path d="M6 10l4-2M6 22l4 2M42 10l-4-2M42 22l-4 2" />
    </svg>
  );
}

function StampIcon() {
  return (
    <svg viewBox="0 0 44 52" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="6" y="4" width="32" height="44" rx="1" />
      <rect x="10" y="14" width="24" height="24" rx="1" strokeDasharray="2 2" />
      <path d="M14 22h16M14 30h12" />
    </svg>
  );
}

function AccessoryIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="6" y="10" width="36" height="28" rx="2" />
      <path d="M6 18h36M18 10v28" />
      <circle cx="30" cy="28" r="4" />
    </svg>
  );
}

const DESCRIPTIONS: Record<string, string> = {
  'Bangladeshi Coins': 'Local Currency',
  'Bangladeshi Banknotes': 'Paper Money',
  'Bangladeshi Stamps': 'Postal Heritage',
  'Foreign Banknotes': 'Global Paper',
  'Foreign Coins': 'World Metal',
  'Foreign Stamps': 'Worldwide Post',
  Accessories: 'Folders & More',
};

function iconFor(name: string): ReactNode {
  if (name.includes('Stamp')) return <StampIcon />;
  if (name.includes('Banknote')) return <BanknoteIcon />;
  if (name.includes('Coin')) return <CoinIcon />;
  return <AccessoryIcon />;
}

export function CategoryGrid() {
  const { data: categories } = useVisibleCategories();

  return (
    <section id="categories" className="bg-brand px-6 pt-16 pb-10 md:pt-20 md:pb-12">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-10 text-center font-sans text-sm font-medium uppercase tracking-[0.2em] text-ink/70 md:mb-14">
          Shop by Category
        </h2>

        <div className="grid grid-cols-2 justify-items-center gap-5 md:grid-cols-3 md:gap-8">
          {categories.map((category, index) => (
            <CategoryCube
              key={category.id}
              title={category.name}
              description={DESCRIPTIONS[category.name] ?? 'Collectibles'}
              icon={iconFor(category.name)}
              index={index}
              to={`/shop?category=${encodeURIComponent(category.name)}`}
            />
          ))}
        </div>

        <div className="mt-10 text-center md:mt-12">
          <Link
            to="/shop"
            className="inline-block border border-ink bg-ink px-8 py-3.5 font-sans text-xs font-medium uppercase tracking-widest text-brand transition-colors hover:bg-transparent hover:text-ink"
          >
            Shop All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
