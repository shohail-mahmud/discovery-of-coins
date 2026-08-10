import { Link } from '@/lib/router-compat';
import { useQuery } from '@tanstack/react-query';
import { fetchContactDetails, socialUrl } from '@/lib/content';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Shop', href: '/shop' },
  { label: 'Contact', href: '/contact' },
  { label: 'Combo', href: '/combo' },
  { label: 'Terms & Policy', href: '/terms' },
];

export function Footer() {
  const { data } = useQuery({
    queryKey: ['contact-details'],
    queryFn: fetchContactDetails,
  });

  // Contact details come from the `contact_details` table (editable in the
  // admin dashboard). Fallbacks keep the footer sensible while loading or
  // before an admin fills the fields in.
  const instagram = (data?.instagram ?? '').trim() || '@discoveryofcoins';
  const instagramHref = socialUrl(instagram, 'instagram') ?? '#';
  const phone = (data?.phone ?? '').trim() || '01700000000';
  const whatsapp = (data?.whatsapp_channel ?? '').trim();
  const whatsappHref = socialUrl(whatsapp, 'whatsapp');

  return (
    <footer className="border-t border-ink/10 bg-brand px-6 pt-10 pb-8 md:pt-12 md:pb-10">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3 md:gap-6">
        <div>
          <p className="font-heading text-xl tracking-tight text-ink md:text-2xl">
            Discovery of Coins
          </p>
          <p className="mt-3 max-w-xs font-sans text-sm font-light leading-relaxed text-ink/70">
            Authentic collectible banknotes, coins and stamps from Bangladesh
            and around the world.
          </p>
        </div>

        <div>
          <h3 className="mb-3 font-sans text-xs font-medium uppercase tracking-widest text-ink/50">
            Navigation
          </h3>
          <ul className="space-y-1.5">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.href}
                  className="font-sans text-sm font-light text-ink/80 transition-colors hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-sans text-xs font-medium uppercase tracking-widest text-ink/50">
            Contact
          </h3>
          <div className="space-y-2 font-sans text-sm font-light text-ink/80">
            <p>
              <span className="text-ink/50">Instagram</span>
              <br />
              <a
                href={instagramHref}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-ink"
              >
                {instagram}
              </a>
            </p>
            <p>
              <span className="text-ink/50">Phone</span>
              <br />
              <a href={`tel:${phone}`} className="transition-colors hover:text-ink">
                {phone}
              </a>
            </p>
            {whatsappHref ? (
              <p>
                <span className="text-ink/50">WhatsApp</span>
                <br />
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-ink"
                >
                  Join our channel
                </a>
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-6xl border-t border-ink/10 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-sans text-xs font-light uppercase tracking-widest text-ink/40">
            © {new Date().getFullYear()} Discovery of Coins. All rights reserved.
          </p>
          <Link
            to="/admin/login"
            className="font-sans text-xs font-light uppercase tracking-widest text-ink/40 transition-colors hover:text-ink"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
