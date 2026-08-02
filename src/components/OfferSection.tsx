import { motion } from 'framer-motion';

export function OfferSection() {
  return (
    <section id="offer" className="bg-brand px-6 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-3xl text-center"
      >
        <h2 className="font-sans text-sm font-medium uppercase tracking-[0.2em] text-ink/70">
          Offer
        </h2>
        <p className="mt-6 font-sans text-lg font-light leading-relaxed tracking-wide text-ink md:text-xl">
          Curated collector sets and limited releases, arriving soon.
        </p>
      </motion.div>
    </section>
  );
}
