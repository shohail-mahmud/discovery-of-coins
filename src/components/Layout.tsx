import { useLocation, Outlet } from '@/lib/router-compat';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { CompactFooter } from './CompactFooter';

function isCompactFooterPath(pathname: string) {
  return (
    pathname.startsWith('/shop') ||
    pathname.startsWith('/product/') ||
    pathname.startsWith('/about') ||
    pathname.startsWith('/contact') ||
    pathname.startsWith('/terms') ||
    pathname.startsWith('/cart') ||
    pathname.startsWith('/order-success') ||
    pathname.startsWith('/combo')
  );
}

export function Layout() {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-brand">
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
      {isCompactFooterPath(pathname) ? <CompactFooter /> : <Footer />}
    </div>
  );
}

