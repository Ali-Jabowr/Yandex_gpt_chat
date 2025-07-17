'use client';
import { useState, useEffect } from 'react';
import MessageBubble from './MessageBubble';

interface AnimatedMessageBubbleProps {
  text: string;
  isUser: boolean;
  timestamp: string;
  sources?: string[];
  rating?: 'positive' | 'negative';
  onRate?: (rating: 'positive' | 'negative') => void;
  delay?: number;
}

export default function AnimatedMessageBubble({
  text,
  isUser,
  timestamp,
  sources,
  rating,
  onRate,
  delay = 0
}: AnimatedMessageBubbleProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-all duration-300 ease-out transform ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-4 scale-95'
      } hover:scale-105 hover:shadow-lg`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <MessageBubble
        text={text}
        isUser={isUser}
        timestamp={timestamp}
        sources={sources}
        rating={rating}
        onRate={onRate}
      />
    </div>
  );
}