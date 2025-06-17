import axios from 'axios';

const SNAPTRADE_CLIENT_ID = process.env.SNAPTRADE_CLIENT_ID;
const SNAPTRADE_CONSUMER_SECRET = process.env.SNAPTRADE_CONSUMER_SECRET;

export async function getSnapTradeAccounts(userToken: string) {
  if (!SNAPTRADE_CLIENT_ID || !SNAPTRADE_CONSUMER_SECRET) throw new Error('Missing SnapTrade API keys');
  const response = await axios.get(
    'https://api.snaptrade.com/api/v1/accounts',
    {
      headers: {
        'Client-Id': SNAPTRADE_CLIENT_ID,
        'Consumer-Secret': SNAPTRADE_CONSUMER_SECRET,
        'Authorization': `Bearer ${userToken}`,
      },
    }
  );
  return response.data;
} 