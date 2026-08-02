import { Link } from '@/lib/router-compat';
import { motion } from 'framer-motion';

interface ContactItem {
  label: string;
  value: string;
  href?: string;
  isExternal?: boolean;
}

const contactItems: ContactItem[] = [
  { label: 'Facebook', value: '@username' },
  {
    label: 'Instagram',
    value: '@discoveryofcoins',
    href: 'https://instagram.com/discoveryofcoins',
    isExternal: true,
  },
  { label: "Admin's Instagram", value: '@username' },
  { label: 'WhatsApp Channel', value: '@username' },
  { label: 'Phone', value: '01700000000', href: 'tel:01700000000' },
];

export function ContactPage() {
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
            Contact
          </h1>

          <div className="mt-8 divide-y divide-ink/10 border-t border-ink/10">
            {contactItems.map((item) => (
              <div
                key={item.label}
                className="flex flex-col justify-between gap-1 py-3.5 sm:flex-row sm:items-center"
              >
                <span className="font-sans text-xs font-medium uppercase tracking-widest text-ink/50">
                  {item.label}
                </span>
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.isExternal ? '_blank' : undefined}
                    rel={item.isExternal ? 'noopener noreferrer' : undefined}
                    className="font-sans text-base font-light text-ink transition-colors hover:text-ink/70"
                  >
                    {item.value}
                  </a>
                ) : (
                  <span className="font-sans text-base font-light text-ink">
                    {item.value}
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
