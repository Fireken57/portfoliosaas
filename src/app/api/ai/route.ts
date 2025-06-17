import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { positions, trades, apiKey, type } = await request.json();

    if (!apiKey || apiKey !== process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    switch (type) {
      case 'suggestions':
        return await handleSuggestions(positions);
      case 'analysis':
        return await handleAnalysis(positions, trades);
      case 'alerts':
        return await handleAlerts(positions);
      case 'diversification':
        return await handleDiversification(positions);
      case 'performance':
        return await handlePerformance(trades);
      default:
        return NextResponse.json(
          { error: 'Invalid request type' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('AI API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

async function handleSuggestions(positions: any[]) {
  const prompt = `Analyze the following portfolio positions and provide investment suggestions:
    ${JSON.stringify(positions, null, 2)}
    
    Provide suggestions in the following format:
    - Type (ALLOCATION/RISK/OPPORTUNITY)
    - Title
    - Description
    - Confidence (0-1)
    - Date`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'gpt-4',
  });

  return NextResponse.json(JSON.parse(completion.choices[0].message.content));
}

async function handleAnalysis(positions: any[], trades: any[]) {
  const prompt = `Analyze the following portfolio:
    Positions: ${JSON.stringify(positions, null, 2)}
    Trades: ${JSON.stringify(trades, null, 2)}
    
    Provide a comprehensive analysis including:
    1. Portfolio Health (score, strengths, weaknesses, recommendations)
    2. Risk Analysis (overall risk, concentration risk, market risk, recommendations)
    3. Opportunities (sectors, assets, strategies)`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'gpt-4',
  });

  return NextResponse.json(JSON.parse(completion.choices[0].message.content));
}

async function handleAlerts(positions: any[]) {
  const prompt = `Analyze the following positions for potential market alerts:
    ${JSON.stringify(positions, null, 2)}
    
    Consider:
    - Market conditions
    - Technical indicators
    - News events
    - Risk levels`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'gpt-4',
  });

  return NextResponse.json(JSON.parse(completion.choices[0].message.content));
}

async function handleDiversification(positions: any[]) {
  const prompt = `Analyze the following portfolio for diversification opportunities:
    ${JSON.stringify(positions, null, 2)}
    
    Consider:
    - Sector allocation
    - Geographic distribution
    - Asset class mix
    - Risk factors`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'gpt-4',
  });

  return NextResponse.json(JSON.parse(completion.choices[0].message.content));
}

async function handlePerformance(trades: any[]) {
  const prompt = `Analyze the following trading history:
    ${JSON.stringify(trades, null, 2)}
    
    Provide:
    - Key insights
    - Performance recommendations
    - Identified patterns`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'gpt-4',
  });

  return NextResponse.json(JSON.parse(completion.choices[0].message.content));
} 