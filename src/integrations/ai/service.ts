import apiClient from '../api/client';
import { Trade, Position } from '@/features/trading/types';

interface AISuggestion {
  type: 'ALLOCATION' | 'RISK' | 'OPPORTUNITY';
  title: string;
  description: string;
  confidence: number;
  date: Date;
}

interface AIAnalysis {
  portfolioHealth: {
    score: number;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  riskAnalysis: {
    overallRisk: number;
    concentrationRisk: number;
    marketRisk: number;
    recommendations: string[];
  };
  opportunities: {
    sectors: string[];
    assets: string[];
    strategies: string[];
  };
}

class AIService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // Obtenir des suggestions basées sur le portefeuille
  async getSuggestions(positions: Position[]): Promise<AISuggestion[]> {
    const response = await apiClient.post('/ai/suggestions', {
      positions,
      apiKey: this.apiKey,
    });
    return response.data;
  }

  // Obtenir une analyse complète du portefeuille
  async getPortfolioAnalysis(
    positions: Position[],
    trades: Trade[]
  ): Promise<AIAnalysis> {
    const response = await apiClient.post('/ai/analysis', {
      positions,
      trades,
      apiKey: this.apiKey,
    });
    return response.data;
  }

  // Obtenir des alertes basées sur les conditions du marché
  async getMarketAlerts(positions: Position[]): Promise<AISuggestion[]> {
    const response = await apiClient.post('/ai/alerts', {
      positions,
      apiKey: this.apiKey,
    });
    return response.data;
  }

  // Obtenir des recommandations de diversification
  async getDiversificationRecommendations(
    positions: Position[]
  ): Promise<AISuggestion[]> {
    const response = await apiClient.post('/ai/diversification', {
      positions,
      apiKey: this.apiKey,
    });
    return response.data;
  }

  // Obtenir une analyse de performance
  async getPerformanceAnalysis(trades: Trade[]): Promise<{
    insights: string[];
    recommendations: string[];
    patterns: string[];
  }> {
    const response = await apiClient.post('/ai/performance', {
      trades,
      apiKey: this.apiKey,
    });
    return response.data;
  }
}

export default AIService; 