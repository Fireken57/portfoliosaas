import { MarketData } from '../types/index';

type MarketDataCallback = (data: MarketData) => void;

export class MarketService {
  private marketData: Record<string, MarketData[]> = {};
  private subscribers: MarketDataCallback[] = [];
  private updateInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META'];
    const now = new Date();

    symbols.forEach((symbol) => {
      const basePrice = Math.random() * 1000 + 100;
      const data: MarketData[] = [];

      for (let i = 0; i < 100; i++) {
        const timestamp = new Date(now.getTime() - (100 - i) * 60000);
        const price = basePrice + Math.random() * 10 - 5;
        const previousPrice = i > 0 ? data[i - 1].price : price;
        const change = price - previousPrice;
        const changePercent = (change / previousPrice) * 100;

        data.push({
          symbol,
          timestamp,
          price,
          change,
          changePercent,
          volume: Math.floor(Math.random() * 1000000),
          high: price + Math.random() * 2,
          low: price - Math.random() * 2,
          open: price - Math.random(),
          close: price + Math.random(),
          time: timestamp.toISOString()
        });
      }

      this.marketData[symbol] = data;
    });
  }

  subscribe(callback: MarketDataCallback): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((cb) => cb !== callback);
    };
  }

  async getMarketData(symbol: string): Promise<MarketData[]> {
    return this.marketData[symbol] || [];
  }

  async getLatestPrice(symbol: string): Promise<number> {
    const data = this.marketData[symbol];
    return data ? data[data.length - 1].price : 0;
  }

  async getHistoricalData(
    symbol: string,
    startDate: Date,
    endDate: Date
  ): Promise<MarketData[]> {
    const data = this.marketData[symbol] || [];
    return data.filter(
      (d) => d.timestamp >= startDate && d.timestamp <= endDate
    );
  }

  async getMultipleSymbols(symbols: string[]): Promise<Record<string, MarketData[]>> {
    const result: Record<string, MarketData[]> = {};
    for (const symbol of symbols) {
      result[symbol] = this.marketData[symbol] || [];
    }
    return result;
  }

  async searchSymbols(query: string): Promise<string[]> {
    const allSymbols = Object.keys(this.marketData);
    return allSymbols.filter((symbol) =>
      symbol.toLowerCase().includes(query.toLowerCase())
    );
  }

  async getMarketOverview(): Promise<{
    gainers: MarketData[];
    losers: MarketData[];
    mostActive: MarketData[];
  }> {
    const latestData = Object.values(this.marketData).map(
      (data) => data[data.length - 1]
    );

    const sortedByChange = [...latestData].sort(
      (a, b) => b.changePercent - a.changePercent
    );

    const sortedByVolume = [...latestData].sort(
      (a, b) => b.volume - a.volume
    );

    return {
      gainers: sortedByChange.slice(0, 5),
      losers: sortedByChange.reverse().slice(0, 5),
      mostActive: sortedByVolume.slice(0, 5),
    };
  }

  startRealTimeUpdates(interval = 5000) {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    this.updateInterval = setInterval(() => {
      Object.keys(this.marketData).forEach((symbol) => {
        const data = this.marketData[symbol];
        const lastData = data[data.length - 1];
        const now = new Date();

        const newPrice = lastData.price + (Math.random() * 2 - 1);
        const change = newPrice - lastData.price;
        const changePercent = (change / lastData.price) * 100;

        const newData: MarketData = {
          symbol,
          timestamp: now,
          price: newPrice,
          change,
          changePercent,
          volume: Math.floor(Math.random() * 1000000),
          high: Math.max(newPrice, lastData.high),
          low: Math.min(newPrice, lastData.low),
          open: newPrice - Math.random(),
          close: newPrice + Math.random(),
          time: now.toISOString()
        };

        data.push(newData);
        if (data.length > 100) {
          data.shift();
        }

        this.subscribers.forEach((callback) => callback(newData));
      });
    }, interval);
  }

  stopRealTimeUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
} 