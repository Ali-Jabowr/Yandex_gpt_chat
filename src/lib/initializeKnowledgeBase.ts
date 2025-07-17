import { knowledgeBase } from './knowledgeBase';
import path from 'path';

let initializationPromise: Promise<void> | null = null;

export async function initializeKnowledgeBase(): Promise<void> {
  // Return existing promise if already initializing
  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    try {
      // Check if initialization is disabled
      if (process.env.DISABLE_KNOWLEDGE_BASE === 'true') {
        console.log('Knowledge base initialization disabled');
        return;
      }

      // Get PDF path from environment variable or use default
      const pdfPath = process.env.KNOWLEDGE_BASE_PDF_PATH || 
                     path.join(process.cwd(), 'knowledge-base.pdf');

      console.log('Attempting to initialize knowledge base from:', pdfPath);
      
      await knowledgeBase.initialize(pdfPath);
      
      // Log stats
      const stats = knowledgeBase.getStats();
      console.log('Knowledge base statistics:', stats);
      
    } catch (error) {
      console.error('Failed to initialize knowledge base:', error);
      console.log('The application will continue to work without the knowledge base');
      console.log('To enable knowledge base:');
      console.log('1. Place your PDF file as "knowledge-base.pdf" in the project root');
      console.log('2. Or set KNOWLEDGE_BASE_PDF_PATH environment variable');
    }
  })();

  return initializationPromise;
}

// Removed auto-initialization to prevent import-time errors