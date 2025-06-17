'use client';

import { useState } from 'react';
import { useTradingStore } from '@/features/trading/store/tradingStore';
import { Trade } from '@/features/trading/types/index';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';

export default function TradesPage() {
  const { trades, selectedPlatform, selectedSector, setPlatform, setSector } = useTradingStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Filtres pour les plateformes et secteurs uniques
  const platforms = Array.from(new Set(trades.map(t => t.platform)));
  const sectors = Array.from(new Set(trades.map(t => t.sector)));

  // Filtrer les trades
  const filteredTrades = trades.filter(trade => {
    const matchesSearch = trade.asset.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = selectedPlatform === 'all' || trade.platform === selectedPlatform;
    const matchesSector = selectedSector === 'all' || trade.sector === selectedSector;
    const matchesDate = (!startDate || new Date(trade.entryDate) >= startDate) &&
                       (!endDate || new Date(trade.entryDate) <= endDate);
    return matchesSearch && matchesPlatform && matchesSector && matchesDate;
  });

  // Calculer les statistiques
  const totalPnl = filteredTrades.reduce((sum, trade) => sum + trade.pnl, 0);
  const totalFees = filteredTrades.reduce((sum, trade) => sum + trade.fees, 0);
  const winningTrades = filteredTrades.filter(trade => trade.pnl > 0).length;
  const losingTrades = filteredTrades.filter(trade => trade.pnl < 0).length;
  const winRate = (winningTrades / filteredTrades.length) * 100;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Trades History</h1>

      {/* Filtres */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Input
          placeholder="Search assets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Select value={selectedPlatform || 'all'} onValueChange={setPlatform}>
          <SelectTrigger>
            <SelectValue placeholder="Select Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            {platforms.map(platform => (
              <SelectItem key={platform} value={platform}>
                {platform}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedSector || 'all'} onValueChange={setSector}>
          <SelectTrigger>
            <SelectValue placeholder="Select Sector" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sectors</SelectItem>
            {sectors.map(sector => (
              <SelectItem key={sector} value={sector}>
                {sector}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={() => {
          setPlatform(null);
          setSector(null);
          setSearchQuery('');
          setStartDate(null);
          setEndDate(null);
        }}>
          Reset Filters
        </Button>
      </div>

      {/* Date Range Picker */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <DatePicker
          selected={startDate}
          onSelect={setStartDate}
          placeholder="Start Date"
        />
        <DatePicker
          selected={endDate}
          onSelect={setEndDate}
          placeholder="End Date"
        />
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total P&L</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${totalPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {totalPnl.toLocaleString('en-US', {
                style: 'currency',
                currency: 'EUR'
              })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Fees</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {totalFees.toLocaleString('en-US', {
                style: 'currency',
                currency: 'EUR'
              })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {winRate.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {filteredTrades.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des trades */}
      <Card>
        <CardHeader>
          <CardTitle>Trade History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Entry Price</TableHead>
                <TableHead>Exit Price</TableHead>
                <TableHead>P&L</TableHead>
                <TableHead>Fees</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead>Strategy</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrades.map((trade) => (
                <TableRow key={trade.id}>
                  <TableCell>{new Date(trade.entryDate).toLocaleDateString()}</TableCell>
                  <TableCell>{trade.asset}</TableCell>
                  <TableCell>{trade.platform}</TableCell>
                  <TableCell>{trade.type}</TableCell>
                  <TableCell>{trade.quantity}</TableCell>
                  <TableCell>
                    {trade.entryPrice.toLocaleString('en-US', {
                      style: 'currency',
                      currency: trade.currency
                    })}
                  </TableCell>
                  <TableCell>
                    {trade.exitPrice?.toLocaleString('en-US', {
                      style: 'currency',
                      currency: trade.currency
                    })}
                  </TableCell>
                  <TableCell className={trade.pnl >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {trade.pnl.toLocaleString('en-US', {
                      style: 'currency',
                      currency: trade.currency
                    })}
                  </TableCell>
                  <TableCell>
                    {trade.fees.toLocaleString('en-US', {
                      style: 'currency',
                      currency: trade.currency
                    })}
                  </TableCell>
                  <TableCell>{trade.sector}</TableCell>
                  <TableCell>{trade.strategy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 