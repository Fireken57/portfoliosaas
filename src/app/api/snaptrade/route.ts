import { NextRequest, NextResponse } from 'next/server';
import { getSnapTradeAccounts } from '@/integrations/snaptrade';
import SnapTrade from 'snaptrade-client';

const snapTrade = new SnapTrade({
  clientId: process.env.SNAPTRADE_CLIENT_ID!,
  consumerKey: process.env.SNAPTRADE_CONSUMER_KEY!,
});

export async function POST(req: NextRequest) {
  const { userToken } = await req.json();
  try {
    const data = await getSnapTradeAccounts(userToken);
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');

    switch (endpoint) {
      case 'positions':
        const positions = await snapTrade.getPositions();
        return NextResponse.json(positions);

      case 'trades':
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const trades = await snapTrade.getTradeHistory(startDate, endDate);
        return NextResponse.json(trades);

      case 'accounts':
        const accounts = await snapTrade.getAccounts();
        return NextResponse.json(accounts);

      case 'balances':
        const balances = await snapTrade.getBalances();
        return NextResponse.json(balances);

      case 'prices':
        const symbols = searchParams.get('symbols')?.split(',') || [];
        const prices = await snapTrade.getRealTimePrices(symbols);
        return NextResponse.json(prices);

      default:
        return NextResponse.json(
          { error: 'Invalid endpoint' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('SnapTrade API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
} 