import axios from 'axios';

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;

export async function getPlaidAccounts(accessToken: string) {
  if (!PLAID_CLIENT_ID || !PLAID_SECRET) throw new Error('Missing Plaid API keys');
  const response = await axios.post(
    'https://sandbox.plaid.com/accounts/get',
    {
      client_id: PLAID_CLIENT_ID,
      secret: PLAID_SECRET,
      access_token: accessToken,
    }
  );
  return response.data;
} 