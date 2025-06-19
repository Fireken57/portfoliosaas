'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert as AlertComponent } from '@/components/ui/alert';
import { Alert, MarketData } from '@/features/trading/types';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { Chart } from '@/components/trading/Chart';
import { Plus, Bell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default function AlertsPage() {
  const router = useRouter();
  const { session, status, isClient } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    symbol: '',
    type: 'PRICE' as 'PRICE' | 'VOLUME' | 'TECHNICAL',
    condition: 'ABOVE' as 'ABOVE' | 'BELOW' | 'EQUALS',
    value: '',
    message: '',
  });
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [services, setServices] = useState<{
    alertService: any;
    marketService: any;
  } | null>(null);

  useEffect(() => {
    // Dynamically import services to avoid build issues
    const loadServices = async () => {
      try {
        const { AlertService } = await import('@/features/trading/services/alerts');
        const { MarketService } = await import('@/features/trading/services/market');
        
        setServices({
          alertService: new AlertService(),
          marketService: new MarketService(),
        });
      } catch (error) {
        console.error('Error loading services:', error);
        setError('Failed to load services');
      }
    };

    loadServices();
  }, []);

  useEffect(() => {
    if (services && isClient && status !== 'loading') {
      loadAlerts();
      const unsubscribe = services.alertService.subscribe((alert: Alert) => {
        setAlerts((prev) => [alert, ...prev]);
      });

      return () => {
        unsubscribe();
        services.alertService.stopCheckingAlerts();
      };
    }
  }, [services, isClient, status]);

  useEffect(() => {
    if (selectedSymbol && services) {
      loadMarketData(selectedSymbol);
    }
  }, [selectedSymbol, services]);

  const loadAlerts = async () => {
    if (!services) return;
    
    try {
      setLoading(true);
      const data = await services.alertService.getAlerts();
      setAlerts(data);
      setError(null);
    } catch (err) {
      setError('Failed to load alerts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMarketData = async (symbol: string) => {
    if (!services) return;
    
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 30); // Get last 30 days of data
      
      const data = await services.marketService.getHistoricalData(symbol, startDate, endDate);
      setMarketData(data);
    } catch (err) {
      console.error('Error loading market data:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id || !services) {
      setError('User not authenticated or services not loaded');
      return;
    }
    
    try {
      const newAlert = await services.alertService.createAlert({
        ...formData,
        value: parseFloat(formData.value),
        userId: session.user.id,
      });
      setAlerts((prev) => [newAlert, ...prev]);
      setShowForm(false);
      setFormData({
        symbol: '',
        type: 'PRICE',
        condition: 'ABOVE',
        value: '',
        message: '',
      });
    } catch (err) {
      setError('Failed to create alert');
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!services) return;
    
    try {
      await services.alertService.deleteAlert(id);
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    } catch (err) {
      setError('Failed to delete alert');
      console.error(err);
    }
  };

  const handleSymbolClick = (symbol: string) => {
    setSelectedSymbol(symbol);
  };

  // Show loading state while not on client or session is loading
  if (!isClient || status === 'loading') {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state while services are loading
  if (!services) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>Loading services...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Alerts</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          New Alert
        </Button>
      </div>

      {error && (
        <AlertComponent variant="destructive" className="mb-4">
          {error}
        </AlertComponent>
      )}

      {showForm && (
        <Card className="p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="symbol">Symbol</Label>
                <Input
                  id="symbol"
                  value={formData.symbol}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, symbol: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      type: e.target.value as 'PRICE' | 'VOLUME' | 'TECHNICAL',
                    }))
                  }
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="PRICE">Price</option>
                  <option value="VOLUME">Volume</option>
                  <option value="TECHNICAL">Technical</option>
                </select>
              </div>
              <div>
                <Label htmlFor="condition">Condition</Label>
                <select
                  id="condition"
                  value={formData.condition}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      condition: e.target.value as 'ABOVE' | 'BELOW' | 'EQUALS',
                    }))
                  }
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="ABOVE">Above</option>
                  <option value="BELOW">Below</option>
                  <option value="EQUALS">Equals</option>
                </select>
              </div>
              <div>
                <Label htmlFor="value">Value</Label>
                <Input
                  id="value"
                  type="number"
                  step="0.01"
                  value={formData.value}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, value: e.target.value }))
                  }
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="message">Message (optional)</Label>
              <Input
                id="message"
                value={formData.message}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, message: e.target.value }))
                }
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Alert</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <DataTable
            columns={columns({ onDelete: handleDelete, onSymbolClick: handleSymbolClick })}
            data={alerts}
            loading={loading}
            onDelete={handleDelete}
            onSymbolClick={handleSymbolClick}
          />
        </Card>

        {selectedSymbol && (
          <div className="space-y-4">
            <Chart
              data={marketData}
              symbol={selectedSymbol}
              height={400}
            />
          </div>
        )}
      </div>
    </div>
  );
} 