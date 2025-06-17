import apiClient from '../api/client';

interface SnapTradeConfig {
  clientId: string;
  consumerKey: string;
  redirectUri: string;
}

class SnapTradeService {
  private config: SnapTradeConfig;

  constructor(config: SnapTradeConfig) {
    this.config = config;
  }

  // Authentification
  async getAuthUrl(): Promise<string> {
    const response = await apiClient.post('/snaptrade/auth', {
      clientId: this.config.clientId,
      consumerKey: this.config.consumerKey,
      redirectUri: this.config.redirectUri,
    });
    return response.data.authUrl;
  }

  // Récupérer les positions
  async getPositions(): Promise<any[]> {
    const response = await apiClient.get('/snaptrade/positions');
    return response.data;
  }

  // Récupérer l'historique des trades
  async getTradeHistory(startDate?: string, endDate?: string): Promise<any[]> {
    const response = await apiClient.get('/snaptrade/trades', {
      params: { startDate, endDate },
    });
    return response.data;
  }

  // Récupérer les comptes
  async getAccounts(): Promise<any[]> {
    const response = await apiClient.get('/snaptrade/accounts');
    return response.data;
  }

  // Récupérer les balances
  async getBalances(): Promise<any[]> {
    const response = await apiClient.get('/snaptrade/balances');
    return response.data;
  }

  // Récupérer les prix en temps réel
  async getRealTimePrices(symbols: string[]): Promise<Record<string, number>> {
    const response = await apiClient.get('/snaptrade/prices', {
      params: { symbols: symbols.join(',') },
    });
    return response.data;
  }
}

export default SnapTradeService; 