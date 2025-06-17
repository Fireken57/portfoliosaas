import axios from 'axios';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function callOpenAI(prompt: string) {
  if (!OPENAI_API_KEY) throw new Error('Missing OpenAI API key');
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    },
    {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
} 