import { Link } from '@/lib/router-compat';

export function CompactFooter() {
  return (
    <footer className="border-t border-ink/10 bg-brand px-6 py-4 md:py-5">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-2 md:flex-row md:items-center">
        <div>
          <p className="font-heading text-base tracking-tight text-ink md:text-lg">
            Discovery of Coins
          </p>
          <p className="max-w-xs font-sans text-xs font-light leading-snug text-ink/70">
            Authentic collectible banknotes, coins and stamps from Bangladesh and around the world.
          </p>
        </div>
        <p className="font-sans text-[10px] font-light uppercase tracking-widest text-ink/40">
          © 2026 Discovery of Coins. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
