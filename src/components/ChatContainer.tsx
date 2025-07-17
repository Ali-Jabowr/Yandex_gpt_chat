'use client';
import { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import WelcomeMessage from './WelcomeMessage';
import QuickActions from './QuickActions';
import StatusBar from './StatusBar';
import ThemeToggle from './ThemeToggle';
import SettingsPanel from './SettingsPanel';
import SearchBar from './SearchBar';
import ExportDialog from './ExportDialog';
import FloatingActionButton from './FloatingActionButton';
import NotificationSystem from './NotificationSystem';
import MessageRating from './MessageRating';

type Message = {
  text: string;
  isUser: boolean;
  timestamp: string;
  sources?: string[];
  rating?: 'positive' | 'negative';
  status?: 'sending' | 'sent' | 'delivered' | 'error';
};

type Notification = {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
};

export default function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pdfContext, setPdfContext] = useState('');
  const [knowledgeBaseInfo, setKnowledgeBaseInfo] = useState<{
    isReady: boolean;
    summary?: string;
    keywords?: string[];
    stats?: { totalChunks: number; avgChunkLength: number; totalWords: number };
  }>({ isReady: false });
  const [lastActivity, setLastActivity] = useState<string>();
  const [showSettings, setShowSettings] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showExport, setShowExport] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K: Focus input
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const input = document.querySelector('input[placeholder="Type your message..."]') as HTMLInputElement;
        input?.focus();
      }
      
      // Cmd/Ctrl + F: Open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        setShowSearch(true);
      }
      
      // Cmd/Ctrl + ,: Open settings
      if ((e.metaKey || e.ctrlKey) && e.key === ',') {
        e.preventDefault();
        setShowSettings(true);
      }
      
      // Escape: Close settings and search
      if (e.key === 'Escape') {
        setShowSettings(false);
        setShowSearch(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Notification functions
  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { ...notification, id }]);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Message rating
  const handleMessageRating = (messageIndex: number, rating: 'positive' | 'negative') => {
    setMessages(prev => prev.map((msg, index) => 
      index === messageIndex ? { ...msg, rating } : msg
    ));
    
    addNotification({
      type: 'success',
      title: 'Feedback Recorded',
      message: `Thank you for rating this ${rating === 'positive' ? 'positively' : 'negatively'}!`,
      duration: 3000
    });
  };

  // New chat
  const handleNewChat = () => {
    setMessages([]);
    setPdfContext('');
    setSearchQuery('');
    addNotification({
      type: 'info',
      title: 'New Chat Started',
      message: 'Previous conversation has been cleared.',
      duration: 2000
    });
  };

  // Load knowledge base info on component mount
  useEffect(() => {
    const loadKnowledgeBaseInfo = async () => {
      try {
        const response = await fetch('/api/knowledge-base');
        if (response.ok) {
          const info = await response.json();
          setKnowledgeBaseInfo(info);
          
          // Knowledge base info loaded, but don't add a message - just update state
        }
      } catch (error) {
        console.error('Failed to load knowledge base info:', error);
      }
    };
    
    loadKnowledgeBaseInfo();
  }, []);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || isLoading) return;

    // Add user message
    const userMessage: Message = {
      text: textToSend,
      isUser: true,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Only clear input if we're using the input field
    if (!messageText) {
      setInput('');
    }
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
        timestamp: new Date().toLocaleTimeString(),
        sources: aiMessage.sources,
        status: 'delivered'
      }]);
      
      setLastActivity(new Date().toLocaleTimeString());
    } catch (error) {
      setMessages(prev => [...prev, {
        text: "Sorry, I couldn't process your request.",
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
        status: 'error'
      }]);
      
      addNotification({
        type: 'error',
        title: 'Message Failed',
        message: 'Unable to get response from AI. Please try again.',
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      setMessages(prev => [...prev, {
        text: `Processing PDF "${file.name}"...`,
        isUser: false,
        timestamp: new Date().toLocaleTimeString()
      }]);

      const formData = new FormData();
      formData.append('pdf', file);

      console.log('📤 Uploading PDF:', file.name, file.size, 'bytes');

      const response = await fetch('/api/process-pdf', {
        method: 'POST',
        body: formData
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', response.headers.get('content-type'));

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('❌ Expected JSON, got:', contentType);
        console.error('❌ Response preview:', textResponse.substring(0, 200));
        throw new Error(`Server returned ${contentType || 'unknown content type'} instead of JSON`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process PDF');
      }

      if (!data.text || data.text.trim().length === 0) {
        throw new Error('PDF contains no extractable text');
      }

      setPdfContext(data.text);
      
      setMessages(prev => [...prev, {
        text: `PDF processed successfully using ${data.method}! Extracted ${data.text.length.toLocaleString()} characters from ${data.pages} pages.`,
        isUser: false,
        timestamp: new Date().toLocaleTimeString()
      }]);

    } catch (error) {
      console.error('PDF upload error:', error);
      setMessages(prev => [...prev, {
        text: error instanceof Error 
          ? `PDF Error: ${error.message}`
          : 'Failed to process PDF',
        isUser: false,
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };  

  return (
    <div className="flex flex-col h-[80vh] max-w-4xl mx-auto bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
      {/* Search Bar */}
      <SearchBar 
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        onSearch={setSearchQuery}
        resultsCount={searchQuery ? messages.filter(msg => 
          msg.text.toLowerCase().includes(searchQuery.toLowerCase())
        ).length : undefined}
      />
      
      {/* Header */}
      <div className="relative px-6 py-4 bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-sm border-b border-slate-700/50">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">AI Assistant</h1>
              <p className="text-xs text-gray-400">Powered by Yandex GPT</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Search Button */}
            <button
              onClick={() => setShowSearch(true)}
              className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700/70 text-gray-300 hover:text-white transition-all duration-200 border border-slate-600/50"
              title="Search messages (Ctrl+F)"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Settings Button */}
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700/70 text-gray-300 hover:text-white transition-all duration-200 border border-slate-600/50"
              title="Settings"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* PDF Upload Button */}
            <label className="relative group cursor-pointer">
              <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Upload PDF</span>
              </div>
              <input 
                type="file" 
                accept=".pdf" 
                onChange={handlePdfUpload}
                className="hidden"
              />
            </label>

            {/* Status indicator */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                knowledgeBaseInfo.isReady ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
              }`}></div>
              <span className="text-xs text-gray-400">
                {knowledgeBaseInfo.isReady ? 'Ready' : 'Loading...'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Context indicators */}
        {(pdfContext || knowledgeBaseInfo.isReady) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {pdfContext && (
              <div className="flex items-center gap-1 bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full border border-blue-500/30">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                </svg>
                <span className="text-xs">PDF: {(pdfContext.length / 1000).toFixed(1)}k chars</span>
              </div>
            )}
            {knowledgeBaseInfo.isReady && (
              <div className="flex items-center gap-1 bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full border border-purple-500/30">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.496 2.132a1 1 0 00-.992 0l-7 4A1 1 0 003 8v7a1 1 0 100 2h14a1 1 0 100-2V8a1 1 0 00.496-1.868l-7-4zM6 9a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-xs">KB: {knowledgeBaseInfo.stats?.totalChunks} chunks</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
        {messages.length === 0 && !isLoading && (
          <WelcomeMessage 
            knowledgeBaseReady={knowledgeBaseInfo.isReady} 
            pdfUploaded={!!pdfContext}
          />
        )}
        {messages.map((msg, i) => (
          <MessageBubble 
            key={i}
            text={msg.text}
            isUser={msg.isUser}
            timestamp={msg.timestamp}
            sources={msg.sources}
            rating={msg.rating}
            onRate={msg.isUser ? undefined : (rating) => handleMessageRating(i, rating)}
          />
        ))}
        <div ref={messagesEndRef} />
        
        {/* Enhanced Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                  <span className="text-sm text-gray-400 ml-2">AI is thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Input Area */}
      <div className="px-6 py-4 bg-slate-800/50 backdrop-blur-sm border-t border-slate-700/50">
        <div className="relative">
          {/* Quick Actions */}
          {messages.length === 0 && !isLoading && (pdfContext || knowledgeBaseInfo.isReady) && (
            <QuickActions onActionClick={handleSend} isLoading={isLoading} />
          )}
          
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                className="w-full bg-slate-700/50 text-white rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-slate-700 transition-all duration-200 placeholder-gray-400 backdrop-blur-sm border border-slate-600/50"
                placeholder="Type your message..."
                disabled={isLoading}
              />
              {input && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <span className="text-xs">{input.length}</span>
                </div>
              )}
            </div>
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 hover:scale-105 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-sm">Sending...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Send</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Status Bar */}
      <StatusBar 
        isConnected={true}
        lastActivity={lastActivity}
        messageCount={messages.length}
        isLoading={isLoading}
      />
      
      {/* Settings Panel */}
      <SettingsPanel 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
      
      {/* Export Dialog */}
      <ExportDialog 
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        messages={messages}
      />
      
      {/* Floating Action Button */}
      <FloatingActionButton 
        onNewChat={handleNewChat}
        onExport={() => setShowExport(true)}
        onSettings={() => setShowSettings(true)}
      />
      
      {/* Notification System */}
      <NotificationSystem 
        notifications={notifications}
        onDismiss={dismissNotification}
      />
    </div>
  );
}