'use client';

import { useEffect, useState } from 'react';
import { Search, TrendingUp, TrendingDown, Activity, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/ui/data-table';
import { PerformanceChart } from '@/components/trading/PerformanceChart';
import { MarketService } from '@/features/trading/services/market';
import { MarketData } from '@/features/trading/types/index';
import { columns } from './columns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Spinner } from '@/components/ui/spinner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Disable static generation for this page
export const dynamic = 'force-dynamic';

const marketService = new MarketService();

export default function MarketPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeframe, setTimeframe] = useState('1D');
  const [marketOverview, setMarketOverview] = useState({
    gainers: [] as MarketData[],
    losers: [] as MarketData[],
    mostActive: [] as MarketData[],
  });

  useEffect(() => {
    loadMarketData();
    loadMarketOverview();
    const unsubscribe = marketService.subscribe((data) => {
      if (selectedSymbol && data.symbol === selectedSymbol) {
        setMarketData((prev) => [...prev, data]);
      }
      loadMarketOverview();
    });

    return () => {
      unsubscribe();
    };
  }, [selectedSymbol]);

  const loadMarketData = async () => {
    if (!selectedSymbol) return;
    setIsLoading(true);
    try {
      const data = await marketService.getMarketData(selectedSymbol);
      setMarketData(data);
    } catch (error) {
      console.error('Error loading market data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMarketOverview = async () => {
    try {
      const overview = await marketService.getMarketOverview();
      setMarketOverview(overview);
    } catch (error) {
      console.error('Error loading market overview:', error);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      const results = await marketService.searchSymbols(query);
      if (results.length > 0) {
        setSelectedSymbol(results[0]);
      }
    }
  };

  const handleSymbolSelect = (symbol: string) => {
    setSelectedSymbol(symbol);
    setSearchQuery('');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatChange = (change: number) => {
    const formatted = new Intl.NumberFormat('en-US', {
      signDisplay: 'always',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(change);
    return `${formatted}%`;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Market Data</h1>
        <div className="flex items-center gap-4">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1D">1 Day</SelectItem>
              <SelectItem value="1W">1 Week</SelectItem>
              <SelectItem value="1M">1 Month</SelectItem>
              <SelectItem value="3M">3 Months</SelectItem>
              <SelectItem value="1Y">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search symbols..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 w-[300px]"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Gainers</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {marketOverview.gainers.map((stock) => (
                <TooltipProvider key={stock.symbol}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="flex items-center justify-between cursor-pointer hover:bg-accent p-2 rounded-md"
                        onClick={() => handleSymbolSelect(stock.symbol)}
                      >
                        <div>
                          <p className="font-medium">{stock.symbol}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatPrice(stock.price)}
                          </p>
                        </div>
                        <p className="text-green-500">{formatChange(stock.changePercent)}</p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click to view details</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Losers</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {marketOverview.losers.map((stock) => (
                <TooltipProvider key={stock.symbol}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="flex items-center justify-between cursor-pointer hover:bg-accent p-2 rounded-md"
                        onClick={() => handleSymbolSelect(stock.symbol)}
                      >
                        <div>
                          <p className="font-medium">{stock.symbol}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatPrice(stock.price)}
                          </p>
                        </div>
                        <p className="text-red-500">{formatChange(stock.changePercent)}</p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click to view details</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Active</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {marketOverview.mostActive.map((stock) => (
                <TooltipProvider key={stock.symbol}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="flex items-center justify-between cursor-pointer hover:bg-accent p-2 rounded-md"
                        onClick={() => handleSymbolSelect(stock.symbol)}
                      >
                        <div>
                          <p className="font-medium">{stock.symbol}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatPrice(stock.price)}
                          </p>
                        </div>
                        <p className={stock.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}>
                          {formatChange(stock.changePercent)}
                        </p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click to view details</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedSymbol && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">{selectedSymbol}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {marketData[0]?.timestamp.toLocaleTimeString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold">
                    {formatPrice(marketData[0]?.price || 0)}
                  </p>
                  <p
                    className={
                      marketData[0]?.changePercent >= 0
                        ? 'text-green-500'
                        : 'text-red-500'
                    }
                  >
                    {formatChange(marketData[0]?.changePercent || 0)}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 hover:bg-accent rounded-md">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Add to Watchlist</DropdownMenuItem>
                    <DropdownMenuItem>Set Price Alert</DropdownMenuItem>
                    <DropdownMenuItem>View Company Info</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-[400px]">
                  <Spinner size="lg" />
                </div>
              ) : (
                <PerformanceChart 
                  data={marketData.map(d => ({
                    date: d.timestamp,
                    value: d.price
                  }))} 
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Market Data</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={marketData} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 