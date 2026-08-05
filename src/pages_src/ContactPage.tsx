import { Link } from '@/lib/router-compat';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ContactItem {
  label: string;
  value: string;
  href?: string;
  isExternal?: boolean;
}

async function fetchContactDetails() {
  const { data, error } = await supabase
    .from('contact_details')
    .select('*')
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export function ContactPage() {
  const { data } = useQuery({ queryKey: ['contact-details'], queryFn: fetchContactDetails });

  const handle = (value?: string | null) => (value ?? '').trim();
  const instagramValue = handle(data?.instagram) || '@discoveryofcoins';
  const phoneValue = handle(data?.phone) || '01700000000';

  const contactItems: ContactItem[] = [
    { label: 'Facebook', value: handle(data?.facebook) || '@username' },
    {
      label: 'Instagram',
      value: instagramValue,
      href: `https://instagram.com/${instagramValue.replace('@', '')}`,
      isExternal: true,
    },
    { label: "Admin's Instagram", value: handle(data?.admin_instagram) || '@username' },
    { label: 'WhatsApp Channel', value: handle(data?.whatsapp_channel) || '@username' },
    { label: 'Phone', value: phoneValue, href: `tel:${phoneValue}` },
  ];

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
            Contact
          </h1>

          <div className="mt-5 divide-y divide-ink/10 border-t border-ink/10">
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
