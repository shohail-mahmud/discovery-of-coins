import { useState } from 'react';
import { Link } from '@/lib/router-compat';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Shop', href: '/shop' },
  { label: 'Contact', href: '/contact' },
  { label: 'Combo', href: '/combo' },
  { label: 'Terms & Policy', href: '/terms' },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-brand">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:py-6">
        <Link
          to="/"
          className="font-heading text-xl tracking-tight text-ink md:text-2xl"
        >
          Discovery of Coins
        </Link>

        <ul className="hidden items-center gap-4 md:gap-6 lg:gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                to={link.href}
                className="group relative font-sans text-sm font-medium uppercase tracking-widest text-ink"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-ink transition-all duration-300 group-hover:w-full" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <Link
            to="/cart"
            className="flex items-center gap-2 font-sans text-sm font-medium uppercase tracking-widest text-ink"
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            <span className="hidden sm:inline">Cart ({totalItems})</span>
            <span className="inline sm:hidden">({totalItems})</span>
          </Link>

          <button
            type="button"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            className="relative p-2 md:hidden"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden bg-brand md:hidden"
          >
            <ul className="flex flex-col gap-6 px-6 pb-10 pt-4">
              {navLinks.map((link, index) => (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 + 0.1 }}
                >
                  <Link
                    to={link.href}
                    className="block font-sans text-2xl font-light uppercase tracking-widest text-ink"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
