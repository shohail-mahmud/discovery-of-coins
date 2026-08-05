import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { useFaqs } from '@/hooks/useContent';

export function FaqSection() {
  const { data: faqs = [] } = useFaqs();
  const [openId, setOpenId] = useState<string | null>(null);
  const visible = faqs.filter((faq) => faq.enabled);

  if (visible.length === 0) return null;

  return (
    <section id="faq" className="bg-brand px-6 pb-10 pt-2 md:pb-12 md:pt-4">
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-5 text-center font-sans text-sm font-medium uppercase tracking-[0.2em] text-ink/70 md:mb-6">
          Frequently Asked Questions
        </h2>

        <div className="divide-y divide-ink/10 border-y border-ink/10">
          {visible.map((faq, index) => {
            const isOpen = openId === faq.id;
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-3 text-left"
                >
                  <span className="font-sans text-sm font-medium tracking-wide text-ink">
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <Minus size={16} className="flex-shrink-0 text-ink/60" />
                  ) : (
                    <Plus size={16} className="flex-shrink-0 text-ink/60" />
                  )}
                </button>
                {isOpen ? (
                  <p className="pb-3 font-sans text-sm font-light leading-relaxed text-ink/70">
                    {faq.answer}
                  </p>
                ) : null}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
