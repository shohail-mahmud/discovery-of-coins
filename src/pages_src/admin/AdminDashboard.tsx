import { useState } from 'react';
import { Link } from '@/lib/router-compat';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminOrders } from './AdminOrders';
import { AdminProducts } from './AdminProducts';
import { AdminContact } from './AdminContact';
import { AdminCategories } from './AdminCategories';
import { AdminFaqs } from './AdminFaqs';
import { AdminCombos } from './AdminCombos';

const TABS = [
  'Orders',
  'Products',
  'Categories',
  'Combos',
  'FAQs',
  'Contact Details',
] as const;
type Tab = (typeof TABS)[number];

export function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('Orders');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleSignOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    void navigate({ to: '/admin/login', replace: true });
  };

  return (
    <div className="min-h-screen bg-brand px-6 py-10 md:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl tracking-tight text-ink md:text-4xl">
              Admin Dashboard
            </h1>
            <Link
              to="/"
              className="mt-2 inline-block font-sans text-xs uppercase tracking-widest text-ink/60 hover:text-ink"
            >
              ← View website
            </Link>
          </div>
          <button
            type="button"
            onClick={() => void handleSignOut()}
            className="border border-ink px-5 py-2.5 font-sans text-xs font-medium uppercase tracking-widest text-ink transition-colors hover:bg-ink hover:text-brand"
          >
            Sign out
          </button>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {TABS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={`border px-4 py-2 font-sans text-xs uppercase tracking-widest transition-colors ${
                tab === item
                  ? 'border-ink bg-ink text-brand'
                  : 'border-ink/20 text-ink hover:border-ink/40'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {tab === 'Orders' ? <AdminOrders /> : null}
          {tab === 'Products' ? <AdminProducts /> : null}
          {tab === 'Categories' ? <AdminCategories /> : null}
          {tab === 'Combos' ? <AdminCombos /> : null}
          {tab === 'FAQs' ? <AdminFaqs /> : null}
          {tab === 'Contact Details' ? <AdminContact /> : null}
        </div>
      </div>
    </div>
  );
}
