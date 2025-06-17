declare module 'technicalindicators' {
  export const SMA: {
    calculate: (params: { period: number; values: number[] }) => number[];
  };
  export const EMA: {
    calculate: (params: { period: number; values: number[] }) => number[];
  };
  export const RSI: {
    calculate: (params: { period: number; values: number[] }) => number[];
  };
  export const MACD: {
    calculate: (params: { fastPeriod: number; slowPeriod: number; signalPeriod: number; values: number[] }) => Array<{ MACD: number; signal: number }>;
  };
  export const BollingerBands: {
    calculate: (params: { period: number; values: number[]; stdDev: number }) => Array<{ middle: number; upper: number; lower: number }>;
  };
  export const Stochastic: {
    calculate: (params: { high: number[]; low: number[]; close: number[]; period: number; signalPeriod: number }) => Array<{ k: number; d: number }>;
  };
  export const ATR: {
    calculate: (params: { high: number[]; low: number[]; close: number[]; period: number }) => number[];
  };
} 