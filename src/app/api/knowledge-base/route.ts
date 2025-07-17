import { NextResponse } from 'next/server';
import { getKnowledgeBaseInfo } from '@/lib/contextBuilder';

export async function GET() {
  try {
    const info = await getKnowledgeBaseInfo();
    return NextResponse.json(info);
  } catch (error) {
    console.error('Error getting knowledge base info:', error);
    return NextResponse.json(
      { error: 'Failed to get knowledge base information' },
      { status: 500 }
    );
  }
}