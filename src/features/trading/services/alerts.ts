import { Alert } from '../types';
import { MarketService } from './market';
import { IndicatorService, IndicatorConfig } from './indicators';
import { sendAlertEmail } from '@/lib/email';
import { prisma } from '@/lib/prisma';

export class AlertService {
  private marketService: MarketService;
  private indicatorService: IndicatorService;
  private checkInterval: NodeJS.Timeout | null = null;
  private subscribers: ((alert: Alert) => void)[] = [];

  constructor() {
    this.marketService = new MarketService();
    this.indicatorService = IndicatorService.getInstance();
  }

  async createAlert(alert: Omit<Alert, 'id' | 'triggered' | 'createdAt' | 'updatedAt'>): Promise<Alert> {
    try {
      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alert),
      });

      if (!response.ok) {
        throw new Error('Failed to create alert');
      }

      const newAlert = await response.json();
      this.startCheckingAlerts();
      return newAlert;
    } catch (error) {
      console.error('Error creating alert:', error);
      throw error;
    }
  }

  async getAlerts(): Promise<Alert[]> {
    try {
      const response = await fetch('/api/alerts');
      if (!response.ok) {
        throw new Error('Failed to fetch alerts');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching alerts:', error);
      throw error;
    }
  }

  async updateAlert(id: string, alert: Partial<Alert>): Promise<Alert> {
    try {
      const response = await fetch(`/api/alerts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alert),
      });

      if (!response.ok) {
        throw new Error('Failed to update alert');
      }

      return response.json();
    } catch (error) {
      console.error('Error updating alert:', error);
      throw error;
    }
  }

  async deleteAlert(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/alerts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete alert');
      }
    } catch (error) {
      console.error('Error deleting alert:', error);
      throw error;
    }
  }

  subscribe(callback: (alert: Alert) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  private async checkAlerts(): Promise<void> {
    try {
      const alerts = await this.getAlerts();
      const activeAlerts = alerts.filter(alert => !alert.triggered);

      for (const alert of activeAlerts) {
        const marketDataArr = await this.marketService.getMarketData(alert.symbol);
        const latestMarketData = marketDataArr[marketDataArr.length - 1];
        if (!latestMarketData) continue;

        let triggered = false;
        if (alert.type === 'PRICE') {
          triggered = await this.evaluatePriceAlert(alert, latestMarketData.price);
        } else if (alert.type === 'VOLUME') {
          triggered = await this.evaluateVolumeAlert(alert, latestMarketData);
        } else if (alert.type === 'TECHNICAL') {
          triggered = await this.evaluateTechnicalAlert(alert, latestMarketData);
        }

        if (triggered) {
          const updatedAlert = await this.updateAlert(alert.id, { triggered: true });
          
          // Get user email
          const user = await prisma.user.findUnique({
            where: { id: alert.userId },
            select: { email: true },
          });

          if (user?.email) {
            // Send email notification
            await sendAlertEmail(
              user.email,
              updatedAlert,
              latestMarketData.price,
              latestMarketData.change,
              latestMarketData.changePercent
            );
          }

          this.notifySubscribers(updatedAlert);
        }
      }
    } catch (error) {
      console.error('Error checking alerts:', error);
    }
  }

  private async evaluateAlert(alert: Alert, currentPrice: number | any): Promise<boolean> {
    switch (alert.type) {
      case 'PRICE':
        return this.evaluatePriceAlert(alert, currentPrice);
      case 'VOLUME':
        return this.evaluateVolumeAlert(alert, currentPrice);
      case 'TECHNICAL':
        return this.evaluateTechnicalAlert(alert, currentPrice);
      default:
        return false;
    }
  }

  private evaluatePriceAlert(alert: Alert, currentPrice: number): boolean {
    switch (alert.condition) {
      case 'ABOVE':
        return currentPrice > alert.value;
      case 'BELOW':
        return currentPrice < alert.value;
      case 'EQUALS':
        return Math.abs(currentPrice - alert.value) < 0.01;
      default:
        return false;
    }
  }

  private async evaluateVolumeAlert(alert: Alert, marketData: any): Promise<boolean> {
    if (!marketData) return false;
    const volume = marketData.volume;
    const averageVolume = marketData.averageVolume || volume;
    switch (alert.condition) {
      case 'ABOVE':
        return volume > averageVolume * alert.value;
      case 'BELOW':
        return volume < averageVolume * alert.value;
      case 'EQUALS':
        return Math.abs(volume - averageVolume * alert.value) < 0.01;
      default:
        return false;
    }
  }

  private async evaluateTechnicalAlert(alert: Alert, marketData: any): Promise<boolean> {
    const historicalData = await this.marketService.getMarketData(alert.symbol);
    if (!historicalData || historicalData.length === 0) return false;
    const prices = historicalData.map(d => d.price);
    // Use default values if alert fields are missing
    const config: IndicatorConfig = {
      type: (alert as any).indicatorType || 'SMA',
      period: (alert as any).period || 14,
      signalPeriod: (alert as any).signalPeriod,
      fastPeriod: (alert as any).fastPeriod,
      slowPeriod: (alert as any).slowPeriod,
      stdDev: (alert as any).stdDev,
      kPeriod: (alert as any).kPeriod,
      dPeriod: (alert as any).dPeriod,
    };
    const result = this.indicatorService.calculateIndicator(prices, config);
    switch (alert.condition) {
      case 'ABOVE':
        return result.value > alert.value;
      case 'BELOW':
        return result.value < alert.value;
      case 'EQUALS':
        return Math.abs(result.value - alert.value) < 0.01;
      default:
        return false;
    }
  }

  private notifySubscribers(alert: Alert): void {
    this.subscribers.forEach(callback => callback(alert));
  }

  startCheckingAlerts(interval = 60000): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
    this.checkInterval = setInterval(() => this.checkAlerts(), interval);
  }

  stopCheckingAlerts(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }
} 