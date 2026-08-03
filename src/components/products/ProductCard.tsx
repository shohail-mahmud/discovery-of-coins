import { Link } from '@/lib/router-compat';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { ProductImage } from './ProductImage';
import { useCart } from '../../context/CartContext';
import type { Product } from '../../data/products';

function formatPrice(price: number) {
  return `৳${price.toLocaleString('en-BD')}`;
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, 1);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block w-full max-w-[95%] sm:max-w-full"
    >
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{
          duration: 0.5,
          delay: index * 0.05,
          ease: [0.22, 1, 0.36, 1],
        }}
        whileHover={{ y: -4 }}
        className="mx-auto flex flex-col border border-ink/10 bg-paper transition-shadow duration-300 hover:shadow-md"
      >
        <div className="flex aspect-[3/2] items-center justify-center overflow-hidden border-b border-ink/10 bg-paper">
          <ProductImage path={product.images[0]} alt={product.name} label="Image" />
        </div>

        <div className="flex flex-1 flex-col gap-1 p-3 md:p-4">
          <p className="font-sans text-[10px] font-medium uppercase tracking-widest text-ink/50">
            {product.country}
          </p>
          <h3 className="font-heading text-lg leading-tight tracking-tight text-ink">
            {product.name}
          </h3>
          <p className="font-sans text-xs font-light text-ink/60">
            {product.denomination} · {product.year} · {product.condition}
          </p>
          <p className="mt-1.5 font-heading text-base text-ink">
            {formatPrice(product.price)}
          </p>


          <button
            type="button"
            disabled={!product.available}
            onClick={handleAddToCart}
            className="mt-2 flex items-center justify-center gap-2 border border-ink bg-transparent px-4 py-1.5 font-sans text-xs font-medium uppercase tracking-widest text-ink transition-colors hover:bg-ink hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ShoppingBag size={14} strokeWidth={1.5} />
            {product.available ? 'Add to Cart' : 'Sold Out'}
          </button>
        </div>
      </motion.article>
    </Link>
  );
}

