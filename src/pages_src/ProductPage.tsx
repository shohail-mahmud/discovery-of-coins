import { useParams, Link } from '@/lib/router-compat';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { ProductGallery } from '../components/products/ProductGallery';
import { ProductInfo } from '../components/products/ProductInfo';
import { ProductSpecs } from '../components/products/ProductSpecs';
import { ProductGrid } from '../components/products/ProductGrid';
import { useProduct } from '../hooks/useProducts';

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, products, isLoading } = useProduct(id);
  const relatedProducts = product
    ? products.filter((item) => item.id !== product.id).slice(0, 4)
    : [];

  if (isLoading) {
    return (
      <section className="bg-brand px-6 py-20 text-center md:py-24">
        <p className="font-sans text-sm font-light text-ink/60">Loading…</p>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="bg-brand px-6 py-20 text-center md:py-24">
        <h1 className="font-heading text-3xl tracking-tight text-ink">
          Product not found
        </h1>
        <p className="mt-4 font-sans text-sm font-light text-ink/60">
          The collectible you are looking for does not exist.
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-block border border-ink bg-ink px-6 py-3 font-sans text-xs font-medium uppercase tracking-widest text-brand transition-colors hover:bg-ink/90"
        >
          Back to Shop
        </Link>
      </section>
    );
  }

  return (
    <section className="bg-brand px-6 py-6 md:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-3 flex flex-wrap items-center gap-4 md:mb-4">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 font-sans text-xs font-medium uppercase tracking-widest text-ink/60 transition-colors hover:text-ink"
          >
            <ArrowLeft size={14} />
            Back to Shop
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-5 md:grid-cols-2 md:gap-8 lg:gap-10"
        >
          <ProductGallery productName={product.name} images={product.images} />
          <ProductInfo product={product} />
        </motion.div>

        <ProductSpecs product={product} />

        {relatedProducts.length > 0 && (
          <div className="mt-8 border-t border-ink/10 pt-6 md:mt-10 md:pt-8">
            <h2 className="mb-4 font-heading text-2xl tracking-tight text-ink md:text-3xl">
              Related Collectibles
            </h2>
            <ProductGrid products={relatedProducts} />
          </div>
        )}
      </div>
    </section>
  );
}
