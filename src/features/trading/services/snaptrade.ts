import axios from 'axios';

const SNAPTRADE_API_URL = 'https://api.snaptrade.com/api/v1';

export class SnapTradeService {
  private clientId: string;
  private consumerKey: string;
  private userId: string | null = null;
  private userSecret: string | null = null;

  constructor() {
    this.clientId = 'LEANDRE-CARTON-TEST-UPGLT';
    this.consumerKey = 'HFBFVeQfxqNshYk4upTqLzMfroqKd2UhyaijaXPIe8vzaNfbJA';
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'clientId': this.clientId,
      'consumerKey': this.consumerKey,
      ...(this.userId && this.userSecret ? {
        'userId': this.userId,
        'userSecret': this.userSecret
      } : {})
    };
  }

  async registerUser(email: string) {
    try {
      console.log('Registering user with email:', email);
      console.log('Headers:', this.getHeaders());
      
      const response = await axios.post(
        `${SNAPTRADE_API_URL}/user/register`,
        { email },
        { 
          headers: this.getHeaders(),
          validateStatus: (status) => status < 500 // Accept all responses to handle errors properly
        }
      );
      
      console.log('Response:', response.data);

      if (response.status !== 200) {
        throw new Error(`Registration failed: ${response.data.message || 'Unknown error'}`);
      }

      this.userId = response.data.userId;
      this.userSecret = response.data.userSecret;
      
      return response.data;
    } catch (error: any) {
      console.error('Error registering user:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.message || 'Failed to register user');
    }
  }

  async getConnections() {
    try {
      const response = await axios.get(
        `${SNAPTRADE_API_URL}/connections`,
        { 
          headers: this.getHeaders(),
          validateStatus: (status) => status < 500
        }
      );
      
      if (response.status !== 200) {
        throw new Error(`Failed to get connections: ${response.data.message || 'Unknown error'}`);
      }

      return response.data;
    } catch (error: any) {
      console.error('Error getting connections:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.message || 'Failed to get connections');
    }
  }

  async getHoldings() {
    try {
      const response = await axios.get(
        `${SNAPTRADE_API_URL}/holdings`,
        { 
          headers: this.getHeaders(),
          validateStatus: (status) => status < 500
        }
      );
      
      if (response.status !== 200) {
        throw new Error(`Failed to get holdings: ${response.data.message || 'Unknown error'}`);
      }

      return response.data;
    } catch (error: any) {
      console.error('Error getting holdings:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.message || 'Failed to get holdings');
    }
  }

  async getTransactions() {
    try {
      const response = await axios.get(
        `${SNAPTRADE_API_URL}/transactions`,
        { 
          headers: this.getHeaders(),
          validateStatus: (status) => status < 500
        }
      );
      
      if (response.status !== 200) {
        throw new Error(`Failed to get transactions: ${response.data.message || 'Unknown error'}`);
      }

      return response.data;
    } catch (error: any) {
      console.error('Error getting transactions:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.message || 'Failed to get transactions');
    }
  }

  async getAccountBalances() {
    try {
      const response = await axios.get(
        `${SNAPTRADE_API_URL}/balances`,
        { 
          headers: this.getHeaders(),
          validateStatus: (status) => status < 500
        }
      );
      
      if (response.status !== 200) {
        throw new Error(`Failed to get account balances: ${response.data.message || 'Unknown error'}`);
      }

      return response.data;
    } catch (error: any) {
      console.error('Error getting account balances:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.message || 'Failed to get account balances');
    }
  }
} 