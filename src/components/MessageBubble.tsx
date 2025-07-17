'use client';

interface MessageBubbleProps {
  text: string;
  isUser: boolean;
  timestamp: string;
}

export default function MessageBubble({ text, isUser, timestamp }: MessageBubbleProps) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-xl p-3 ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-700 text-white rounded-bl-none'
        }`}
      >
        <p className="whitespace-pre-wrap">{text}</p>
        <p className={`text-xs mt-1 ${
          isUser ? 'text-blue-200' : 'text-gray-400'
        }`}>
          {timestamp}
        </p>
      </div>
    </div>
  );
}