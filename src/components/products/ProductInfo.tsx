import { useState } from 'react';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import type { Product } from '../../data/products';

function formatPrice(price: number) {
  return `৳${price.toLocaleString('en-BD')}`;
}

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const increase = () => setQuantity((q) => q + 1);
  const decrease = () => setQuantity((q) => Math.max(1, q - 1));

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="font-sans text-xs font-medium uppercase tracking-widest text-ink/50">
          {product.country}
        </p>
        <h1 className="font-heading text-3xl leading-tight tracking-tight text-ink md:text-4xl lg:text-5xl">
          {product.name}
        </h1>
      </div>

      <div className="space-y-3 font-sans text-sm font-light tracking-wide text-ink/80">
        <p>
          <span className="font-medium text-ink/50">Denomination:</span>{' '}
          {product.denomination}
        </p>
        <p>
          <span className="font-medium text-ink/50">Year:</span> {product.year}
        </p>
        <p>
          <span className="font-medium text-ink/50">Condition:</span>{' '}
          {product.condition}
        </p>
      </div>

      <p className="font-heading text-2xl text-ink md:text-3xl">
        {formatPrice(product.price)}
      </p>

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <div className="flex items-center border border-ink/20 bg-paper">
          <button
            type="button"
            onClick={decrease}
            className="p-3 text-ink/70 transition-colors hover:bg-ink/5"
            aria-label="Decrease quantity"
          >
            <Minus size={16} />
          </button>
          <span className="w-12 text-center font-sans text-sm font-medium text-ink">
            {quantity}
          </span>
          <button
            type="button"
            onClick={increase}
            className="p-3 text-ink/70 transition-colors hover:bg-ink/5"
            aria-label="Increase quantity"
          >
            <Plus size={16} />
          </button>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className="flex flex-1 items-center justify-center gap-2 bg-ink px-8 py-3.5 font-sans text-sm font-medium uppercase tracking-widest text-brand transition-colors hover:bg-ink/85 md:flex-none"
        >
          <ShoppingBag size={16} strokeWidth={1.5} />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
