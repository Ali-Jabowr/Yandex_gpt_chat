'use client';
import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  resultsCount?: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchBar({ onSearch, resultsCount, isOpen, onClose }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-0 left-0 right-0 z-20 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700/50 p-4">
      <form onSubmit={handleSearch} className="flex items-center gap-3">
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search messages..."
            className="w-full pl-10 pr-4 py-2 bg-slate-700/50 text-white rounded-lg border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoFocus
          />
        </div>
        
        {resultsCount !== undefined && (
          <span className="text-sm text-gray-400">
            {resultsCount} result{resultsCount !== 1 ? 's' : ''}
          </span>
        )}
        
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-slate-700/50 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </form>
    </div>
  );
}