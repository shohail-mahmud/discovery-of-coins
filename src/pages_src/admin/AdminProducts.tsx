import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, Pencil, Plus, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useProducts } from '@/hooks/useProducts';
import { formatPrice, PRODUCT_BUCKET } from '@/lib/store';
import { productCategories, productTypes, type Product } from '@/data/products';
import { ProductImage } from '@/components/products/ProductImage';

type Draft = {
  name: string;
  country: string;
  category: string;
  denomination: string;
  currency: string;
  year: string;
  condition: string;
  type: string;
  description: string;
  price: string;
  available: boolean;
  images: string[];
};

const emptyDraft: Draft = {
  name: '',
  country: '',
  category: productCategories[0] as string,
  denomination: '',
  currency: '',
  year: '',
  condition: '',
  type: 'Coin',
  description: '',
  price: '0',
  available: true,
  images: [],
};

function toDraft(product: Product): Draft {
  return {
    name: product.name,
    country: product.country,
    category: product.category,
    denomination: product.denomination,
    currency: product.currency,
    year: product.year,
    condition: product.condition,
    type: product.type,
    description: product.description,
    price: String(product.price),
    available: product.available,
    images: product.images,
  };
}

const inputClass =
  'w-full border border-ink/20 bg-paper px-3 py-2.5 font-sans text-sm font-light text-ink outline-none focus:border-ink/50';

export function AdminProducts() {
  const queryClient = useQueryClient();
  const { data: products = [], isLoading } = useProducts();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['products'] });

  const save = useMutation({
    mutationFn: async () => {
      if (!draft) return;
      const payload = { ...draft, price: Number(draft.price) || 0 };
      if (editingId === 'new') {
        const { error: insertError } = await supabase.from('products').insert(payload);
        if (insertError) throw insertError;
      } else if (editingId) {
        const { error: updateError } = await supabase
          .from('products')
          .update(payload)
          .eq('id', editingId);
        if (updateError) throw updateError;
      }
    },
    onSuccess: () => {
      setEditingId(null);
      setDraft(null);
      void invalidate();
    },
    onError: (err) => setError(err instanceof Error ? err.message : 'Save failed'),
  });

  const remove = useMutation({
    mutationFn: async (product: Product) => {
      if (product.images.length > 0) {
        await supabase.storage.from(PRODUCT_BUCKET).remove(product.images);
      }
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);
      if (deleteError) throw deleteError;
    },
    onSuccess: invalidate,
  });

  const handleUpload = async (files: FileList | null) => {
    if (!files || !draft) return;
    setUploading(true);
    setError(null);
    try {
      const paths: string[] = [];
      for (const file of Array.from(files)) {
        const ext = file.name.split('.').pop() ?? 'jpg';
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from(PRODUCT_BUCKET)
          .upload(path, file, { upsert: false });
        if (uploadError) throw uploadError;
        paths.push(path);
      }
      setDraft({ ...draft, images: [...draft.images, ...paths] });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (path: string) => {
    if (!draft) return;
    await supabase.storage.from(PRODUCT_BUCKET).remove([path]);
    setDraft({ ...draft, images: draft.images.filter((item) => item !== path) });
  };

  const startNew = () => {
    setEditingId('new');
    setDraft({ ...emptyDraft });
    setError(null);
  };

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={startNew}
        className="inline-flex items-center gap-2 bg-ink px-5 py-2.5 font-sans text-xs font-medium uppercase tracking-widest text-brand transition-colors hover:bg-ink/90"
      >
        <Plus size={14} /> Add product
      </button>

      {draft ? (
        <div className="space-y-3 border border-ink/20 bg-paper p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg tracking-tight text-ink">
              {editingId === 'new' ? 'New product' : 'Edit product'}
            </h3>
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setDraft(null);
              }}
              className="text-ink/50 hover:text-ink"
              aria-label="Close editor"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <input
              className={inputClass}
              placeholder="Name"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Country"
              value={draft.country}
              onChange={(e) => setDraft({ ...draft, country: e.target.value })}
            />
            <select
              className={inputClass}
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
            >
              {productCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <select
              className={inputClass}
              value={draft.type}
              onChange={(e) => setDraft({ ...draft, type: e.target.value })}
            >
              {productTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <input
              className={inputClass}
              placeholder="Denomination"
              value={draft.denomination}
              onChange={(e) => setDraft({ ...draft, denomination: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Currency"
              value={draft.currency}
              onChange={(e) => setDraft({ ...draft, currency: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Year"
              value={draft.year}
              onChange={(e) => setDraft({ ...draft, year: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Condition"
              value={draft.condition}
              onChange={(e) => setDraft({ ...draft, condition: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Price"
              type="number"
              value={draft.price}
              onChange={(e) => setDraft({ ...draft, price: e.target.value })}
            />
            <label className="flex items-center gap-2 font-sans text-sm text-ink">
              <input
                type="checkbox"
                checked={draft.available}
                onChange={(e) => setDraft({ ...draft, available: e.target.checked })}
              />
              Available for sale
            </label>
          </div>

          <textarea
            className={`${inputClass} min-h-[90px]`}
            placeholder="Description"
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          />

          <div>
            <p className="font-sans text-xs font-medium uppercase tracking-widest text-ink/50">
              Images
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              {draft.images.map((path) => (
                <div
                  key={path}
                  className="relative flex aspect-square w-24 items-center justify-center overflow-hidden border border-ink/10 bg-paper"
                >
                  <ProductImage path={path} alt="Product image" iconSize={18} />
                  <button
                    type="button"
                    onClick={() => void removeImage(path)}
                    className="absolute right-1 top-1 bg-ink/80 p-1 text-brand"
                    aria-label="Remove image"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={uploading}
              onChange={(e) => void handleUpload(e.target.files)}
              className="mt-3 font-sans text-xs text-ink/70"
            />
            {uploading ? (
              <p className="mt-1 font-sans text-xs text-ink/60">Uploading…</p>
            ) : null}
          </div>

          {error ? <p className="font-sans text-xs text-red-700">{error}</p> : null}

          <button
            type="button"
            onClick={() => save.mutate()}
            disabled={save.isPending}
            className="w-full bg-ink py-3 font-sans text-sm font-medium uppercase tracking-widest text-brand transition-colors hover:bg-ink/90 disabled:opacity-60 sm:w-auto sm:px-8"
          >
            {save.isPending ? 'Saving…' : 'Save product'}
          </button>
        </div>
      ) : null}

      {isLoading ? (
        <p className="font-sans text-sm font-light text-ink/60">Loading products…</p>
      ) : (
        <div className="divide-y divide-ink/10 border border-ink/10 bg-paper">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-wrap items-center justify-between gap-3 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex aspect-square w-14 items-center justify-center overflow-hidden border border-ink/10">
                  <ProductImage path={product.images[0]} alt={product.name} iconSize={16} />
                </div>
                <div>
                  <p className="font-heading text-base tracking-tight text-ink">
                    {product.name}
                  </p>
                  <p className="font-sans text-xs font-light text-ink/60">
                    {product.category} · {product.year} · {formatPrice(product.price)}
                    {product.available ? '' : ' · Sold out'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(product.id);
                    setDraft(toDraft(product));
                    setError(null);
                  }}
                  className="border border-ink/20 p-2 text-ink/60 transition-colors hover:border-ink hover:text-ink"
                  aria-label="Edit product"
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Delete "${product.name}" permanently?`)) {
                      remove.mutate(product);
                    }
                  }}
                  className="border border-ink/20 p-2 text-ink/60 transition-colors hover:border-ink hover:text-ink"
                  aria-label="Delete product"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
