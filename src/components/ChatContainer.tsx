'use client'; // Required for using React hooks

import { useState } from 'react';
import MessageBubble from './MessageBubble';

export default function ChatContainer() {
  const [messages, setMessages] = useState([
    { text: 'Hello! How can I help you?', isUser: false }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    setMessages([...messages, { text: input, isUser: true }]);
    setInput('');
    
    // Simulate AI response after 1 second
    setTimeout(() => {
      setMessages(prev => [...prev, 
        { text: `You said: "${input}"`, isUser: false }
      ]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[80vh] max-w-md mx-auto border rounded-lg bg-white">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, i) => (
          <MessageBubble key={i} text={msg.text} isUser={msg.isUser} />
        ))}
      </div>
      
      <div className="p-4 border-t flex">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded-l-lg p-2"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 rounded-r-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}