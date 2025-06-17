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
        const marketData = await this.marketService.getLatestPrice(alert.symbol);
        if (!marketData) continue;

        const triggered = await this.evaluateAlert(alert, marketData.price);
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
              marketData.price,
              marketData.change,
              marketData.changePercent
            );
          }

          this.notifySubscribers(updatedAlert);
        }
      }
    } catch (error) {
      console.error('Error checking alerts:', error);
    }
  }

  private async evaluateAlert(alert: Alert, currentPrice: number): Promise<boolean> {
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

  private async evaluateVolumeAlert(alert: Alert, currentPrice: number): Promise<boolean> {
    const marketData = await this.marketService.getLatestPrice(alert.symbol);
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

  private async evaluateTechnicalAlert(alert: Alert, currentPrice: number): Promise<boolean> {
    const historicalData = await this.marketService.getHistoricalData(alert.symbol);
    if (!historicalData || historicalData.length === 0) return false;

    const prices = historicalData.map(d => d.price);
    const config: IndicatorConfig = {
      type: alert.indicatorType || 'SMA',
      period: alert.period || 14,
      signalPeriod: alert.signalPeriod,
      fastPeriod: alert.fastPeriod,
      slowPeriod: alert.slowPeriod,
      stdDev: alert.stdDev,
      kPeriod: alert.kPeriod,
      dPeriod: alert.dPeriod,
    };

    const result = this.indicatorService.calculateIndicator(prices, config);

    switch (alert.condition) {
      case 'ABOVE':
        return result.value > alert.value;
      case 'BELOW':
        return result.value < alert.value;
      case 'EQUALS':
        return Math.abs(result.value - alert.value) < 0.01;
      case 'CROSSES_ABOVE':
        return result.value > alert.value && result.signal && result.signal <= alert.value;
      case 'CROSSES_BELOW':
        return result.value < alert.value && result.signal && result.signal >= alert.value;
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