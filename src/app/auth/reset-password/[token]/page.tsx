'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import type { PageProps } from 'next';

export default function Page({ params }: any) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await fetch(`/api/auth/validate-reset-token?token=${params.token}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        setTokenValid(true);
      } catch (err) {
        setTokenValid(false);
        setError(err instanceof Error ? err.message : 'Token invalide ou expiré');
      }
    };

    validateToken();
  }, [params.token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: params.token,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      toast({
        title: 'Mot de passe mis à jour',
        description: 'Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.',
      });

      router.push('/auth/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (tokenValid === null) {
    return (
      <div className="container max-w-md mx-auto py-12">
        <Card className="p-6">
          <p>Vérification du token...</p>
        </Card>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="container max-w-md mx-auto py-12">
        <Card className="p-6">
          <Alert variant="destructive">
            {error || 'Token invalide ou expiré'}
          </Alert>
          <Button
            className="mt-4"
            onClick={() => router.push('/auth/reset-password')}
          >
            Demander un nouveau lien
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto py-12">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Définir un nouveau mot de passe</h1>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="password">Nouveau mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
          </Button>
        </form>
      </Card>
    </div>
  );
} 