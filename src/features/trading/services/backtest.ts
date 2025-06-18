import type { Trade } from '../types/index';

interface BacktestStrategy {
  name: string;
  description: string;
  parameters: Record<string, number>;
  entryRules: (data: any) => boolean;
  exitRules: (data: any) => boolean;
}

interface BacktestResult {
  trades: Trade[];
  metrics: {
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    winRate: number;
    profitFactor: number;
    totalPnl: number;
    maxDrawdown: number;
    sharpeRatio: number;
    averageWin: number;
    averageLoss: number;
    largestWin: number;
    largestLoss: number;
    averageHoldingPeriod: number;
  };
  equityCurve: Array<{
    date: Date;
    equity: number;
    drawdown: number;
  }>;
}

export class BacktestService {
  private historicalData: any[];
  private strategy: BacktestStrategy;
  private initialCapital: number;

  constructor(
    historicalData: any[],
    strategy: BacktestStrategy,
    initialCapital: number
  ) {
    this.historicalData = historicalData;
    this.strategy = strategy;
    this.initialCapital = initialCapital;
  }

  async runBacktest(): Promise<BacktestResult> {
    const trades: Trade[] = [];
    let currentPosition: Trade | null = null;
    let equity = this.initialCapital;
    const equityCurve: BacktestResult['equityCurve'] = [];
    let maxEquity = this.initialCapital;
    let maxDrawdown = 0;

    for (let i = 0; i < this.historicalData.length; i++) {
      const data = this.historicalData[i];
      const date = new Date(data.timestamp);

      // Vérifier les règles de sortie si nous avons une position ouverte
      if (currentPosition && this.strategy.exitRules(data)) {
        const exitPrice = data.close;
        const pnl = (exitPrice - currentPosition.entryPrice) * currentPosition.quantity;
        const fees = this.calculateFees(currentPosition.quantity, exitPrice);

        currentPosition.exitPrice = exitPrice;
        currentPosition.pnl = pnl - fees;
        currentPosition.fees = fees;
        currentPosition.exitDate = date;
        currentPosition.status = 'CLOSED';

        trades.push(currentPosition);
        equity += pnl - fees;
        currentPosition = null;
      }

      // Vérifier les règles d'entrée si nous n'avons pas de position
      if (!currentPosition && this.strategy.entryRules(data)) {
        const entryPrice = data.close;
        const quantity = this.calculatePositionSize(equity, entryPrice);

        currentPosition = {
          id: `trade-${trades.length + 1}`,
          asset: data.symbol,
          platform: 'BACKTEST',
          type: 'BUY',
          quantity,
          entryPrice,
          pnl: 0,
          fees: this.calculateFees(quantity, entryPrice),
          currency: 'EUR',
          sector: data.sector || 'Unknown',
          region: data.region || 'Unknown',
          strategy: this.strategy.name,
          entryDate: date,
          status: 'OPEN',
        };
      }

      // Mettre à jour la courbe d'équité
      if (currentPosition) {
        const currentPnl = (data.close - currentPosition.entryPrice) * currentPosition.quantity;
        const currentEquity = equity + currentPnl;
        maxEquity = Math.max(maxEquity, currentEquity);
        const drawdown = (maxEquity - currentEquity) / maxEquity;
        maxDrawdown = Math.max(maxDrawdown, drawdown);

        equityCurve.push({
          date,
          equity: currentEquity,
          drawdown,
        });
      } else {
        equityCurve.push({
          date,
          equity,
          drawdown: (maxEquity - equity) / maxEquity,
        });
      }
    }

    // Calculer les métriques
    const metrics = this.calculateMetrics(trades, equityCurve);

    return {
      trades,
      metrics,
      equityCurve,
    };
  }

  private calculatePositionSize(equity: number, price: number): number {
    // Utiliser 2% du capital par trade
    const riskAmount = equity * 0.02;
    return Math.floor(riskAmount / price);
  }

  private calculateFees(quantity: number, price: number): number {
    // Simuler des frais de 0.1% par trade
    return quantity * price * 0.001;
  }

  private calculateMetrics(
    trades: Trade[],
    equityCurve: BacktestResult['equityCurve']
  ): BacktestResult['metrics'] {
    const winningTrades = trades.filter(t => t.pnl > 0);
    const losingTrades = trades.filter(t => t.pnl < 0);
    const totalPnl = trades.reduce((sum, t) => sum + t.pnl, 0);
    const totalWins = winningTrades.reduce((sum, t) => sum + t.pnl, 0);
    const totalLosses = Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0));

    // Calculer le ratio de Sharpe
    const returns = equityCurve.map((point, i) => {
      if (i === 0) return 0;
      return (point.equity - equityCurve[i - 1].equity) / equityCurve[i - 1].equity;
    });
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const stdDev = Math.sqrt(
      returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
    );
    const sharpeRatio = avgReturn / stdDev;

    return {
      totalTrades: trades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      winRate: (winningTrades.length / trades.length) * 100,
      profitFactor: totalLosses === 0 ? 0 : totalWins / totalLosses,
      totalPnl,
      maxDrawdown: Math.max(...equityCurve.map(p => p.drawdown)) * 100,
      sharpeRatio,
      averageWin: winningTrades.length === 0 ? 0 : totalWins / winningTrades.length,
      averageLoss: losingTrades.length === 0 ? 0 : totalLosses / losingTrades.length,
      largestWin: Math.max(...winningTrades.map(t => t.pnl)),
      largestLoss: Math.min(...losingTrades.map(t => t.pnl)),
      averageHoldingPeriod: this.calculateAverageHoldingPeriod(trades),
    };
  }

  private calculateAverageHoldingPeriod(trades: Trade[]): number {
    if (trades.length === 0) return 0;
    const totalDays = trades.reduce((sum, trade) => {
      if (!trade.exitDate) return sum;
      const days = (trade.exitDate.getTime() - trade.entryDate.getTime()) / (1000 * 60 * 60 * 24);
      return sum + days;
    }, 0);
    return totalDays / trades.length;
  }
} 