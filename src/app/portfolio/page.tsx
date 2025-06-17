'use client';

import { useState } from 'react';
import { useTradingStore } from '@/features/trading/store/tradingStore';
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

export default function PortfolioPage() {
  const { positions, selectedPlatform, selectedSector, setPlatform, setSector } = useTradingStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Filtres pour les plateformes et secteurs uniques
  const platforms = Array.from(new Set(positions.map(p => p.platform)));
  const sectors = Array.from(new Set(positions.map(p => p.sector)));

  // Filtrer les positions
  const filteredPositions = positions.filter(position => {
    const matchesSearch = position.asset.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = selectedPlatform === 'all' || position.platform === selectedPlatform;
    const matchesSector = selectedSector === 'all' || position.sector === selectedSector;
    return matchesSearch && matchesPlatform && matchesSector;
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Portfolio</h1>

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
        }}>
          Reset Filters
        </Button>
      </div>

      {/* Tableau des positions */}
      <Card>
        <CardHeader>
          <CardTitle>Open Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Avg Price</TableHead>
                <TableHead>Current Price</TableHead>
                <TableHead>P&L</TableHead>
                <TableHead>P&L %</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead>Strategy</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPositions.map((position) => (
                <TableRow key={position.id}>
                  <TableCell>{position.asset}</TableCell>
                  <TableCell>{position.platform}</TableCell>
                  <TableCell>{position.quantity}</TableCell>
                  <TableCell>
                    {position.averagePrice.toLocaleString('en-US', {
                      style: 'currency',
                      currency: position.currency
                    })}
                  </TableCell>
                  <TableCell>
                    {position.currentPrice.toLocaleString('en-US', {
                      style: 'currency',
                      currency: position.currency
                    })}
                  </TableCell>
                  <TableCell className={position.pnl >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {position.pnl.toLocaleString('en-US', {
                      style: 'currency',
                      currency: position.currency
                    })}
                  </TableCell>
                  <TableCell className={position.pnl >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {((position.pnl / (position.averagePrice * position.quantity)) * 100).toFixed(2)}%
                  </TableCell>
                  <TableCell>{position.sector}</TableCell>
                  <TableCell>{position.strategy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 