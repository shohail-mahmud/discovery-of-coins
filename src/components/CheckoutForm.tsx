import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '../context/CartContext';
import type { Product } from '../data/products';
import { formatPrice } from '@/lib/store';

interface CheckoutFormProps {
  lines: (Product & { quantity: number })[];
  total: number;
}

export function CheckoutForm({ lines, total }: CheckoutFormProps) {
  const { clearCart } = useCart();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placed, setPlaced] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', address: '', note: '' });

  const update = (key: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      setError('Please fill in your name, phone and address.');
      return;
    }
    setSubmitting(true);
    try {
      const orderId = crypto.randomUUID();
      const { error: orderError } = await supabase.from('orders').insert({
        id: orderId,
        customer_name: form.name.trim(),
        customer_phone: form.phone.trim(),
        customer_address: form.address.trim(),
        note: form.note.trim(),
        total_price: total,
      });
      if (orderError) throw orderError;

      const { error: itemsError } = await supabase.from('order_items').insert(
        lines.map((line) => ({
          order_id: orderId,
          product_id: line.id,
          product_name: line.name,
          unit_price: line.price,
          quantity: line.quantity,
        }))
      );
      if (itemsError) throw itemsError;

      clearCart();
      setPlaced(true);
    } catch {
      setError('Something went wrong placing your order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (placed) {
    return (
      <div className="mt-5 border border-ink/15 bg-brand/40 p-4">
        <p className="font-heading text-lg tracking-tight text-ink">Order placed</p>
        <p className="mt-2 font-sans text-sm font-light text-ink/70">
          Thank you. We will contact you shortly to confirm your order.
        </p>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-5 w-full bg-ink py-3.5 font-sans text-sm font-medium uppercase tracking-widest text-brand transition-colors hover:bg-ink/90"
      >
        Proceed to Checkout
      </button>
    );
  }

  const inputClass =
    'w-full border border-ink/20 bg-paper px-3 py-2.5 font-sans text-sm font-light text-ink outline-none focus:border-ink/50';

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-3">
      <p className="font-sans text-xs font-medium uppercase tracking-widest text-ink/50">
        Delivery details
      </p>
      <input
        className={inputClass}
        placeholder="Full name"
        value={form.name}
        onChange={(e) => update('name', e.target.value)}
      />
      <input
        className={inputClass}
        placeholder="Phone number"
        value={form.phone}
        onChange={(e) => update('phone', e.target.value)}
      />
      <textarea
        className={`${inputClass} min-h-[80px]`}
        placeholder="Delivery address"
        value={form.address}
        onChange={(e) => update('address', e.target.value)}
      />
      <textarea
        className={`${inputClass} min-h-[60px]`}
        placeholder="Note (optional)"
        value={form.note}
        onChange={(e) => update('note', e.target.value)}
      />
      {error ? (
        <p className="font-sans text-xs text-red-700">{error}</p>
      ) : null}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-ink py-3.5 font-sans text-sm font-medium uppercase tracking-widest text-brand transition-colors hover:bg-ink/90 disabled:opacity-60"
      >
        {submitting ? 'Placing order…' : `Place order · ${formatPrice(total)}`}
      </button>
    </form>
  );
}
