import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from '@/lib/router-compat';
import { motion } from 'framer-motion';
import { ProductGrid } from '../components/products/ProductGrid';
import { products, categories, type Category } from '../data/products';

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [activeCategory, setActiveCategory] = useState<Category>(() => {
    if (categoryParam && categories.includes(categoryParam as Category)) {
      return categoryParam as Category;
    }
    return 'All';
  });

  useEffect(() => {
    if (categoryParam && categories.includes(categoryParam as Category)) {
      setActiveCategory(categoryParam as Category);
    } else {
      setActiveCategory('All');
    }
  }, [categoryParam]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') return products;
    return products.filter((product) => product.category === activeCategory);
  }, [activeCategory]);

  const handleCategoryChange = (category: Category) => {
    setActiveCategory(category);
    if (category === 'All') {
      setSearchParams({}, { replace: true });
    } else {
      setSearchParams({ category }, { replace: true });
    }
  };

  return (
    <section className="bg-brand px-6 py-10 md:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 md:mb-8">
          <Link
            to="/"
            className="inline-block font-sans text-xs font-medium uppercase tracking-widest text-ink/60 transition-colors hover:text-ink"
          >
            Home
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 text-center md:mb-12"
        >
          <h1 className="font-heading text-4xl tracking-tight text-ink md:text-5xl lg:text-6xl">
            Shop
          </h1>
          <p className="mx-auto mt-4 max-w-xl font-sans text-base font-light text-ink/70">
            Authentic banknotes, coins and stamps collected from around the
            world.
          </p>
        </motion.div>

        <div className="mb-8 flex flex-wrap justify-center gap-2 md:mb-10">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => handleCategoryChange(category)}
              className={`border px-4 py-2 font-sans text-xs uppercase tracking-widest transition-colors duration-200 ${
                activeCategory === category
                  ? 'border-ink bg-ink text-brand'
                  : 'border-ink/20 bg-transparent text-ink hover:border-ink/40'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <p className="text-center font-sans text-sm font-light text-ink/60">
            No collectibles found in this category yet.
          </p>
        )}
      </div>
    </section>
  );
}
