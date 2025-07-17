import { NextResponse } from 'next/server';
import { buildContext, createSystemPrompt } from '@/lib/contextBuilder';
import { initializeKnowledgeBase } from '@/lib/initializeKnowledgeBase';

export async function POST(req: Request) {
  const { messages, pdfContext } = await req.json();

  if (!process.env.YANDEX_IAM_TOKEN) {
    return NextResponse.json(
      { error: 'IAM token not configured' },
      { status: 500 }
    );
  }

  try {
    // Ensure knowledge base is initialized
    await initializeKnowledgeBase();

    // Get the last user message for context search
    const lastUserMessage = messages.filter((msg: any) => msg.isUser).slice(-1)[0];
    const userQuery = lastUserMessage?.text || '';

    // Build context using both uploaded PDF and knowledge base
    const contextResult = await buildContext(userQuery, pdfContext);
    const systemPrompt = createSystemPrompt(contextResult);

    const response = await fetch(
      'https://llm.api.cloud.yandex.net/foundationModels/v1/completion',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.YANDEX_IAM_TOKEN}`
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
              text: systemPrompt
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
    return NextResponse.json({
      text: data.result.alternatives[0].message.text,
      sources: contextResult.sources,
      hasKnowledgeBase: contextResult.hasKnowledgeBase,
      hasUploadedPdf: contextResult.hasUploadedPdf
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'API request failed' },
      { status: 500 }
    );
  }
}