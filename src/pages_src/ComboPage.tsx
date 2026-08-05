import { Link } from '@/lib/router-compat';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useCombos } from '@/hooks/useContent';
import { formatPrice } from '@/lib/store';
import { useCart } from '@/context/CartContext';
import { ProductImage } from '@/components/products/ProductImage';

export function ComboPage() {
  const { data: combos = [], isLoading } = useCombos();
  const { addToCart } = useCart();

  return (
    <section className="bg-brand px-6 py-6 md:py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-3 md:mb-4">
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
          className="mb-6 text-center md:mb-8"
        >
          <h1 className="font-heading text-4xl tracking-tight text-ink md:text-5xl">
            Combo
          </h1>
          <p className="mx-auto mt-2 max-w-xl font-sans text-base font-light text-ink/70">
            Curated banknote and coin sets — every item in the set is listed below.
          </p>
        </motion.div>

        {isLoading ? (
          <p className="text-center font-sans text-sm font-light text-ink/60">
            Loading combos…
          </p>
        ) : combos.length === 0 ? (
          <p className="text-center font-sans text-sm font-light text-ink/60">
            No combo sets available yet.
          </p>
        ) : (
          <div className="space-y-5">
            {combos.map((combo) => (
              <article
                key={combo.id}
                className="grid gap-4 border border-ink/10 bg-paper p-4 md:grid-cols-[240px_1fr] md:p-5"
              >
                <div className="space-y-2">
                  <div className="flex aspect-square items-center justify-center overflow-hidden border border-ink/10 bg-paper">
                    <ProductImage
                      path={combo.images[0]}
                      alt={combo.name}
                      iconSize={32}
                      label={combo.name}
                    />
                  </div>
                  {combo.images.length > 1 ? (
                    <div className="flex gap-2 overflow-x-auto">
                      {combo.images.slice(1).map((path) => (
                        <div
                          key={path}
                          className="flex aspect-square w-14 flex-shrink-0 items-center justify-center overflow-hidden border border-ink/10 bg-paper"
                        >
                          <ProductImage path={path} alt={combo.name} iconSize={14} />
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="font-heading text-2xl tracking-tight text-ink">
                      {combo.name}
                    </h2>
                    <p className="font-sans text-lg text-ink">{formatPrice(combo.price)}</p>
                  </div>

                  <p className="mt-0.5 font-sans text-xs uppercase tracking-widest text-ink/50">
                    {combo.item_count} items in this set ·{' '}
                    {combo.available ? 'Available' : 'Unavailable'}
                  </p>

                  {combo.description ? (
                    <p className="mt-2 font-sans text-sm font-light leading-relaxed text-ink/70">
                      {combo.description}
                    </p>
                  ) : null}

                  <h3 className="mt-3.5 font-sans text-xs font-medium uppercase tracking-widest text-ink/50">
                    Included in this set
                  </h3>
                  <ul className="mt-1.5 divide-y divide-ink/10 border-y border-ink/10">
                    {combo.items.map((item) => (
                      <li key={item.id} className="py-1.5">
                        <p className="font-sans text-sm text-ink">
                          {item.country || 'Unspecified'}
                          {item.denomination ? ` — ${item.denomination}` : ''}
                        </p>
                        {item.description ? (
                          <p className="font-sans text-xs font-light text-ink/60">
                            {item.description}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    disabled={!combo.available}
                    onClick={() => addToCart(combo.id, 1, 'combo')}
                    className="mt-3.5 flex items-center justify-center gap-2 bg-ink px-6 py-2.5 font-sans text-xs font-medium uppercase tracking-widest text-brand transition-colors hover:bg-ink/85 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ShoppingBag size={14} strokeWidth={1.5} />
                    {combo.available ? 'Add to Cart' : 'Unavailable'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
