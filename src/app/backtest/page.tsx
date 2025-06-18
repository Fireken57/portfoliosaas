'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BacktestService } from '@/features/trading/services/backtest';
import { PerformanceChart } from '@/components/trading/PerformanceChart';
import { AllocationChart } from '@/components/trading/AllocationChart';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';

const strategies = [
  {
    id: 'moving-average-crossover',
    name: 'Moving Average Crossover',
    description: 'Buy when short MA crosses above long MA, sell when it crosses below',
    parameters: {
      shortPeriod: 20,
      longPeriod: 50,
    },
  },
  {
    id: 'rsi',
    name: 'RSI Strategy',
    description: 'Buy when RSI is oversold, sell when overbought',
    parameters: {
      period: 14,
      oversold: 30,
      overbought: 70,
    },
  },
  {
    id: 'macd',
    name: 'MACD Strategy',
    description: 'Buy when MACD line crosses above signal line, sell when it crosses below',
    parameters: {
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
    },
  },
];

export default function BacktestPage() {
  const [selectedStrategy, setSelectedStrategy] = useState(strategies[0]);
  const [initialCapital, setInitialCapital] = useState(10000);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleRunBacktest = async () => {
    setLoading(true);
    try {
      // Simuler des données historiques
      const historicalData = Array.from({ length: 252 }, (_, i) => ({
        timestamp: new Date(2023, 0, i + 1).toISOString(),
        symbol: 'AAPL',
        open: 150 + Math.random() * 10,
        high: 155 + Math.random() * 10,
        low: 145 + Math.random() * 10,
        close: 150 + Math.random() * 10,
        volume: 1000000 + Math.random() * 500000,
      }));

      const strategy = {
        name: selectedStrategy.name,
        description: selectedStrategy.description,
        parameters: Object.fromEntries(
          Object.entries(selectedStrategy.parameters).filter(([_, v]) => v !== undefined)
        ),
        entryRules: (data: any) => {
          // Implémenter la logique d'entrée basée sur la stratégie
          return Math.random() > 0.5;
        },
        exitRules: (data: any) => {
          // Implémenter la logique de sortie basée sur la stratégie
          return Math.random() > 0.5;
        },
      };

      const backtest = new BacktestService(historicalData, strategy, initialCapital);
      const results = await backtest.runBacktest();
      setResults(results);
    } catch (error) {
      console.error('Error running backtest:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Strategy Backtesting</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Strategy Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Strategy</Label>
                <Select
                  value={selectedStrategy.id}
                  onValueChange={(value) =>
                    setSelectedStrategy(strategies.find((s) => s.id === value)!)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    {strategies.map((strategy) => (
                      <SelectItem key={strategy.id} value={strategy.id}>
                        {strategy.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Initial Capital</Label>
                <Input
                  type="number"
                  value={initialCapital}
                  onChange={(e) => setInitialCapital(Number(e.target.value))}
                />
              </div>

              <Button
                onClick={handleRunBacktest}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Running...' : 'Run Backtest'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {results && (
          <Card>
            <CardHeader>
              <CardTitle>Backtest Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Total Trades</Label>
                    <p className="text-2xl font-bold">{results.metrics.totalTrades}</p>
                  </div>
                  <div>
                    <Label>Win Rate</Label>
                    <p className="text-2xl font-bold">
                      {results.metrics.winRate.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <Label>Total P&L</Label>
                    <p className="text-2xl font-bold">
                      ${results.metrics.totalPnl.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <Label>Max Drawdown</Label>
                    <p className="text-2xl font-bold">
                      {results.metrics.maxDrawdown.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {results && (
        <div className="mt-8 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Equity Curve</CardTitle>
            </CardHeader>
            <CardContent>
              <PerformanceChart
                data={results.equityCurve.map((point: any) => ({
                  date: point.date,
                  value: point.equity,
                }))}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trade History</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={results.trades} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 