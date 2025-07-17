'use client';
import { useState } from 'react';

type Message = {
  text: string;
  isUser: boolean;
  timestamp: string;
  sources?: string[];
};

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
}

export default function ExportDialog({ isOpen, onClose, messages }: ExportDialogProps) {
  const [exportFormat, setExportFormat] = useState<'txt' | 'json' | 'md'>('txt');
  const [includeTimestamps, setIncludeTimestamps] = useState(true);
  const [includeSources, setIncludeSources] = useState(true);

  const generateExport = () => {
    if (exportFormat === 'txt') {
      return messages.map(msg => {
        let output = `${msg.isUser ? 'You' : 'AI'}${includeTimestamps ? ` (${msg.timestamp})` : ''}: ${msg.text}`;
        if (includeSources && msg.sources && msg.sources.length > 0) {
          output += `\nSources: ${msg.sources.join(', ')}`;
        }
        return output;
      }).join('\n\n');
    }
    
    if (exportFormat === 'json') {
      return JSON.stringify(messages, null, 2);
    }
    
    if (exportFormat === 'md') {
      return messages.map(msg => {
        let output = `## ${msg.isUser ? 'You' : 'AI Assistant'}${includeTimestamps ? ` *(${msg.timestamp})*` : ''}\n\n${msg.text}`;
        if (includeSources && msg.sources && msg.sources.length > 0) {
          output += `\n\n**Sources:** ${msg.sources.join(', ')}`;
        }
        return output;
      }).join('\n\n---\n\n');
    }
    
    return '';
  };

  const handleExport = () => {
    const content = generateExport();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${new Date().toISOString().split('T')[0]}.${exportFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700/50 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <h2 className="text-xl font-semibold text-white">Export Chat</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800/50 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Format</label>
            <div className="space-y-2">
              {[
                { value: 'txt', label: 'Text (.txt)', desc: 'Plain text format' },
                { value: 'json', label: 'JSON (.json)', desc: 'Structured data format' },
                { value: 'md', label: 'Markdown (.md)', desc: 'Formatted text with headers' }
              ].map(({ value, label, desc }) => (
                <label key={value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    value={value}
                    checked={exportFormat === value}
                    onChange={(e) => setExportFormat(e.target.value as any)}
                    className="w-4 h-4 text-indigo-600 bg-slate-700 border-slate-600 focus:ring-indigo-500"
                  />
                  <div>
                    <div className="text-sm font-medium text-white">{label}</div>
                    <div className="text-xs text-gray-400">{desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">Options</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeTimestamps}
                  onChange={(e) => setIncludeTimestamps(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 bg-slate-700 border-slate-600 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-300">Include timestamps</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSources}
                  onChange={(e) => setIncludeSources(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 bg-slate-700 border-slate-600 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-300">Include sources</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-700/50">
            <button 
              onClick={onClose}
              className="flex-1 bg-slate-700/50 hover:bg-slate-700/70 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleExport}
              className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-2 px-4 rounded-lg transition-all"
            >
              Export ({messages.length} messages)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}