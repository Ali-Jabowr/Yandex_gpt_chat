'use client';
import { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';

type Message = {
  text: string;
  isUser: boolean;
  timestamp: string;
};

export default function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: 'Hello! How can I help you today?',
      isUser: false,
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pdfContext, setPdfContext] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      text: input,
      isUser: true,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          pdfContext
        })
      });

      if (!response.ok) throw new Error('API error');
      const aiMessage = await response.json();

      setMessages(prev => [...prev, {
        text: aiMessage.text,
        isUser: false,
        timestamp: new Date().toLocaleTimeString()
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        text: "Sorry, I couldn't process your request.",
        isUser: false,
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      setPdfContext(text.slice(0, 5000)); // Limit context size
      alert('PDF context loaded!');
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col h-[90vh] max-w-2xl mx-auto bg-gray-900 rounded-xl shadow-xl">
      {/* Header */}
      <div className="p-4 bg-gray-800 rounded-t-xl flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">Yandex GPT Chat</h1>
        <label className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded cursor-pointer">
          Upload PDF
          <input 
            type="file" 
            accept=".pdf" 
            onChange={handlePdfUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg, i) => (
          <MessageBubble 
            key={i}
            text={msg.text}
            isUser={msg.isUser}
            timestamp={msg.timestamp}
          />
        ))}
        <div ref={messagesEndRef} />
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 text-white rounded-lg p-3 max-w-xs">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
        {pdfContext && (
          <p className="text-xs text-gray-400 mt-2">
            PDF context is active ({pdfContext.length} chars)
          </p>
        )}
      </div>
    </div>
  );
}