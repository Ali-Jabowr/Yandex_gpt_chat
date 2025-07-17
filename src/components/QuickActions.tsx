'use client';

interface QuickActionsProps {
  onActionClick: (action: string) => void;
  isLoading: boolean;
}

export default function QuickActions({ onActionClick, isLoading }: QuickActionsProps) {
  const actions = [
    {
      id: 'summarize',
      title: 'Summarize',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      ),
      description: 'Get a quick summary',
      prompt: 'Please provide a brief summary of the key points from the available information.'
    },
    {
      id: 'explain',
      title: 'Explain',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      ),
      description: 'Explain concepts',
      prompt: 'Can you explain the main concepts or topics covered in the available information?'
    },
    {
      id: 'analyze',
      title: 'Analyze',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      description: 'Deep analysis',
      prompt: 'Please provide a detailed analysis of the content, including key insights and implications.'
    },
    {
      id: 'questions',
      title: 'Questions',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
        </svg>
      ),
      description: 'Generate questions',
      prompt: 'What are some important questions I should ask about this content?'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={() => onActionClick(action.prompt)}
          disabled={isLoading}
          className="flex flex-col items-center gap-2 p-3 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50 hover:bg-slate-800/70 hover:border-slate-600/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <div className="text-purple-400 group-hover:text-purple-300 transition-colors">
            {action.icon}
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-white group-hover:text-gray-100 transition-colors">
              {action.title}
            </div>
            <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
              {action.description}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}