'use client';

interface WelcomeMessageProps {
  knowledgeBaseReady: boolean;
  pdfUploaded: boolean;
}

export default function WelcomeMessage({ knowledgeBaseReady, pdfUploaded }: WelcomeMessageProps) {
  const features = [
    {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      ),
      title: "Ask Questions",
      description: "Get intelligent answers from our AI assistant"
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
        </svg>
      ),
      title: "Upload PDFs",
      description: "Analyze and chat about your documents"
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10.496 2.132a1 1 0 00-.992 0l-7 4A1 1 0 003 8v7a1 1 0 100 2h14a1 1 0 100-2V8a1 1 0 00.496-1.868l-7-4zM6 9a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      ),
      title: "Knowledge Base",
      description: "Access curated information and context"
    }
  ];

  return (
    <div className="text-center py-8 px-4 max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Welcome to your AI Assistant</h2>
        <p className="text-gray-300 text-sm">
          I'm here to help you with questions, document analysis, and more. Let's get started!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {features.map((feature, index) => (
          <div key={index} className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50 hover:bg-slate-800/70 transition-all duration-200">
            <div className="text-purple-400 mb-2 flex justify-center">
              {feature.icon}
            </div>
            <h3 className="text-white font-semibold text-sm mb-1">{feature.title}</h3>
            <p className="text-gray-400 text-xs">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-center gap-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${knowledgeBaseReady ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
          <span className="text-gray-300">
            Knowledge Base: {knowledgeBaseReady ? 'Ready' : 'Loading...'}
          </span>
        </div>
        
        {pdfUploaded && (
          <div className="flex items-center justify-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
            <span className="text-gray-300">PDF document loaded</span>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-indigo-500/10 to-purple-600/10 rounded-lg border border-indigo-500/20">
        <p className="text-sm text-gray-300">
          💡 <strong>Pro tip:</strong> Upload a PDF to get specific insights about your documents, 
          or ask general questions to access the knowledge base.
        </p>
      </div>
    </div>
  );
}