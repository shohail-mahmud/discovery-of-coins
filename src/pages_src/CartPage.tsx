import { Link } from '@/lib/router-compat';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../hooks/useProducts';
import { ProductImage } from '../components/products/ProductImage';
import { CheckoutForm } from '../components/CheckoutForm';

function formatPrice(price: number) {
  return `৳${price.toLocaleString('en-BD')}`;
}

export function CartPage() {
  const { items, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();
  const { data: products = [] } = useProducts();

  const cartProducts = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { ...product, quantity: item.quantity } : null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  if (cartProducts.length === 0) {
    return (
      <section className="bg-brand px-6 py-20 text-center md:py-24">
        <div className="mx-auto max-w-xl">
          <h1 className="font-heading text-3xl tracking-tight text-ink md:text-4xl">
            Your cart is empty.
          </h1>
          <p className="mt-4 font-sans text-base font-light text-ink/70">
            Looks like you haven’t added any collectibles yet.
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-block border border-ink bg-ink px-8 py-3.5 font-sans text-sm font-medium uppercase tracking-widest text-brand transition-colors hover:bg-ink/90"
          >
            Continue Shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-brand px-6 py-10 md:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 md:mb-8">
          <Link
            to="/shop"
            className="inline-block font-sans text-xs font-medium uppercase tracking-widest text-ink/60 transition-colors hover:text-ink"
          >
            ← Back to Shop
          </Link>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading text-4xl tracking-tight text-ink md:text-5xl"
        >
          Cart ({totalItems})
        </motion.h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {cartProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex gap-4 border border-ink/10 bg-paper p-4 md:gap-5"
              >
                <Link
                  to={`/product/${product.id}`}
                  className="flex aspect-square w-24 flex-shrink-0 items-center justify-center overflow-hidden border border-ink/10 bg-paper md:w-28"
                >
                  <ProductImage path={product.images[0]} alt={product.name} />
                </Link>

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <p className="font-sans text-[10px] font-medium uppercase tracking-widest text-ink/50">
                      {product.country}
                    </p>
                    <h2 className="mt-1 font-heading text-lg leading-tight tracking-tight text-ink md:text-xl">
                      <Link to={`/product/${product.id}`}>{product.name}</Link>
                    </h2>
                    <p className="mt-1 font-sans text-sm font-light text-ink/60">
                      {formatPrice(product.price)}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center border border-ink/20 bg-paper">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(product.id, product.quantity - 1)
                        }
                        className="p-2 text-ink/70 transition-colors hover:bg-ink/5"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center font-sans text-sm font-medium text-ink">
                        {product.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            product.id,
                            Math.min(product.stock, product.quantity + 1)
                          )
                        }
                        disabled={product.quantity >= product.stock}
                        className="p-2 text-ink/70 transition-colors hover:bg-ink/5 disabled:opacity-30"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <p className="font-sans text-sm font-medium text-ink">
                        Subtotal: {formatPrice(product.price * product.quantity)}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        className="text-ink/40 transition-colors hover:text-ink"
                        aria-label="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="h-fit border border-ink/10 bg-paper p-5">
            <h2 className="font-heading text-xl tracking-tight text-ink">
              Cart Summary
            </h2>
            <div className="mt-5 flex justify-between border-b border-ink/10 pb-4 font-sans text-base text-ink">
              <span className="font-light">Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <CheckoutForm lines={cartProducts} total={subtotal} />
          </div>
        </div>
      </div>
    </section>
  );
}
