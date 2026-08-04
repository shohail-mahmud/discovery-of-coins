import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Pencil, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useCombos } from '@/hooks/useContent';
import { MAX_COMBO_SLOTS, type Combo } from '@/lib/content';
import { formatPrice, PRODUCT_BUCKET } from '@/lib/store';
import { ProductImage } from '@/components/products/ProductImage';

const inputClass =
  'w-full border border-ink/20 bg-paper px-3 py-2.5 font-sans text-sm font-light text-ink outline-none focus:border-ink/50';

type SlotDraft = { country: string; denomination: string; description: string };

type Draft = {
  name: string;
  description: string;
  price: string;
  available: boolean;
  itemCount: number;
  images: string[];
  slots: SlotDraft[];
};

const emptySlot: SlotDraft = { country: '', denomination: '', description: '' };

const emptyDraft: Draft = {
  name: '',
  description: '',
  price: '0',
  available: true,
  itemCount: 1,
  images: [],
  slots: [{ ...emptySlot }],
};

function toDraft(combo: Combo): Draft {
  const slots: SlotDraft[] = [];
  for (let index = 0; index < combo.item_count; index += 1) {
    const item = combo.items[index];
    slots.push({
      country: item?.country ?? '',
      denomination: item?.denomination ?? '',
      description: item?.description ?? '',
    });
  }
  return {
    name: combo.name,
    description: combo.description,
    price: String(combo.price),
    available: combo.available,
    itemCount: combo.item_count,
    images: combo.images,
    slots,
  };
}

function resizeSlots(slots: SlotDraft[], count: number): SlotDraft[] {
  const next = slots.slice(0, count);
  while (next.length < count) next.push({ ...emptySlot });
  return next;
}

export function AdminCombos() {
  const queryClient = useQueryClient();
  const { data: combos = [], isLoading } = useCombos();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['combos'] });
  };

  const save = useMutation({
    mutationFn: async () => {
      if (!draft) return;
      const payload = {
        name: draft.name,
        description: draft.description,
        price: Number(draft.price) || 0,
        available: draft.available,
        item_count: Math.min(MAX_COMBO_SLOTS, Math.max(1, Math.floor(draft.itemCount) || 1)),
        images: draft.images,
      };

      let comboId = editingId;
      if (editingId === 'new') {
        const { data, error: insertError } = await supabase
          .from('combos')
          .insert(payload)
          .select('id')
          .single();
        if (insertError) throw insertError;
        comboId = data.id;
      } else if (editingId) {
        const { error: updateError } = await supabase
          .from('combos')
          .update(payload)
          .eq('id', editingId);
        if (updateError) throw updateError;
        const { error: clearError } = await supabase
          .from('combo_items')
          .delete()
          .eq('combo_id', editingId);
        if (clearError) throw clearError;
      }

      if (!comboId) return;
      const rows = draft.slots.slice(0, payload.item_count).map((slot, index) => ({
        combo_id: comboId as string,
        slot_number: index + 1,
        country: slot.country,
        denomination: slot.denomination,
        description: slot.description,
      }));
      if (rows.length > 0) {
        const { error: itemsError } = await supabase.from('combo_items').insert(rows);
        if (itemsError) throw itemsError;
      }
    },
    onSuccess: () => {
      setEditingId(null);
      setDraft(null);
      invalidate();
    },
    onError: (err) => setError(err instanceof Error ? err.message : 'Save failed'),
  });

  const remove = useMutation({
    mutationFn: async (combo: Combo) => {
      if (combo.images.length > 0) {
        await supabase.storage.from(PRODUCT_BUCKET).remove(combo.images);
      }
      const { error: deleteError } = await supabase.from('combos').delete().eq('id', combo.id);
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
        const path = `combo-${crypto.randomUUID()}.${ext}`;
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

  const updateSlot = (index: number, values: Partial<SlotDraft>) => {
    if (!draft) return;
    const slots = draft.slots.map((slot, i) => (i === index ? { ...slot, ...values } : slot));
    setDraft({ ...draft, slots });
  };

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => {
          setEditingId('new');
          setDraft({ ...emptyDraft, slots: [{ ...emptySlot }] });
          setError(null);
        }}
        className="inline-flex items-center gap-2 bg-ink px-5 py-2.5 font-sans text-xs font-medium uppercase tracking-widest text-brand transition-colors hover:bg-ink/90"
      >
        <Plus size={14} /> Create combo
      </button>

      {draft ? (
        <div className="space-y-4 border border-ink/20 bg-paper p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg tracking-tight text-ink">
              {editingId === 'new' ? 'New combo' : 'Edit combo'}
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
              placeholder="Combo name"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
            <input
              className={inputClass}
              type="number"
              placeholder="Price"
              value={draft.price}
              onChange={(e) => setDraft({ ...draft, price: e.target.value })}
            />
            <label className="block">
              <span className="font-sans text-xs font-medium uppercase tracking-widest text-ink/50">
                Number of items (1–{MAX_COMBO_SLOTS})
              </span>
              <input
                className={`${inputClass} mt-1`}
                type="number"
                min="1"
                max={MAX_COMBO_SLOTS}
                value={draft.itemCount}
                onChange={(e) => {
                  const count = Math.min(
                    MAX_COMBO_SLOTS,
                    Math.max(1, Math.floor(Number(e.target.value) || 1)),
                  );
                  setDraft({
                    ...draft,
                    itemCount: count,
                    slots: resizeSlots(draft.slots, count),
                  });
                }}
              />
            </label>
            <label className="flex items-center gap-2 font-sans text-sm text-ink">
              <input
                type="checkbox"
                checked={draft.available}
                onChange={(e) => setDraft({ ...draft, available: e.target.checked })}
              />
              Available for purchase
            </label>
          </div>

          <textarea
            className={`${inputClass} min-h-[90px]`}
            placeholder="Combo description"
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          />

          <div>
            <p className="font-sans text-xs font-medium uppercase tracking-widest text-ink/50">
              Combo images
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              {draft.images.map((path) => (
                <div
                  key={path}
                  className="relative flex aspect-square w-24 items-center justify-center overflow-hidden border border-ink/10 bg-paper"
                >
                  <ProductImage path={path} alt="Combo image" iconSize={18} />
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
              accept="image/png,image/jpeg,image/jpg"
              multiple
              disabled={uploading}
              onChange={(e) => void handleUpload(e.target.files)}
              className="mt-3 font-sans text-xs text-ink/70"
            />
            {uploading ? (
              <p className="mt-1 font-sans text-xs text-ink/60">Uploading…</p>
            ) : null}
          </div>

          <div>
            <p className="font-sans text-xs font-medium uppercase tracking-widest text-ink/50">
              Combo items
            </p>
            <div className="mt-2 space-y-3">
              {draft.slots.map((slot, index) => (
                <div key={index} className="border border-ink/10 p-3">
                  <p className="font-sans text-[11px] uppercase tracking-widest text-ink/50">
                    Slot {index + 1}
                  </p>
                  <div className="mt-2 grid gap-2 sm:grid-cols-3">
                    <input
                      className={inputClass}
                      placeholder="Country"
                      value={slot.country}
                      onChange={(e) => updateSlot(index, { country: e.target.value })}
                    />
                    <input
                      className={inputClass}
                      placeholder="Denomination"
                      value={slot.denomination}
                      onChange={(e) => updateSlot(index, { denomination: e.target.value })}
                    />
                    <input
                      className={inputClass}
                      placeholder="Description (optional)"
                      value={slot.description}
                      onChange={(e) => updateSlot(index, { description: e.target.value })}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error ? <p className="font-sans text-xs text-red-700">{error}</p> : null}

          <button
            type="button"
            onClick={() => save.mutate()}
            disabled={save.isPending || !draft.name.trim()}
            className="bg-ink px-6 py-2.5 font-sans text-xs font-medium uppercase tracking-widest text-brand transition-colors hover:bg-ink/90 disabled:opacity-50"
          >
            {save.isPending ? 'Saving…' : 'Save combo'}
          </button>
        </div>
      ) : null}

      {isLoading ? (
        <p className="font-sans text-sm font-light text-ink/60">Loading…</p>
      ) : combos.length === 0 ? (
        <p className="font-sans text-sm font-light text-ink/60">No combos yet.</p>
      ) : (
        <div className="divide-y divide-ink/10 border border-ink/10 bg-paper">
          {combos.map((combo) => (
            <div
              key={combo.id}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
            >
              <div>
                <p className="font-sans text-sm text-ink">{combo.name}</p>
                <p className="font-sans text-[11px] uppercase tracking-widest text-ink/50">
                  {formatPrice(combo.price)} · {combo.item_count} items ·{' '}
                  {combo.available ? 'Available' : 'Unavailable'}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(combo.id);
                    setDraft(toDraft(combo));
                    setError(null);
                  }}
                  className="p-2 text-ink/50 hover:text-ink"
                  aria-label="Edit combo"
                >
                  <Pencil size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Delete combo "${combo.name}"?`)) remove.mutate(combo);
                  }}
                  className="p-2 text-ink/50 hover:text-ink"
                  aria-label="Delete combo"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
