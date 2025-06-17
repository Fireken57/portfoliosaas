'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SnapTradeService } from '@/features/trading/services/snaptrade';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function BrokersPage() {
  const [email, setEmail] = useState('');
  const [connections, setConnections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const snapTradeService = new SnapTradeService();

  const handleRegister = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Starting registration process...');
      const response = await snapTradeService.registerUser(email);
      console.log('Registration response:', response);
      
      toast({
        title: "Inscription réussie",
        description: "Votre compte SnapTrade a été créé avec succès.",
      });

      if (response.redirectURI) {
        console.log('Redirecting to:', response.redirectURI);
        window.location.href = response.redirectURI;
      } else {
        console.error('No redirect URI in response:', response);
        setError("Pas d'URL de redirection reçue de SnapTrade");
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.message || "Une erreur est survenue lors de l'inscription";
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadConnections = async () => {
    try {
      const data = await snapTradeService.getConnections();
      setConnections(data);
    } catch (error: any) {
      console.error('Error loading connections:', error);
      setError(error.message || "Erreur lors du chargement des connexions");
    }
  };

  useEffect(() => {
    loadConnections();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Connexion aux Brokers</h1>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Connecter un nouveau broker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entrez votre email"
                disabled={isLoading}
              />
            </div>
            <Button 
              onClick={handleRegister}
              disabled={isLoading || !email}
            >
              {isLoading ? "Connexion en cours..." : "Connecter un broker"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Brokers connectés</CardTitle>
        </CardHeader>
        <CardContent>
          {connections.length === 0 ? (
            <p className="text-muted-foreground">Aucun broker connecté</p>
          ) : (
            <div className="space-y-4">
              {connections.map((connection: any) => (
                <div key={connection.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{connection.broker}</h3>
                    <p className="text-sm text-muted-foreground">{connection.accountNumber}</p>
                  </div>
                  <Button variant="destructive" size="sm">
                    Déconnecter
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 