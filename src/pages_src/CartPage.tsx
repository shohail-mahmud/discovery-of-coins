import { Link } from '@/lib/router-compat';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../hooks/useProducts';
import { useCombos } from '../hooks/useContent';
import { ProductImage } from '../components/products/ProductImage';
import { CheckoutForm } from '../components/CheckoutForm';
import { formatPrice, type CartLine } from '@/lib/store';

export function CartPage() {
  const { items, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();
  const { data: products = [] } = useProducts();
  const { data: combos = [] } = useCombos();

  const lines: CartLine[] = items
    .map((item): CartLine | null => {
      if (item.kind === 'combo') {
        const combo = combos.find((c) => c.id === item.productId);
        if (!combo) return null;
        return {
          id: combo.id,
          kind: 'combo',
          name: combo.name,
          image: combo.images[0],
          meta: `Combo set · ${combo.item_count} items`,
          price: combo.price,
          quantity: item.quantity,
          maxQuantity: combo.available ? 99 : 0,
          href: '/combo',
        };
      }
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      return {
        id: product.id,
        kind: 'product',
        name: product.name,
        image: product.images[0],
        meta: product.country,
        price: product.price,
        quantity: item.quantity,
        maxQuantity: product.stock,
        href: `/product/${product.id}`,
      };
    })
    .filter((line): line is CartLine => line !== null);

  if (lines.length === 0) {
    return (
      <section className="bg-brand px-6 py-14 text-center md:py-16">
        <div className="mx-auto max-w-xl">
          <h1 className="font-heading text-3xl tracking-tight text-ink md:text-4xl">
            Your cart is empty.
          </h1>
          <p className="mt-2.5 font-sans text-base font-light text-ink/70">
            Looks like you haven’t added any collectibles yet.
          </p>
          <Link
            to="/shop"
            className="mt-5 inline-block border border-ink bg-ink px-8 py-3 font-sans text-sm font-medium uppercase tracking-widest text-brand transition-colors hover:bg-ink/90"
          >
            Continue Shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-brand px-6 py-6 md:py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-3 md:mb-4">
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
          className="font-heading text-3xl tracking-tight text-ink md:text-4xl"
        >
          Cart ({totalItems})
        </motion.h1>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px]">
          <div className="space-y-3">
            {lines.map((line) => (
              <motion.div
                key={`${line.kind}-${line.id}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex gap-3.5 border border-ink/10 bg-paper p-3 md:gap-4"
              >
                <Link
                  to={line.href ?? '/shop'}
                  className="flex aspect-square w-20 flex-shrink-0 items-center justify-center overflow-hidden border border-ink/10 bg-paper md:w-24"
                >
                  <ProductImage path={line.image} alt={line.name} />
                </Link>

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <p className="font-sans text-[10px] font-medium uppercase tracking-widest text-ink/50">
                      {line.meta}
                    </p>
                    <h2 className="font-heading text-lg leading-tight tracking-tight text-ink md:text-xl">
                      <Link to={line.href ?? '/shop'}>{line.name}</Link>
                    </h2>
                    <p className="font-sans text-sm font-light text-ink/60">
                      {formatPrice(line.price)}
                    </p>
                  </div>

                  <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center border border-ink/20 bg-paper">
                      <button
                        type="button"
                        onClick={() => updateQuantity(line.id, line.quantity - 1)}
                        className="p-1.5 text-ink/70 transition-colors hover:bg-ink/5"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-9 text-center font-sans text-sm font-medium text-ink">
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            line.id,
                            Math.min(line.maxQuantity, line.quantity + 1)
                          )
                        }
                        disabled={line.quantity >= line.maxQuantity}
                        className="p-1.5 text-ink/70 transition-colors hover:bg-ink/5 disabled:opacity-30"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <p className="font-sans text-sm font-medium text-ink">
                        Subtotal: {formatPrice(line.price * line.quantity)}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeFromCart(line.id)}
                        className="text-ink/40 transition-colors hover:text-ink"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="h-fit border border-ink/10 bg-paper p-4">
            <h2 className="font-heading text-xl tracking-tight text-ink">
              Cart Summary
            </h2>
            <div className="mt-3 flex justify-between border-b border-ink/10 pb-3 font-sans text-base text-ink">
              <span className="font-light">Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <CheckoutForm lines={lines} total={subtotal} />
          </div>
        </div>
      </div>
    </section>
  );
}
