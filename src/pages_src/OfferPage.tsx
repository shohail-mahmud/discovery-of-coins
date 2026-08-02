import { Link } from '@/lib/router-compat';
import { motion } from 'framer-motion';

export function OfferPage() {
  return (
    <section className="bg-brand px-6 py-10 md:py-16">
      <div className="mx-auto max-w-3xl">
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
        >
          <h1 className="font-heading text-4xl tracking-tight text-ink md:text-5xl lg:text-6xl">
            Offer
          </h1>
          <p className="mt-5 font-sans text-base font-light leading-relaxed tracking-wide text-ink/80 md:text-lg">
            Curated collector sets and limited releases, arriving soon.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
