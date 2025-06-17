import { Strategy, Trade, MarketData } from '../types';

export class StrategyService {
  private strategies: Strategy[] = [];

  constructor() {
    // Initialiser avec des stratégies par défaut
    this.strategies = [
      {
        id: 'moving-average-crossover',
        name: 'Moving Average Crossover',
        description: 'Buy when short MA crosses above long MA, sell when it crosses below',
        type: 'TREND',
        parameters: {
          shortPeriod: 20,
          longPeriod: 50,
        },
        entryRules: (data: MarketData[]) => {
          if (data.length < 50) return false;
          const shortMA = this.calculateMA(data, 20);
          const longMA = this.calculateMA(data, 50);
          return shortMA[shortMA.length - 1] > longMA[longMA.length - 1] &&
            shortMA[shortMA.length - 2] <= longMA[longMA.length - 2];
        },
        exitRules: (data: MarketData[]) => {
          if (data.length < 50) return false;
          const shortMA = this.calculateMA(data, 20);
          const longMA = this.calculateMA(data, 50);
          return shortMA[shortMA.length - 1] < longMA[longMA.length - 1] &&
            shortMA[shortMA.length - 2] >= longMA[longMA.length - 2];
        },
        performance: {
          totalTrades: 0,
          winningTrades: 0,
          losingTrades: 0,
          winRate: 0,
          profitFactor: 0,
          totalPnl: 0,
          maxDrawdown: 0,
          sharpeRatio: 0,
        },
      },
      {
        id: 'rsi',
        name: 'RSI Strategy',
        description: 'Buy when RSI is oversold, sell when overbought',
        type: 'MEAN_REVERSION',
        parameters: {
          period: 14,
          oversold: 30,
          overbought: 70,
        },
        entryRules: (data: MarketData[]) => {
          if (data.length < 14) return false;
          const rsi = this.calculateRSI(data, 14);
          return rsi[rsi.length - 1] < 30;
        },
        exitRules: (data: MarketData[]) => {
          if (data.length < 14) return false;
          const rsi = this.calculateRSI(data, 14);
          return rsi[rsi.length - 1] > 70;
        },
        performance: {
          totalTrades: 0,
          winningTrades: 0,
          losingTrades: 0,
          winRate: 0,
          profitFactor: 0,
          totalPnl: 0,
          maxDrawdown: 0,
          sharpeRatio: 0,
        },
      },
      {
        id: 'macd',
        name: 'MACD Strategy',
        description: 'Buy when MACD line crosses above signal line, sell when it crosses below',
        type: 'TREND',
        parameters: {
          fastPeriod: 12,
          slowPeriod: 26,
          signalPeriod: 9,
        },
        entryRules: (data: MarketData[]) => {
          if (data.length < 26) return false;
          const { macd, signal } = this.calculateMACD(data);
          return macd[macd.length - 1] > signal[signal.length - 1] &&
            macd[macd.length - 2] <= signal[signal.length - 2];
        },
        exitRules: (data: MarketData[]) => {
          if (data.length < 26) return false;
          const { macd, signal } = this.calculateMACD(data);
          return macd[macd.length - 1] < signal[signal.length - 1] &&
            macd[macd.length - 2] >= signal[signal.length - 2];
        },
        performance: {
          totalTrades: 0,
          winningTrades: 0,
          losingTrades: 0,
          winRate: 0,
          profitFactor: 0,
          totalPnl: 0,
          maxDrawdown: 0,
          sharpeRatio: 0,
        },
      },
    ];
  }

  getStrategies(): Strategy[] {
    return this.strategies;
  }

  getStrategy(id: string): Strategy | undefined {
    return this.strategies.find((s) => s.id === id);
  }

  addStrategy(strategy: Strategy): void {
    this.strategies.push(strategy);
  }

  updateStrategy(id: string, updates: Partial<Strategy>): void {
    this.strategies = this.strategies.map((strategy) =>
      strategy.id === id ? { ...strategy, ...updates } : strategy
    );
  }

  deleteStrategy(id: string): void {
    this.strategies = this.strategies.filter((s) => s.id !== id);
  }

  updatePerformance(id: string, trades: Trade[]): void {
    const strategy = this.getStrategy(id);
    if (!strategy) return;

    const winningTrades = trades.filter((t) => t.pnl > 0);
    const losingTrades = trades.filter((t) => t.pnl < 0);
    const totalPnl = trades.reduce((sum, t) => sum + t.pnl, 0);
    const totalWins = winningTrades.reduce((sum, t) => sum + t.pnl, 0);
    const totalLosses = Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0));

    // Calculer le drawdown maximum
    let maxDrawdown = 0;
    let peak = 0;
    let currentValue = 0;

    trades.forEach((trade) => {
      currentValue += trade.pnl;
      if (currentValue > peak) {
        peak = currentValue;
      }
      const drawdown = (peak - currentValue) / peak;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    });

    // Calculer le ratio de Sharpe
    const returns = trades.map((t) => t.pnl);
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const stdDev = Math.sqrt(
      returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
    );
    const sharpeRatio = avgReturn / stdDev;

    strategy.performance = {
      totalTrades: trades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      winRate: (winningTrades.length / trades.length) * 100,
      profitFactor: totalLosses === 0 ? 0 : totalWins / totalLosses,
      totalPnl,
      maxDrawdown: maxDrawdown * 100,
      sharpeRatio,
    };
  }

  private calculateMA(data: MarketData[], period: number): number[] {
    const prices = data.map((d) => d.price);
    const ma: number[] = [];
    for (let i = period - 1; i < prices.length; i++) {
      const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      ma.push(sum / period);
    }
    return ma;
  }

  private calculateRSI(data: MarketData[], period: number): number[] {
    const prices = data.map((d) => d.price);
    const changes = prices.slice(1).map((price, i) => price - prices[i]);
    const gains = changes.map((change) => (change > 0 ? change : 0));
    const losses = changes.map((change) => (change < 0 ? -change : 0));

    const avgGain = this.calculateEMA(gains, period);
    const avgLoss = this.calculateEMA(losses, period);

    return avgGain.map((gain, i) => {
      const loss = avgLoss[i];
      if (loss === 0) return 100;
      const rs = gain / loss;
      return 100 - 100 / (1 + rs);
    });
  }

  private calculateEMA(data: number[], period: number): number[] {
    const k = 2 / (period + 1);
    const ema: number[] = [data[0]];
    for (let i = 1; i < data.length; i++) {
      ema.push(data[i] * k + ema[i - 1] * (1 - k));
    }
    return ema;
  }

  private calculateMACD(data: MarketData[]): {
    macd: number[];
    signal: number[];
  } {
    const prices = data.map((d) => d.price);
    const fastEMA = this.calculateEMA(prices, 12);
    const slowEMA = this.calculateEMA(prices, 26);
    const macd = fastEMA.map((fast, i) => fast - slowEMA[i]);
    const signal = this.calculateEMA(macd, 9);
    return { macd, signal };
  }
} 