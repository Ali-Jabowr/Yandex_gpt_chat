import { knowledgeBase } from './knowledgeBase';
import { initializeKnowledgeBase } from './initializeKnowledgeBase';

export interface ContextResult {
  context: string;
  sources: string[];
  hasKnowledgeBase: boolean;
  hasUploadedPdf: boolean;
}

export async function buildContext(
  userQuery: string,
  pdfContext?: string
): Promise<ContextResult> {
  // Ensure knowledge base is initialized
  await initializeKnowledgeBase();

  const sources: string[] = [];
  let context = '';
  
  // Check if we have an uploaded PDF context
  const hasUploadedPdf = !!pdfContext;
  if (hasUploadedPdf) {
    context = pdfContext;
    sources.push('Uploaded PDF document');
  }
  
  // Check if we have a knowledge base
  const hasKnowledgeBase = knowledgeBase.isReady();
  
  // If no uploaded PDF, use knowledge base as fallback
  if (!hasUploadedPdf && hasKnowledgeBase) {
    const relevantChunks = await knowledgeBase.searchRelevantChunks(userQuery, 3);
    
    if (relevantChunks.length > 0) {
      const knowledgeBaseContent = relevantChunks
        .map((chunk, index) => {
          const chunkInfo = chunk.summary 
            ? `[Chunk ${index + 1} Summary: ${chunk.summary}]`
            : `[Chunk ${index + 1}]`;
          return `${chunkInfo}\n${chunk.text}`;
        })
        .join('\n\n---\n\n');
      
      context = knowledgeBaseContent;
      sources.push('Knowledge base');
      
      // Add overall context if available
      const overallSummary = knowledgeBase.getOverallSummary();
      if (overallSummary) {
        context = `Document Overview: ${overallSummary}\n\n---\n\n${context}`;
      }
    }
  }
  
  return {
    context,
    sources,
    hasKnowledgeBase,
    hasUploadedPdf
  };
}

export function createSystemPrompt(contextResult: ContextResult): string {
  const { context, sources, hasKnowledgeBase, hasUploadedPdf } = contextResult;
  
  if (context) {
    const sourceText = sources.join(' and ');
    return `You are a helpful assistant with access to document content from ${sourceText}.

Here's the relevant information:

${context}

Instructions:
- Use this information to answer questions about the document(s)
- If you can't find the answer in the provided content, clearly state this
- When referencing information, you can mention it comes from the "${sourceText}"
- Be precise and cite specific parts of the content when relevant
- If the information is truncated, mention this limitation`;
  }
  
  // No context available
  let fallbackMessage = 'You are a helpful assistant.';
  
  if (!hasKnowledgeBase && !hasUploadedPdf) {
    fallbackMessage += ' You currently have no document loaded and no knowledge base available.';
  } else if (!hasUploadedPdf) {
    fallbackMessage += ' You have no uploaded PDF document, and no relevant information was found in the knowledge base for this query.';
  } else {
    fallbackMessage += ' No relevant document content was found for this query.';
  }
  
  return fallbackMessage;
}

export async function getKnowledgeBaseInfo(): Promise<{
  isReady: boolean;
  summary?: string;
  keywords?: string[];
  stats?: { totalChunks: number; avgChunkLength: number; totalWords: number };
}> {
  await initializeKnowledgeBase();
  
  if (!knowledgeBase.isReady()) {
    return { isReady: false };
  }
  
  return {
    isReady: true,
    summary: knowledgeBase.getOverallSummary(),
    keywords: knowledgeBase.getTopKeywords(),
    stats: knowledgeBase.getStats()
  };
}