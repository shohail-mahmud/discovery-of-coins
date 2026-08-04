import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from '@/lib/router-compat';
import { motion } from 'framer-motion';
import { ProductGrid } from '../components/products/ProductGrid';
import { useProducts } from '../hooks/useProducts';
import { useVisibleCategories } from '../hooks/useContent';

export function ShopPage() {
  const { data: products = [], isLoading } = useProducts();
  const { data: visibleCategories } = useVisibleCategories();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  const categoryNames = useMemo(
    () => visibleCategories.map((category) => category.name),
    [visibleCategories],
  );
  const filters = useMemo(() => ['All', ...categoryNames], [categoryNames]);

  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    if (categoryParam && categoryNames.includes(categoryParam)) {
      setActiveCategory(categoryParam);
    } else {
      setActiveCategory('All');
    }
  }, [categoryParam, categoryNames]);

  const filteredProducts = useMemo(() => {
    const inVisible = products.filter(
      (product) => categoryNames.length === 0 || categoryNames.includes(product.category),
    );
    if (activeCategory === 'All') return inVisible;
    return inVisible.filter((product) => product.category === activeCategory);
  }, [activeCategory, products, categoryNames]);

  const handleCategoryChange = (category: string) => {
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
          {filters.map((category) => (
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

        {isLoading ? (
          <p className="text-center font-sans text-sm font-light text-ink/60">
            Loading collectibles…
          </p>
        ) : filteredProducts.length > 0 ? (
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
