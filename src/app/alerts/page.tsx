'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert as AlertComponent } from '@/components/ui/alert';
import { Alert, MarketData } from '@/features/trading/types';
import { DataTable } from '@/components/ui/data-table';
import { Chart } from '@/components/trading/Chart';
import { Plus, Bell, Trash2 } from 'lucide-react';
import { ClientOnly } from '@/components/ClientOnly';
import { ColumnDef } from '@tanstack/react-table';

// Disable static generation for this page
export const dynamic = 'force-dynamic';

function AlertsContent() {
  const router = useRouter();
  const { data: session, status } = useSession();
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

  const columns: ColumnDef<Alert>[] = [
    {
      accessorKey: 'symbol',
      header: 'Symbol',
      cell: ({ row }) => (
        <Button
          variant="link"
          onClick={() => handleSymbolClick(row.original.symbol)}
          className="p-0 h-auto font-medium"
        >
          {row.original.symbol}
        </Button>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const type = row.getValue('type') as string;
        return (
          <span
            className={`px-2 py-1 rounded text-sm ${
              type === 'PRICE'
                ? 'bg-blue-100 text-blue-800'
                : type === 'VOLUME'
                ? 'bg-green-100 text-green-800'
                : 'bg-purple-100 text-purple-800'
            }`}
          >
            {type}
          </span>
        );
      },
    },
    {
      accessorKey: 'condition',
      header: 'Condition',
      cell: ({ row }) => {
        const condition = row.getValue('condition') as string;
        const value = row.getValue('value') as number;
        return `${condition} ${value}`;
      },
    },
    {
      accessorKey: 'value',
      header: 'Value',
      cell: ({ row }) => row.original.value.toFixed(2),
    },
    {
      accessorKey: 'message',
      header: 'Message',
    },
    {
      accessorKey: 'triggered',
      header: 'Status',
      cell: ({ row }) => {
        const triggered = row.getValue('triggered') as boolean;
        return (
          <span
            className={`px-2 py-1 rounded text-sm ${
              triggered
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {triggered ? 'Triggered' : 'Active'}
          </span>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => {
        const date = row.getValue('createdAt') as Date;
        return new Date(date).toLocaleString();
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleDelete(row.original.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ];

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
    if (services && status !== 'loading') {
      loadAlerts();
      const unsubscribe = services.alertService.subscribe((alert: Alert) => {
        setAlerts((prev) => [alert, ...prev]);
      });

      return () => {
        unsubscribe();
        services.alertService.stopCheckingAlerts();
      };
    }
  }, [services, status]);

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

  // Show loading state while session is loading
  if (status === 'loading') {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>Loading session...</p>
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
              <Label htmlFor="message">Message (Optional)</Label>
              <Input
                id="message"
                value={formData.message}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, message: e.target.value }))
                }
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit">Create Alert</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>Loading alerts...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Active Alerts</h2>
              <DataTable columns={columns} data={alerts} />
            </Card>

            {selectedSymbol && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {selectedSymbol} Price Chart
                </h2>
                <Chart data={marketData} symbol={selectedSymbol} />
              </Card>
            )}
          </div>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Market Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {alerts.slice(0, 6).map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSymbolClick(alert.symbol)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{alert.symbol}</h3>
                      <p className="text-sm text-gray-600">
                        {alert.type} {alert.condition} {alert.value}
                      </p>
                    </div>
                    <Bell className="w-4 h-4 text-yellow-500" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function AlertsPage() {
  return (
    <ClientOnly
      fallback={
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p>Loading...</p>
            </div>
          </div>
        </div>
      }
    >
      <AlertsContent />
    </ClientOnly>
  );
} 