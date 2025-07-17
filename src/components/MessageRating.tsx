'use client';
import { useState } from 'react';

interface MessageRatingProps {
  onRate: (rating: 'positive' | 'negative') => void;
  rating?: 'positive' | 'negative';
}

export default function MessageRating({ onRate, rating }: MessageRatingProps) {
  const [hoveredRating, setHoveredRating] = useState<'positive' | 'negative' | null>(null);

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500">Rate:</span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onRate('positive')}
          onMouseEnter={() => setHoveredRating('positive')}
          onMouseLeave={() => setHoveredRating(null)}
          className={`p-1 rounded-full transition-colors ${
            rating === 'positive' || hoveredRating === 'positive'
              ? 'bg-green-500/20 text-green-400'
              : 'text-gray-400 hover:text-green-400'
          }`}
          title="Good response"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </button>
        
        <button
          onClick={() => onRate('negative')}
          onMouseEnter={() => setHoveredRating('negative')}
          onMouseLeave={() => setHoveredRating(null)}
          className={`p-1 rounded-full transition-colors ${
            rating === 'negative' || hoveredRating === 'negative'
              ? 'bg-red-500/20 text-red-400'
              : 'text-gray-400 hover:text-red-400'
          }`}
          title="Poor response"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}