import { NextRequest, NextResponse } from 'next/server';
import { callOpenAI } from '@/integrations/openai';

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  try {
    const data = await callOpenAI(prompt);
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
} 