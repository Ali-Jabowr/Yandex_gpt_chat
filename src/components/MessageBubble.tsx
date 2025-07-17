'use client';
import { useState } from 'react';

interface MessageBubbleProps {
  text: string;
  isUser: boolean;
  timestamp: string;
  sources?: string[];
  rating?: 'positive' | 'negative';
  onRate?: (rating: 'positive' | 'negative') => void;
}

export default function MessageBubble({ text, isUser, timestamp, sources, rating, onRate }: MessageBubbleProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 message-enter`}>
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} max-w-[85%] group`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'ml-2' : 'mr-2'
        }`}>
          {isUser ? (
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        {/* Message Content */}
        <div
          className={`relative transition-all duration-300 ${
            isUser ? 'group-hover:transform group-hover:scale-105' : ''
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className={`relative rounded-2xl p-4 shadow-lg backdrop-blur-sm ${
              isUser
                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white border border-indigo-400/20'
                : 'bg-slate-800/90 text-white border border-slate-700/50'
            }`}
          >
            {/* Message tail */}
            <div className={`absolute top-4 w-0 h-0 ${
              isUser 
                ? 'right-0 translate-x-full border-l-8 border-l-indigo-500 border-t-8 border-t-transparent border-b-8 border-b-transparent'
                : 'left-0 -translate-x-full border-r-8 border-r-slate-800 border-t-8 border-t-transparent border-b-8 border-b-transparent'
            }`} />

            {/* Message text */}
            <div className="relative z-10">
              <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium">
                {text}
              </p>
              
              {/* Sources */}
              {sources && sources.length > 0 && !isUser && (
                <div className="mt-3 pt-3 border-t border-slate-600/50">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs text-blue-400 font-medium">Sources:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sources.map((source, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
                      >
                        {source}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Timestamp */}
              <div className={`flex items-center justify-between mt-2 transition-opacity duration-200 ${
                isHovered ? 'opacity-100' : 'opacity-60'
              }`}>
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className={`text-xs ${
                    isUser ? 'text-indigo-200' : 'text-gray-400'
                  }`}>
                    {timestamp}
                  </span>
                </div>
                
                {/* Message Actions */}
                <div className={`flex items-center gap-1 transition-opacity duration-200 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}>
                  <button
                    onClick={copyToClipboard}
                    className={`p-1 rounded hover:bg-black/20 transition-colors ${
                      copied ? 'text-green-400' : isUser ? 'text-indigo-200' : 'text-gray-400'
                    }`}
                    title={copied ? 'Copied!' : 'Copy message'}
                  >
                    {copied ? (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm-3 1a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2H5z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                  
                  {!isUser && onRate && (
                    <>
                      <button
                        onClick={() => onRate('positive')}
                        className={`p-1 rounded hover:bg-black/20 transition-colors ${
                          rating === 'positive' ? 'text-green-400' : 'text-gray-400 hover:text-green-400'
                        }`}
                        title="Good response"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={() => onRate('negative')}
                        className={`p-1 rounded hover:bg-black/20 transition-colors ${
                          rating === 'negative' ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
                        }`}
                        title="Poor response"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}