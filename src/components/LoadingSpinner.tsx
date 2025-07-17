'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  type?: 'dots' | 'spinner' | 'pulse';
}

export default function LoadingSpinner({ size = 'md', type = 'dots' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const dotSizes = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  };

  if (type === 'dots') {
    return (
      <div className="flex items-center gap-1">
        <div className={`${dotSizes[size]} bg-blue-400 rounded-full animate-bounce`}></div>
        <div className={`${dotSizes[size]} bg-blue-400 rounded-full animate-bounce delay-100`}></div>
        <div className={`${dotSizes[size]} bg-blue-400 rounded-full animate-bounce delay-200`}></div>
      </div>
    );
  }

  if (type === 'spinner') {
    return (
      <div className={`${sizeClasses[size]} animate-spin`}>
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (type === 'pulse') {
    return (
      <div className="flex items-center gap-1">
        <div className={`${dotSizes[size]} bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse`}></div>
        <div className={`${dotSizes[size]} bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-pulse delay-75`}></div>
        <div className={`${dotSizes[size]} bg-gradient-to-r from-pink-400 to-red-500 rounded-full animate-pulse delay-150`}></div>
      </div>
    );
  }

  return null;
}