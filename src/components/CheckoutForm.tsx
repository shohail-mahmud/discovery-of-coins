import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '../context/CartContext';
import type { Product } from '../data/products';
import { formatPrice, COURIERS } from '@/lib/store';

interface CheckoutFormProps {
  lines: (Product & { quantity: number })[];
  total: number;
}

export function CheckoutForm({ lines, total }: CheckoutFormProps) {
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [courier, setCourier] = useState<string>('');
  const [form, setForm] = useState({ name: '', phone: '', address: '', note: '' });

  const deliveryCharge =
    COURIERS.find((option) => option.name === courier)?.charge ?? 0;
  const finalTotal = total + deliveryCharge;

  const update = (key: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      setError('Please fill in your name, phone and address.');
      return;
    }
    if (!courier) {
      setError('Please select a courier service.');
      return;
    }
    setSubmitting(true);
    try {
      const { error: rpcError } = await supabase.rpc('place_order', {
        _customer_name: form.name.trim(),
        _customer_phone: form.phone.trim(),
        _customer_address: form.address.trim(),
        _note: form.note.trim(),
        _courier: courier,
        _delivery_charge: deliveryCharge,
        _items: lines.map((line) => ({
          product_id: line.id,
          quantity: line.quantity,
        })),
      });
      if (rpcError) throw rpcError;

      clearCart();
      void queryClient.invalidateQueries({ queryKey: ['products'] });
      void navigate({ to: '/order-success' });
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      setError(
        message.toLowerCase().includes('stock')
          ? 'Some items are no longer available in the requested quantity. Please review your cart.'
          : 'Something went wrong placing your order. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

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

      <p className="pt-1 font-sans text-xs font-medium uppercase tracking-widest text-ink/50">
        Courier service
      </p>
      <div className="space-y-2">
        {COURIERS.map((option) => (
          <label
            key={option.name}
            className={`flex cursor-pointer items-center justify-between border px-3 py-2.5 font-sans text-sm text-ink transition-colors ${
              courier === option.name ? 'border-ink' : 'border-ink/20 hover:border-ink/40'
            }`}
          >
            <span className="flex items-center gap-2">
              <input
                type="radio"
                name="courier"
                value={option.name}
                checked={courier === option.name}
                onChange={() => setCourier(option.name)}
              />
              {option.name}
            </span>
            <span className="font-light text-ink/70">
              Delivery {formatPrice(option.charge)}
            </span>
          </label>
        ))}
      </div>

      <div className="space-y-1 border-t border-ink/10 pt-3 font-sans text-sm text-ink">
        <div className="flex justify-between">
          <span className="font-light">Subtotal</span>
          <span>{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-light">Delivery</span>
          <span>{courier ? formatPrice(deliveryCharge) : '—'}</span>
        </div>
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>{formatPrice(finalTotal)}</span>
        </div>
      </div>

      {error ? <p className="font-sans text-xs text-red-700">{error}</p> : null}
      <button
        type="submit"
        disabled={submitting || !courier}
        className="w-full bg-ink py-3.5 font-sans text-sm font-medium uppercase tracking-widest text-brand transition-colors hover:bg-ink/90 disabled:opacity-60"
      >
        {submitting ? 'Placing order…' : `Place order · ${formatPrice(finalTotal)}`}
      </button>
    </form>
  );
}
