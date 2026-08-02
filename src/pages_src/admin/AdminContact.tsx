import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ContactRow {
  id: string;
  facebook: string;
  instagram: string;
  admin_instagram: string;
  whatsapp_channel: string;
  phone: string;
}

const FIELDS: { key: keyof Omit<ContactRow, 'id'>; label: string }[] = [
  { key: 'facebook', label: 'Facebook' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'admin_instagram', label: "Admin's Instagram" },
  { key: 'whatsapp_channel', label: 'WhatsApp Channel' },
  { key: 'phone', label: 'Phone' },
];

export function AdminContact() {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ['contact-details'],
    queryFn: async () => {
      const { data: row, error } = await supabase
        .from('contact_details')
        .select('*')
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return row as unknown as ContactRow | null;
    },
  });

  const [form, setForm] = useState<Omit<ContactRow, 'id'>>({
    facebook: '',
    instagram: '',
    admin_instagram: '',
    whatsapp_channel: '',
    phone: '',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data) {
      setForm({
        facebook: data.facebook,
        instagram: data.instagram,
        admin_instagram: data.admin_instagram,
        whatsapp_channel: data.whatsapp_channel,
        phone: data.phone,
      });
    }
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      if (data?.id) {
        const { error } = await supabase
          .from('contact_details')
          .update(form)
          .eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('contact_details').insert(form);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      setSaved(true);
      void queryClient.invalidateQueries({ queryKey: ['contact-details'] });
      setTimeout(() => setSaved(false), 2500);
    },
  });

  const inputClass =
    'w-full border border-ink/20 bg-paper px-3 py-2.5 font-sans text-sm font-light text-ink outline-none focus:border-ink/50';

  return (
    <div className="max-w-lg space-y-3 border border-ink/10 bg-paper p-5">
      {FIELDS.map((field) => (
        <label key={field.key} className="block">
          <span className="font-sans text-xs font-medium uppercase tracking-widest text-ink/50">
            {field.label}
          </span>
          <input
            className={`${inputClass} mt-1`}
            value={form[field.key]}
            onChange={(e) =>
              setForm((current) => ({ ...current, [field.key]: e.target.value }))
            }
          />
        </label>
      ))}
      <button
        type="button"
        onClick={() => save.mutate()}
        disabled={save.isPending}
        className="w-full bg-ink py-3 font-sans text-sm font-medium uppercase tracking-widest text-brand transition-colors hover:bg-ink/90 disabled:opacity-60"
      >
        {save.isPending ? 'Saving…' : 'Save contact details'}
      </button>
      {saved ? (
        <p className="font-sans text-xs text-green-700">Contact details updated.</p>
      ) : null}
    </div>
  );
}
