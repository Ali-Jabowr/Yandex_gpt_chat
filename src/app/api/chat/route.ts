import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { messages } = await req.json();

  if (!process.env.YANDEX_IAM_TOKEN) {
    return NextResponse.json(
      { error: 'IAM token not configured' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      'https://llm.api.cloud.yandex.net/foundationModels/v1/completion',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.YANDEX_IAM_TOKEN}` // Changed to Bearer token
        },
        body: JSON.stringify({
          modelUri: `gpt://${process.env.FOLDER_ID}/yandexgpt-lite`,
          completionOptions: {
            temperature: 0.6,
            maxTokens: 2000
          },
          messages: [
            {
              role: 'system',
              text: 'You are a helpful assistant'
            },
            ...messages.map((msg: any) => ({
              role: msg.isUser ? 'user' : 'assistant',
              text: msg.text
            }))
          ]
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return NextResponse.json(data.result.alternatives[0].message);
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'API request failed' },
      { status: 500 }
    );
  }
}