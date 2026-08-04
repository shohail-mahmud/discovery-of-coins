import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useCategories } from '@/hooks/useContent';

const inputClass =
  'w-full border border-ink/20 bg-paper px-3 py-2.5 font-sans text-sm font-light text-ink outline-none focus:border-ink/50';

export function AdminCategories() {
  const queryClient = useQueryClient();
  const { data: categories = [], isLoading } = useCategories();
  const [newName, setNewName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['categories'] });
  };

  const toggle = useMutation({
    mutationFn: async ({ id, visible }: { id: string; visible: boolean }) => {
      const { error: updateError } = await supabase
        .from('categories')
        .update({ visible })
        .eq('id', id);
      if (updateError) throw updateError;
    },
    onSuccess: invalidate,
    onError: (err) => setError(err instanceof Error ? err.message : 'Update failed'),
  });

  const add = useMutation({
    mutationFn: async () => {
      const name = newName.trim();
      if (!name) return;
      const sort = Math.max(0, ...categories.map((c) => c.sort_order)) + 1;
      const { error: insertError } = await supabase
        .from('categories')
        .insert({ name, sort_order: sort, visible: true });
      if (insertError) throw insertError;
    },
    onSuccess: () => {
      setNewName('');
      invalidate();
    },
    onError: (err) => setError(err instanceof Error ? err.message : 'Could not add category'),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error: deleteError } = await supabase.from('categories').delete().eq('id', id);
      if (deleteError) throw deleteError;
    },
    onSuccess: invalidate,
    onError: (err) => setError(err instanceof Error ? err.message : 'Delete failed'),
  });

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex flex-wrap gap-2">
        <input
          className={`${inputClass} max-w-xs`}
          placeholder="New category name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button
          type="button"
          onClick={() => add.mutate()}
          disabled={add.isPending || !newName.trim()}
          className="inline-flex items-center gap-2 bg-ink px-5 py-2.5 font-sans text-xs font-medium uppercase tracking-widest text-brand transition-colors hover:bg-ink/90 disabled:opacity-50"
        >
          <Plus size={14} /> Add category
        </button>
      </div>

      {error ? <p className="font-sans text-xs text-red-700">{error}</p> : null}

      {isLoading ? (
        <p className="font-sans text-sm font-light text-ink/60">Loading…</p>
      ) : (
        <div className="divide-y divide-ink/10 border border-ink/10 bg-paper">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
            >
              <div>
                <p className="font-sans text-sm text-ink">{category.name}</p>
                <p className="font-sans text-[11px] uppercase tracking-widest text-ink/50">
                  {category.visible ? 'Visible on website' : 'Hidden from website'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    toggle.mutate({ id: category.id, visible: !category.visible })
                  }
                  className={`border px-4 py-2 font-sans text-xs uppercase tracking-widest transition-colors ${
                    category.visible
                      ? 'border-ink bg-ink text-brand'
                      : 'border-ink/20 text-ink hover:border-ink/40'
                  }`}
                >
                  {category.visible ? 'Visible' : 'Hidden'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (
                      window.confirm(
                        `Delete the category "${category.name}"? Products are not deleted.`,
                      )
                    ) {
                      remove.mutate(category.id);
                    }
                  }}
                  className="p-2 text-ink/50 hover:text-ink"
                  aria-label={`Delete ${category.name}`}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="font-sans text-xs font-light text-ink/60">
        Hiding a category only removes it from the public website. Products and data stay
        intact and reappear when you make the category visible again.
      </p>
    </div>
  );
}
