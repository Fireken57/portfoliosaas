'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export default function VerifyEmailPage() {
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setError('Token de vérification manquant');
        setVerifying(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        toast({
          title: 'Email vérifié',
          description: 'Votre email a été vérifié avec succès.',
        });

        router.push('/auth/login');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors de la vérification');
      } finally {
        setVerifying(false);
      }
    };

    verifyEmail();
  }, [searchParams, router, toast]);

  return (
    <div className="container max-w-md mx-auto py-12">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Vérification de l'email</h1>

        {verifying ? (
          <p>Vérification en cours...</p>
        ) : error ? (
          <>
            <Alert variant="destructive" className="mb-4">
              {error}
            </Alert>
            <Button onClick={() => router.push('/auth/login')}>
              Retour à la connexion
            </Button>
          </>
        ) : null}
      </Card>
    </div>
  );
} 