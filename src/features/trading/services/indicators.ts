import {
  SMA,
  EMA,
  RSI,
  MACD,
  BollingerBands,
  Stochastic,
  ATR,
} from 'technicalindicators';

export interface IndicatorConfig {
  type: 'SMA' | 'EMA' | 'RSI' | 'MACD' | 'BB' | 'STOCH' | 'ATR';
  period?: number;
  signalPeriod?: number;
  fastPeriod?: number;
  slowPeriod?: number;
  stdDev?: number;
  kPeriod?: number;
  dPeriod?: number;
}

export interface IndicatorResult {
  value: number;
  signal?: number;
  upper?: number;
  lower?: number;
  k?: number;
  d?: number;
}

export class IndicatorService {
  private static instance: IndicatorService;
  private cache: Map<string, Map<string, IndicatorResult>> = new Map();

  private constructor() {}

  static getInstance(): IndicatorService {
    if (!IndicatorService.instance) {
      IndicatorService.instance = new IndicatorService();
    }
    return IndicatorService.instance;
  }

  calculateIndicator(
    prices: number[],
    config: IndicatorConfig
  ): IndicatorResult {
    const cacheKey = this.getCacheKey(prices, config);
    const cachedResult = this.getCachedResult(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    let result: IndicatorResult;

    switch (config.type) {
      case 'SMA':
        result = this.calculateSMA(prices, config.period || 14);
        break;
      case 'EMA':
        result = this.calculateEMA(prices, config.period || 14);
        break;
      case 'RSI':
        result = this.calculateRSI(prices, config.period || 14);
        break;
      case 'MACD':
        result = this.calculateMACD(
          prices,
          config.fastPeriod || 12,
          config.slowPeriod || 26,
          config.signalPeriod || 9
        );
        break;
      case 'BB':
        result = this.calculateBollingerBands(
          prices,
          config.period || 20,
          config.stdDev || 2
        );
        break;
      case 'STOCH':
        result = this.calculateStochastic(
          prices,
          config.kPeriod || 14,
          config.dPeriod || 3
        );
        break;
      case 'ATR':
        result = this.calculateATR(prices, config.period || 14);
        break;
      default:
        throw new Error(`Unsupported indicator type: ${config.type}`);
    }

    this.cacheResult(cacheKey, result);
    return result;
  }

  private calculateSMA(prices: number[], period: number): IndicatorResult {
    const sma = SMA.calculate({
      period,
      values: prices,
    });

    return {
      value: sma[sma.length - 1],
    };
  }

  private calculateEMA(prices: number[], period: number): IndicatorResult {
    const ema = EMA.calculate({
      period,
      values: prices,
    });

    return {
      value: ema[ema.length - 1],
    };
  }

  private calculateRSI(prices: number[], period: number): IndicatorResult {
    const rsi = RSI.calculate({
      period,
      values: prices,
    });

    return {
      value: rsi[rsi.length - 1],
    };
  }

  private calculateMACD(
    prices: number[],
    fastPeriod: number,
    slowPeriod: number,
    signalPeriod: number
  ): IndicatorResult {
    const macd = MACD.calculate({
      fastPeriod,
      slowPeriod,
      signalPeriod,
      values: prices,
    });

    const lastMACD = macd[macd.length - 1];
    return {
      value: lastMACD.MACD,
      signal: lastMACD.signal,
    };
  }

  private calculateBollingerBands(
    prices: number[],
    period: number,
    stdDev: number
  ): IndicatorResult {
    const bb = BollingerBands.calculate({
      period,
      values: prices,
      stdDev,
    });

    const lastBB = bb[bb.length - 1];
    return {
      value: lastBB.middle,
      upper: lastBB.upper,
      lower: lastBB.lower,
    };
  }

  private calculateStochastic(
    prices: number[],
    kPeriod: number,
    dPeriod: number
  ): IndicatorResult {
    const stoch = Stochastic.calculate({
      high: prices,
      low: prices,
      close: prices,
      period: kPeriod,
      signalPeriod: dPeriod,
    });

    const lastStoch = stoch[stoch.length - 1];
    return {
      value: lastStoch.k,
      signal: lastStoch.d,
    };
  }

  private calculateATR(prices: number[], period: number): IndicatorResult {
    const atr = ATR.calculate({
      high: prices,
      low: prices,
      close: prices,
      period,
    });

    return {
      value: atr[atr.length - 1],
    };
  }

  private getCacheKey(prices: number[], config: IndicatorConfig): string {
    return `${config.type}-${JSON.stringify(config)}-${prices.join(',')}`;
  }

  private getCachedResult(key: string): IndicatorResult | undefined {
    return this.cache.get(key)?.get(key);
  }

  private cacheResult(key: string, result: IndicatorResult): void {
    if (!this.cache.has(key)) {
      this.cache.set(key, new Map());
    }
    this.cache.get(key)!.set(key, result);
  }

  clearCache(): void {
    this.cache.clear();
  }
} 