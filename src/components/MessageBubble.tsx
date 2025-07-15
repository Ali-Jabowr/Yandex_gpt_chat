// This component displays a single chat message
interface MessageBubbleProps {
  text: string;
  isUser: boolean;
}

export default function MessageBubble({ text, isUser }: MessageBubbleProps) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs md:max-w-md rounded-lg p-3 my-2 ${
          isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
        }`}
      >
        {text}
      </div>
    </div>
  );
}