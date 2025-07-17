'use client';

interface StatusBarProps {
  isConnected: boolean;
  lastActivity?: string;
  messageCount: number;
  isLoading: boolean;
}

export default function StatusBar({ isConnected, lastActivity, messageCount, isLoading }: StatusBarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-slate-800/30 backdrop-blur-sm border-t border-slate-700/30 text-xs">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-green-400' : 'bg-red-400'
          } ${isLoading ? 'animate-pulse' : ''}`}></div>
          <span className="text-gray-400">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          <span className="text-gray-400">{messageCount} messages</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {lastActivity && (
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-400">Last: {lastActivity}</span>
          </div>
        )}
        
        <div className="flex items-center gap-1">
          <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
          </svg>
          <span className="text-gray-400">Yandex GPT</span>
        </div>
      </div>
    </div>
  );
}