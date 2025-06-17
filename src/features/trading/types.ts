export interface Trade {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  timestamp: Date;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
}

export interface Position {
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
}

export interface Portfolio {
  id: string;
  name: string;
  positions: Position[];
  totalValue: number;
  cashBalance: number;
  totalPnL: number;
  totalPnLPercent: number;
}

export interface MarketData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  averageVolume?: number;
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  type: 'TREND' | 'MEAN_REVERSION' | 'BREAKOUT' | 'CUSTOM';
  parameters: Record<string, number>;
  entryRules: (data: any) => boolean;
  exitRules: (data: any) => boolean;
  performance: {
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    winRate: number;
    profitFactor: number;
    totalPnl: number;
    maxDrawdown: number;
    sharpeRatio: number;
  };
}

export type AlertType = 'PRICE' | 'VOLUME' | 'TECHNICAL';
export type AlertCondition = 'ABOVE' | 'BELOW' | 'EQUALS';

export interface Alert {
  id: string;
  userId: string;
  symbol: string;
  type: AlertType;
  condition: AlertCondition;
  value: number;
  message?: string;
  triggered: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  type: Alert['type'];
  condition: string;
  value: number;
  enabled: boolean;
  asset: string;
}

export interface BacktestResult {
  id: string;
  strategy: string;
  startDate: Date;
  endDate: Date;
  initialCapital: number;
  finalCapital: number;
  totalReturn: number;
  totalReturnPercent: number;
  trades: Trade[];
  metrics: {
    winRate: number;
    profitFactor: number;
    maxDrawdown: number;
    sharpeRatio: number;
  };
}

export interface CreateAlertInput {
  symbol: string;
  type: AlertType;
  condition: AlertCondition;
  value: number;
  message?: string;
} 