import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/hooks/useAdmin';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const { session, isAdmin, loading } = useAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'setup'>('signin');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [adminExists, setAdminExists] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.rpc('admin_exists').then(({ data }) => setAdminExists(Boolean(data)));
  }, []);

  useEffect(() => {
    if (!loading && session && isAdmin) {
      void navigate({ to: '/admin', replace: true });
    }
  }, [loading, session, isAdmin, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setBusy(true);
    try {
      if (mode === 'setup') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + '/admin' },
        });
        if (signUpError) throw signUpError;
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        const { error: claimError } = await supabase.rpc('claim_admin');
        if (claimError) throw claimError;
        setMessage('Admin account created.');
        void navigate({ to: '/admin', replace: true });
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) throw signInError;
      const { data: user } = await supabase.auth.getUser();
      const { data: roleOk } = await supabase.rpc('has_role', {
        _user_id: user.user?.id as string,
        _role: 'admin',
      });
      if (!roleOk) {
        await supabase.auth.signOut();
        throw new Error('This account does not have admin access.');
      }
      void navigate({ to: '/admin', replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed.');
    } finally {
      setBusy(false);
    }
  };

  const inputClass =
    'w-full border border-ink/20 bg-paper px-3 py-2.5 font-sans text-sm font-light text-ink outline-none focus:border-ink/50';

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand px-6 py-16">
      <div className="w-full max-w-sm border border-ink/10 bg-paper p-6">
        <h1 className="font-heading text-2xl tracking-tight text-ink">
          {mode === 'setup' ? 'Create admin account' : 'Admin sign in'}
        </h1>
        <p className="mt-2 font-sans text-xs font-light text-ink/60">
          Discovery of Coins dashboard
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <input
            className={inputClass}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className={inputClass}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error ? <p className="font-sans text-xs text-red-700">{error}</p> : null}
          {message ? <p className="font-sans text-xs text-green-700">{message}</p> : null}
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-ink py-3 font-sans text-sm font-medium uppercase tracking-widest text-brand transition-colors hover:bg-ink/90 disabled:opacity-60"
          >
            {busy ? 'Please wait…' : mode === 'setup' ? 'Create admin' : 'Sign in'}
          </button>
        </form>

        {adminExists === false ? (
          <button
            type="button"
            onClick={() => setMode(mode === 'setup' ? 'signin' : 'setup')}
            className="mt-4 w-full font-sans text-xs uppercase tracking-widest text-ink/60 underline"
          >
            {mode === 'setup' ? 'Back to sign in' : 'First time? Create the admin account'}
          </button>
        ) : null}
      </div>
    </div>
  );
}
