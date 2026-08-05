import { Link } from '@/lib/router-compat';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export function OrderSuccessPage() {
  return (
    <section className="bg-brand px-6 py-10 md:py-14">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-xl border border-ink/10 bg-paper p-6 text-center md:p-8"
      >
        <CheckCircle2 size={40} strokeWidth={1.25} className="mx-auto text-ink" />
        <h1 className="mt-3 font-heading text-3xl tracking-tight text-ink md:text-4xl">
          Order Confirmed
        </h1>
        <p className="mx-auto mt-2.5 max-w-md font-sans text-base font-light leading-relaxed text-ink/70">
          Thanks for placing your order. Our team will contact you as soon as possible to
          confirm the order.
        </p>

        <Link
          to="/shop"
          className="mt-5 inline-block bg-ink px-8 py-3 font-sans text-sm font-medium uppercase tracking-widest text-brand transition-colors hover:bg-ink/90"
        >
          Continue Shopping
        </Link>

        <p className="mt-3 font-sans text-xs font-light text-ink/60">
          <Link to="/terms" className="underline underline-offset-4 hover:text-ink">
            Read Terms &amp; Privacy
          </Link>
        </p>
      </motion.div>
    </section>
  );
}
