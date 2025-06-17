import { NextRequest, NextResponse } from 'next/server';
import { getPlaidAccounts } from '@/integrations/plaid';

export async function POST(req: NextRequest) {
  const { accessToken } = await req.json();
  try {
    const data = await getPlaidAccounts(accessToken);
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
} 