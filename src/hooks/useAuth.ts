import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password });
  const logout = () => supabase.auth.signOut();

  return { user, loading, login, logout };
} 