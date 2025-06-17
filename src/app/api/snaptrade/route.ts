import { NextRequest, NextResponse } from 'next/server';
import { getSnapTradeAccounts } from '@/integrations/snaptrade';

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
  return NextResponse.json({ error: 'Not implemented: add utility functions in src/integrations/snaptrade.ts' }, { status: 501 });
} 