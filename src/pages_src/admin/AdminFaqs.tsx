import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Pencil, X, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useFaqs } from '@/hooks/useContent';
import type { Faq } from '@/lib/content';

const inputClass =
  'w-full border border-ink/20 bg-paper px-3 py-2.5 font-sans text-sm font-light text-ink outline-none focus:border-ink/50';

type Draft = {
  question: string;
  answer: string;
  display_order: number;
  enabled: boolean;
};

export function AdminFaqs() {
  const queryClient = useQueryClient();
  const { data: faqs = [], isLoading } = useFaqs();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState<string | null>(null);

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['faqs'] });
  };

  const save = useMutation({
    mutationFn: async () => {
      if (!draft) return;
      const payload = {
        question: draft.question,
        answer: draft.answer,
        display_order: Math.max(0, Math.floor(Number(draft.display_order) || 0)),
        enabled: draft.enabled,
      };
      if (editingId === 'new') {
        const { error: insertError } = await supabase.from('faqs').insert(payload);
        if (insertError) throw insertError;
      } else if (editingId) {
        const { error: updateError } = await supabase
          .from('faqs')
          .update(payload)
          .eq('id', editingId);
        if (updateError) throw updateError;
      }
    },
    onSuccess: () => {
      setEditingId(null);
      setDraft(null);
      invalidate();
    },
    onError: (err) => setError(err instanceof Error ? err.message : 'Save failed'),
  });

  const patch = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Partial<Draft> }) => {
      const { error: updateError } = await supabase.from('faqs').update(values).eq('id', id);
      if (updateError) throw updateError;
    },
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error: deleteError } = await supabase.from('faqs').delete().eq('id', id);
      if (deleteError) throw deleteError;
    },
    onSuccess: invalidate,
  });

  const startNew = () => {
    setEditingId('new');
    setDraft({
      question: '',
      answer: '',
      display_order: faqs.length + 1,
      enabled: true,
    });
    setError(null);
  };

  const startEdit = (faq: Faq) => {
    setEditingId(faq.id);
    setDraft({
      question: faq.question,
      answer: faq.answer,
      display_order: faq.display_order,
      enabled: faq.enabled,
    });
    setError(null);
  };

  const move = (faq: Faq, direction: -1 | 1) => {
    const sorted = [...faqs].sort((a, b) => a.display_order - b.display_order);
    const index = sorted.findIndex((item) => item.id === faq.id);
    const swapWith = sorted[index + direction];
    if (!swapWith) return;
    patch.mutate({ id: faq.id, values: { display_order: swapWith.display_order } });
    patch.mutate({ id: swapWith.id, values: { display_order: faq.display_order } });
  };

  return (
    <div className="max-w-3xl space-y-5">
      <button
        type="button"
        onClick={startNew}
        className="inline-flex items-center gap-2 bg-ink px-5 py-2.5 font-sans text-xs font-medium uppercase tracking-widest text-brand transition-colors hover:bg-ink/90"
      >
        <Plus size={14} /> Add FAQ
      </button>

      {draft ? (
        <div className="space-y-3 border border-ink/20 bg-paper p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg tracking-tight text-ink">
              {editingId === 'new' ? 'New FAQ' : 'Edit FAQ'}
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

          <input
            className={inputClass}
            placeholder="Question"
            value={draft.question}
            onChange={(e) => setDraft({ ...draft, question: e.target.value })}
          />
          <textarea
            className={`${inputClass} min-h-[90px]`}
            placeholder="Answer"
            value={draft.answer}
            onChange={(e) => setDraft({ ...draft, answer: e.target.value })}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              className={inputClass}
              type="number"
              min="0"
              placeholder="Display order"
              value={draft.display_order}
              onChange={(e) =>
                setDraft({ ...draft, display_order: Number(e.target.value) })
              }
            />
            <label className="flex items-center gap-2 font-sans text-sm text-ink">
              <input
                type="checkbox"
                checked={draft.enabled}
                onChange={(e) => setDraft({ ...draft, enabled: e.target.checked })}
              />
              Enabled (shown on homepage)
            </label>
          </div>

          {error ? <p className="font-sans text-xs text-red-700">{error}</p> : null}

          <button
            type="button"
            onClick={() => save.mutate()}
            disabled={save.isPending || !draft.question.trim()}
            className="bg-ink px-6 py-2.5 font-sans text-xs font-medium uppercase tracking-widest text-brand transition-colors hover:bg-ink/90 disabled:opacity-50"
          >
            {save.isPending ? 'Saving…' : 'Save FAQ'}
          </button>
        </div>
      ) : null}

      {isLoading ? (
        <p className="font-sans text-sm font-light text-ink/60">Loading…</p>
      ) : faqs.length === 0 ? (
        <p className="font-sans text-sm font-light text-ink/60">No FAQs yet.</p>
      ) : (
        <div className="divide-y divide-ink/10 border border-ink/10 bg-paper">
          {faqs.map((faq) => (
            <div key={faq.id} className="flex flex-wrap items-start justify-between gap-3 px-4 py-3">
              <div className="max-w-lg">
                <p className="font-sans text-sm text-ink">{faq.question}</p>
                <p className="mt-1 font-sans text-xs font-light text-ink/60">{faq.answer}</p>
                <p className="mt-1 font-sans text-[11px] uppercase tracking-widest text-ink/50">
                  Order {faq.display_order} · {faq.enabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(faq, -1)}
                  className="p-2 text-ink/50 hover:text-ink"
                  aria-label="Move up"
                >
                  <ArrowUp size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => move(faq, 1)}
                  className="p-2 text-ink/50 hover:text-ink"
                  aria-label="Move down"
                >
                  <ArrowDown size={15} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    patch.mutate({ id: faq.id, values: { enabled: !faq.enabled } })
                  }
                  className={`border px-3 py-1.5 font-sans text-[11px] uppercase tracking-widest transition-colors ${
                    faq.enabled
                      ? 'border-ink bg-ink text-brand'
                      : 'border-ink/20 text-ink hover:border-ink/40'
                  }`}
                >
                  {faq.enabled ? 'Enabled' : 'Disabled'}
                </button>
                <button
                  type="button"
                  onClick={() => startEdit(faq)}
                  className="p-2 text-ink/50 hover:text-ink"
                  aria-label="Edit FAQ"
                >
                  <Pencil size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Delete this FAQ?')) remove.mutate(faq.id);
                  }}
                  className="p-2 text-ink/50 hover:text-ink"
                  aria-label="Delete FAQ"
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
