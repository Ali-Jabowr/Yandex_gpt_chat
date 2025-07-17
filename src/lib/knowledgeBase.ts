import fs from 'fs';
import path from 'path';

export interface DocumentChunk {
  id: string;
  text: string;
  pageNumber?: number;
  chunkIndex: number;
  summary?: string;
  keywords?: string[];
  tfidfScore?: number;
}

export interface KnowledgeBaseIndex {
  chunks: DocumentChunk[];
  summary: string;
  keywords: string[];
  tfidf: any; // Will be TfIdf from 'natural'
  totalChunks: number;
}

class KnowledgeBaseService {
  private index: KnowledgeBaseIndex | null = null;
  private isInitialized = false;
  private readonly CHUNK_SIZE = 1000; // characters per chunk
  private readonly CHUNK_OVERLAP = 200; // overlap between chunks
  private tokenize: any;
  private SentenceTokenizer: any;

  async initialize(pdfPath: string): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    console.log('Initializing knowledge base from:', pdfPath);
    
    try {
      // Check if file exists
      if (!fs.existsSync(pdfPath)) {
        throw new Error(`PDF file not found: ${pdfPath}`);
      }

      // Dynamic imports to avoid import-time issues
      const { default: pdfParse } = await import('pdf-parse');
      const { TfIdf, tokenize, SentenceTokenizer } = await import('natural');
      
      // Store tokenize and SentenceTokenizer for later use
      this.tokenize = tokenize;
      this.SentenceTokenizer = SentenceTokenizer;

      // Read and parse PDF
      const pdfBuffer = fs.readFileSync(pdfPath);
      const pdfData = await pdfParse(pdfBuffer);
      
      // Process the text
      const fullText = pdfData.text;
      const chunks = this.createChunks(fullText);
      
      // Create TF-IDF index
      const tfidf = new TfIdf();
      chunks.forEach(chunk => {
        tfidf.addDocument(chunk.text);
      });

      // Generate overall summary and keywords
      const summary = this.generateSummary(fullText);
      const keywords = this.extractKeywords(fullText);

      // Add TF-IDF scores and summaries to chunks
      const processedChunks = chunks.map((chunk, index) => {
        const chunkKeywords = this.extractKeywords(chunk.text);
        const chunkSummary = this.generateChunkSummary(chunk.text);
        
        return {
          ...chunk,
          summary: chunkSummary,
          keywords: chunkKeywords,
          tfidfScore: this.calculateChunkTfIdfScore(tfidf, index)
        };
      });

      this.index = {
        chunks: processedChunks,
        summary,
        keywords,
        tfidf,
        totalChunks: chunks.length
      };

      this.isInitialized = true;
      console.log(`Knowledge base initialized with ${chunks.length} chunks`);
      console.log('Summary:', summary.substring(0, 200) + '...');
      console.log('Top keywords:', keywords.slice(0, 10).join(', '));
      
    } catch (error) {
      console.error('Error initializing knowledge base:', error);
      throw error;
    }
  }

  private createChunks(text: string): DocumentChunk[] {
    const chunks: DocumentChunk[] = [];
    const sentences = this.splitIntoSentences(text);
    
    let currentChunk = '';
    let chunkIndex = 0;
    
    for (const sentence of sentences) {
      const potentialChunk = currentChunk + ' ' + sentence;
      
      if (potentialChunk.length <= this.CHUNK_SIZE) {
        currentChunk = potentialChunk.trim();
      } else {
        // Save current chunk if it's not empty
        if (currentChunk.trim()) {
          chunks.push({
            id: `chunk_${chunkIndex}`,
            text: currentChunk.trim(),
            chunkIndex,
          });
          chunkIndex++;
        }
        
        // Start new chunk with overlap
        const overlap = this.getOverlap(currentChunk, this.CHUNK_OVERLAP);
        currentChunk = (overlap + ' ' + sentence).trim();
      }
    }
    
    // Add the last chunk
    if (currentChunk.trim()) {
      chunks.push({
        id: `chunk_${chunkIndex}`,
        text: currentChunk.trim(),
        chunkIndex,
      });
    }
    
    return chunks;
  }

  private splitIntoSentences(text: string): string[] {
    if (!this.SentenceTokenizer) {
      // Fallback to simple splitting if tokenizer not available
      return text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    }
    const tokenizer = new this.SentenceTokenizer();
    return tokenizer.tokenize(text);
  }

  private getOverlap(text: string, overlapSize: number): string {
    if (text.length <= overlapSize) return text;
    
    const sentences = this.splitIntoSentences(text);
    let overlap = '';
    
    // Take sentences from the end until we reach the overlap size
    for (let i = sentences.length - 1; i >= 0; i--) {
      const potentialOverlap = sentences[i] + ' ' + overlap;
      if (potentialOverlap.length <= overlapSize) {
        overlap = potentialOverlap.trim();
      } else {
        break;
      }
    }
    
    return overlap;
  }

  private generateSummary(text: string): string {
    // Simple extractive summarization - take first few sentences and key sentences
    const sentences = this.splitIntoSentences(text);
    const summary = sentences.slice(0, 3).join(' ');
    return summary.length > 500 ? summary.substring(0, 500) + '...' : summary;
  }

  private generateChunkSummary(text: string): string {
    const sentences = this.splitIntoSentences(text);
    const summary = sentences.slice(0, 2).join(' ');
    return summary.length > 200 ? summary.substring(0, 200) + '...' : summary;
  }

  private extractKeywords(text: string): string[] {
    if (!this.tokenize) {
      // Fallback to simple word splitting if tokenizer not available
      const words = text.toLowerCase().split(/\s+/).filter(word => 
        word.length > 3 && 
        !/^\d+$/.test(word) && 
        !this.isStopWord(word)
      );
      
      // Count word frequencies
      const wordCounts: { [key: string]: number } = {};
      words.forEach(word => {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      });
      
      // Sort by frequency and return top keywords
      return Object.entries(wordCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 20)
        .map(([word]) => word);
    }
    
    const tokens = this.tokenize(text.toLowerCase());
    const words = tokens.filter((token: string) => 
      token.length > 3 && 
      !/^\d+$/.test(token) && 
      !this.isStopWord(token)
    );
    
    // Count word frequencies
    const wordCounts: { [key: string]: number } = {};
    words.forEach((word: string) => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });
    
    // Sort by frequency and return top keywords
    return Object.entries(wordCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([word]) => word);
  }

  private isStopWord(word: string): boolean {
    const stopWords = new Set([
      'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have',
      'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you',
      'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they',
      'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would',
      'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about',
      'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can',
      'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people',
      'into', 'year', 'your', 'good', 'some', 'could', 'them',
      'see', 'other', 'than', 'then', 'now', 'look', 'only',
      'come', 'its', 'over', 'think', 'also', 'back', 'after',
      'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
      'even', 'new', 'want', 'because', 'any', 'these', 'give',
      'day', 'most', 'us'
    ]);
    return stopWords.has(word);
  }

  private calculateChunkTfIdfScore(tfidf: TfIdf, chunkIndex: number): number {
    let totalScore = 0;
    let termCount = 0;
    
    tfidf.listTerms(chunkIndex).forEach(term => {
      totalScore += term.tfidf;
      termCount++;
    });
    
    return termCount > 0 ? totalScore / termCount : 0;
  }

  async searchRelevantChunks(query: string, maxResults: number = 3): Promise<DocumentChunk[]> {
    if (!this.index) {
      console.warn('Knowledge base not initialized');
      return [];
    }

    // Use fallback tokenization if natural is not available
    let queryTokens: string[];
    if (this.tokenize) {
      queryTokens = this.tokenize(query.toLowerCase());
    } else {
      queryTokens = query.toLowerCase().split(/\s+/).filter(token => token.length > 0);
    }

    const scores: { chunk: DocumentChunk; score: number }[] = [];

    this.index.chunks.forEach(chunk => {
      let score = 0;
      
      // Simple text similarity (word overlap)
      let chunkTokens: string[];
      if (this.tokenize) {
        chunkTokens = this.tokenize(chunk.text.toLowerCase());
      } else {
        chunkTokens = chunk.text.toLowerCase().split(/\s+/).filter(token => token.length > 0);
      }
      
      const commonTokens = queryTokens.filter(token => chunkTokens.includes(token));
      score += commonTokens.length;
      
      // Keyword matching boost
      const keywordMatches = queryTokens.filter(token => 
        chunk.keywords?.some(keyword => keyword.includes(token))
      ).length;
      score += keywordMatches * 2;
      
      // Text contains query boost
      if (chunk.text.toLowerCase().includes(query.toLowerCase())) {
        score += 5;
      }
      
      scores.push({ chunk, score });
    });

    // Sort by score and return top results
    return scores
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults)
      .map(item => item.chunk);
  }

  getOverallSummary(): string {
    return this.index?.summary || '';
  }

  getTopKeywords(): string[] {
    return this.index?.keywords || [];
  }

  isReady(): boolean {
    return this.isInitialized && this.index !== null;
  }

  getStats(): { totalChunks: number; avgChunkLength: number; totalWords: number } {
    if (!this.index) {
      return { totalChunks: 0, avgChunkLength: 0, totalWords: 0 };
    }

    const totalChunks = this.index.chunks.length;
    const totalLength = this.index.chunks.reduce((sum, chunk) => sum + chunk.text.length, 0);
    const avgChunkLength = totalLength / totalChunks;
    
    let totalWords = 0;
    if (this.tokenize) {
      totalWords = this.index.chunks.reduce((sum, chunk) => 
        sum + this.tokenize(chunk.text).length, 0
      );
    } else {
      totalWords = this.index.chunks.reduce((sum, chunk) => 
        sum + chunk.text.split(/\s+/).filter(word => word.length > 0).length, 0
      );
    }

    return { totalChunks, avgChunkLength, totalWords };
  }
}

// Export singleton instance
export const knowledgeBase = new KnowledgeBaseService();