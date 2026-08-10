import { Link } from '@/lib/router-compat';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { fetchContactDetails, isFullUrl, socialUrl } from '@/lib/content';

interface ContactItem {
  label: string;
  value: string;
  href?: string;
  isExternal?: boolean;
}

const handle = (value?: string | null) => (value ?? '').trim();

export function ContactPage() {
  const { data } = useQuery({
    queryKey: ['contact-details'],
    queryFn: fetchContactDetails,
  });

  const contactItems: ContactItem[] = [];

  const facebook = handle(data?.facebook);
  if (facebook) {
    const href = socialUrl(facebook, 'facebook');
    if (href) {
      contactItems.push({ label: 'Facebook', value: facebook, href, isExternal: true });
    }
  }

  const instagram = handle(data?.instagram) || '@discoveryofcoins';
  const instagramHref = socialUrl(instagram, 'instagram');
  if (instagramHref) {
    contactItems.push({
      label: 'Instagram',
      value: instagram,
      href: instagramHref,
      isExternal: true,
    });
  }

  const adminInstagram = handle(data?.admin_instagram);
  if (adminInstagram) {
    const href = socialUrl(adminInstagram, 'instagram');
    if (href) {
      contactItems.push({
        label: "Admin's Instagram",
        value: adminInstagram,
        href,
        isExternal: true,
      });
    }
  }

  const whatsapp = handle(data?.whatsapp_channel);
  if (whatsapp) {
    if (isFullUrl(whatsapp)) {
      contactItems.push({
        label: 'WhatsApp Channel',
        value: 'Join our WhatsApp Channel',
        href: whatsapp,
        isExternal: true,
      });
    } else {
      const href = socialUrl(whatsapp, 'whatsapp');
      if (href) {
        contactItems.push({
          label: 'WhatsApp Channel',
          value: whatsapp,
          href,
          isExternal: true,
        });
      }
    }
  }

  const phone = handle(data?.phone) || '01700000000';
  contactItems.push({ label: 'Phone', value: phone, href: `tel:${phone}` });

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
