import { useParams, Link } from '@/lib/router-compat';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { ProductGallery } from '../components/products/ProductGallery';
import { ProductInfo } from '../components/products/ProductInfo';
import { ProductSpecs } from '../components/products/ProductSpecs';
import { ProductGrid } from '../components/products/ProductGrid';
import { getProductById, getRelatedProducts } from '../data/products';

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const product = id ? getProductById(id) : undefined;
  const relatedProducts = product ? getRelatedProducts(product.id) : [];

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
    <section className="bg-brand px-6 py-10 md:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center gap-4 md:mb-8">
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
          className="grid gap-8 md:grid-cols-2 md:gap-12 lg:gap-16"
        >
          <ProductGallery productName={product.name} />
          <ProductInfo product={product} />
        </motion.div>

        <ProductSpecs product={product} />

        {relatedProducts.length > 0 && (
          <div className="mt-16 border-t border-ink/10 pt-12 md:mt-20 md:pt-16">
            <h2 className="mb-6 font-heading text-2xl tracking-tight text-ink md:text-3xl">
              Related Collectibles
            </h2>
            <ProductGrid products={relatedProducts} />
          </div>
        )}
      </div>
    </section>
  );
}
