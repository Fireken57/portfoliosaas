import { create } from 'zustand';
import { Trade, Position, PortfolioMetrics, Alert, AISuggestion } from '../types/index';

interface TradingState {
  trades: Trade[];
  positions: Position[];
  metrics: PortfolioMetrics | null;
  alerts: Alert[];
  suggestions: AISuggestion[];
  selectedTimeframe: 'WEEK' | 'MONTH' | 'YEAR' | 'YTD';
  selectedPlatform: string | null;
  selectedSector: string | null;
  selectedRegion: string | null;
  
  // Actions
  addTrade: (trade: Trade) => void;
  updateTrade: (id: string, trade: Partial<Trade>) => void;
  deleteTrade: (id: string) => void;
  setPositions: (positions: Position[]) => void;
  updateMetrics: (metrics: PortfolioMetrics) => void;
  addAlert: (alert: Alert) => void;
  addSuggestion: (suggestion: AISuggestion) => void;
  setTimeframe: (timeframe: 'WEEK' | 'MONTH' | 'YEAR' | 'YTD') => void;
  setPlatform: (platform: string | null) => void;
  setSector: (sector: string | null) => void;
  setRegion: (region: string | null) => void;
}

export const useTradingStore = create<TradingState>((set) => ({
  trades: [],
  positions: [],
  metrics: null,
  alerts: [],
  suggestions: [],
  selectedTimeframe: 'YTD',
  selectedPlatform: null,
  selectedSector: null,
  selectedRegion: null,

  addTrade: (trade) => set((state) => ({ trades: [...state.trades, trade] })),
  
  updateTrade: (id, trade) => set((state) => ({
    trades: state.trades.map((t) => (t.id === id ? { ...t, ...trade } : t))
  })),
  
  deleteTrade: (id) => set((state) => ({
    trades: state.trades.filter((t) => t.id !== id)
  })),
  
  setPositions: (positions) => set({ positions }),
  
  updateMetrics: (metrics) => set({ metrics }),
  
  addAlert: (alert) => set((state) => ({ alerts: [...state.alerts, alert] })),
  
  addSuggestion: (suggestion) => set((state) => ({
    suggestions: [...state.suggestions, suggestion]
  })),
  
  setTimeframe: (timeframe) => set({ selectedTimeframe: timeframe }),
  
  setPlatform: (platform) => set({ selectedPlatform: platform }),
  
  setSector: (sector) => set({ selectedSector: sector }),
  
  setRegion: (region) => set({ selectedRegion: region })
})); 