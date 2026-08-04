import { Link } from '@/lib/router-compat';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Shop', href: '/shop' },
  { label: 'Contact', href: '/contact' },
  { label: 'Combo', href: '/combo' },
  { label: 'Terms & Policy', href: '/terms' },
];

export function Footer() {
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
                href="https://instagram.com/discoveryofcoins"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-ink"
              >
                @discoveryofcoins
              </a>
            </p>
            <p>
              <span className="text-ink/50">Phone</span>
              <br />
              <a href="tel:01700000000" className="transition-colors hover:text-ink">
                01700000000
              </a>
            </p>
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
