import { Link } from '@/lib/router-compat';
import { motion } from 'framer-motion';

const policies = [
  {
    title: 'Fixed Price',
    content: 'All products are sold at fixed prices.',
  },
  {
    title: 'Price Changes',
    content:
      'We reserve the right to change product prices at any time. We aim to keep our pricing fair and reasonable. If an order is placed before a price change, the customer will be charged the price that was shown when the order was placed.',
  },
  {
    title: 'Payment',
    content: 'Cash on Delivery is not available.',
  },
  {
    title: 'Delivery',
    content:
      'Delivery may take approximately 2–3 days. Delivery time may vary depending on circumstances.',
  },
  {
    title: 'Shipping',
    content:
      'We currently ship only through Shundarban and Steadfast. There is currently no post office delivery option.',
  },
  {
    title: 'Return Policy',
    content: 'No return policy. Products cannot be returned after purchase.',
  },
];

export function TermsPage() {
  return (
    <section className="bg-brand px-6 py-6 md:py-10">
      <div className="mx-auto max-w-3xl">
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
        >
          <h1 className="font-heading text-4xl tracking-tight text-ink md:text-5xl lg:text-6xl">
            Terms & Policy
          </h1>

          <div className="mt-5 space-y-5">
            {policies.map((policy) => (
              <div key={policy.title}>
                <h2 className="mb-1.5 font-heading text-xl tracking-tight text-ink md:text-2xl">
                  {policy.title}
                </h2>
                <p className="font-sans text-base font-light leading-relaxed text-ink/80">
                  {policy.content}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
