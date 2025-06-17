export interface Trade {
  id: string;
  asset: string;
  platform: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  entryPrice: number;
  exitPrice?: number;
  pnl: number;
  fees: number;
  currency: string;
  sector: string;
  region: string;
  strategy: string;
  comments?: string;
  entryDate: Date;
  exitDate?: Date;
  status: 'OPEN' | 'CLOSED';
}

export interface Position {
  id: string;
  asset: string;
  platform: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  pnl: number;
  currency: string;
  sector: string;
  region: string;
  strategy: string;
  stopLoss?: number;
  takeProfit?: number;
  comments?: string;
}

export interface PortfolioMetrics {
  totalPnl: number;
  ytdPerformance: number;
  maxDrawdown: number;
  exposure: number;
  allocationBySector: Record<string, number>;
  allocationByPlatform: Record<string, number>;
  allocationByRegion: Record<string, number>;
}

export interface Alert {
  id: string;
  type: 'PRICE' | 'VOLUME' | 'TECHNICAL';
  symbol: string;
  condition: 'ABOVE' | 'BELOW' | 'EQUALS';
  value: number;
  message?: string;
  triggered: boolean;
  triggeredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface AISuggestion {
  id: string;
  type: 'ALLOCATION' | 'RISK' | 'OPPORTUNITY';
  title: string;
  description: string;
  confidence: number;
  date: Date;
}

export interface MarketData {
  symbol: string;
  timestamp: Date;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  close: number;
  time: string;
} 