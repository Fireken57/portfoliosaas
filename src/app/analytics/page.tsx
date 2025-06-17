'use client';

import { useTradingStore } from '@/features/trading/store/tradingStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PerformanceChart } from '@/components/trading/PerformanceChart';
import { AllocationChart } from '@/components/trading/AllocationChart';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function AnalyticsPage() {
  const { trades, positions } = useTradingStore();

  // Calculer les statistiques avancées
  const calculateStats = () => {
    const totalTrades = trades.length;
    const winningTrades = trades.filter(t => t.pnl > 0).length;
    const losingTrades = trades.filter(t => t.pnl < 0).length;
    const totalPnl = trades.reduce((sum, t) => sum + t.pnl, 0);
    const totalFees = trades.reduce((sum, t) => sum + t.fees, 0);
    const avgWin = trades.filter(t => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0) / winningTrades;
    const avgLoss = trades.filter(t => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0) / losingTrades;
    const profitFactor = Math.abs(
      trades.filter(t => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0) /
      trades.filter(t => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0)
    );

    return {
      totalTrades,
      winningTrades,
      losingTrades,
      winRate: (winningTrades / totalTrades) * 100,
      totalPnl,
      totalFees,
      avgWin,
      avgLoss,
      profitFactor,
    };
  };

  const stats = calculateStats();

  // Préparer les données pour les graphiques
  const performanceByMonth = trades.reduce((acc, trade) => {
    const month = new Date(trade.entryDate).toLocaleString('default', { month: 'short' });
    if (!acc[month]) {
      acc[month] = { month, pnl: 0, trades: 0 };
    }
    acc[month].pnl += trade.pnl;
    acc[month].trades += 1;
    return acc;
  }, {} as Record<string, { month: string; pnl: number; trades: number }>);

  const performanceData = Object.values(performanceByMonth).sort((a, b) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.indexOf(a.month) - months.indexOf(b.month);
  });

  // Préparer les données d'allocation
  const allocationBySector = positions.reduce((acc, position) => {
    if (!acc[position.sector]) {
      acc[position.sector] = 0;
    }
    acc[position.sector] += position.quantity * position.currentPrice;
    return acc;
  }, {} as Record<string, number>);

  const sectorAllocationData = Object.entries(allocationBySector).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.winRate.toFixed(1)}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Profit Factor</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.profitFactor.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Avg Win</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-500">
              {stats.avgWin.toLocaleString('en-US', {
                style: 'currency',
                currency: 'EUR'
              })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Avg Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-500">
              {stats.avgLoss.toLocaleString('en-US', {
                style: 'currency',
                currency: 'EUR'
              })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance by Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis
                    yAxisId="left"
                    tickFormatter={(value) => `${value}%`}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tickFormatter={(value) => value.toString()}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      name === 'pnl'
                        ? `${value.toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'EUR'
                          })}`
                        : value.toString(),
                      name === 'pnl' ? 'P&L' : 'Trades'
                    ]}
                  />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="pnl"
                    name="P&L"
                    fill="#8884d8"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="trades"
                    name="Trades"
                    fill="#82ca9d"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <AllocationChart
          title="Allocation by Sector"
          data={sectorAllocationData}
        />
      </div>

      {/* Statistiques détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Trade Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total Trades:</span>
                <span className="font-bold">{stats.totalTrades}</span>
              </div>
              <div className="flex justify-between">
                <span>Winning Trades:</span>
                <span className="font-bold text-green-500">{stats.winningTrades}</span>
              </div>
              <div className="flex justify-between">
                <span>Losing Trades:</span>
                <span className="font-bold text-red-500">{stats.losingTrades}</span>
              </div>
              <div className="flex justify-between">
                <span>Total P&L:</span>
                <span className={`font-bold ${stats.totalPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stats.totalPnl.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'EUR'
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Fees:</span>
                <span className="font-bold">
                  {stats.totalFees.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'EUR'
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Risk/Reward Ratio:</span>
                <span className="font-bold">
                  {(Math.abs(stats.avgWin / stats.avgLoss)).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Expected Value per Trade:</span>
                <span className="font-bold">
                  {(stats.totalPnl / stats.totalTrades).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'EUR'
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Average Trade Duration:</span>
                <span className="font-bold">Coming soon</span>
              </div>
              <div className="flex justify-between">
                <span>Max Consecutive Wins:</span>
                <span className="font-bold">Coming soon</span>
              </div>
              <div className="flex justify-between">
                <span>Max Consecutive Losses:</span>
                <span className="font-bold">Coming soon</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 