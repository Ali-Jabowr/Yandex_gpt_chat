'use client';
import { useState } from 'react';
import { useTheme } from './ThemeProvider';

export default function ThemeSelector() {
  const { theme, setTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const currentTheme = themes[theme];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700/70 text-gray-300 hover:text-white transition-all duration-200 border border-slate-600/50 flex items-center gap-2"
        title="Change theme"
      >
        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        <span className="text-sm hidden sm:inline">{currentTheme.name}</span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-slate-900/95 backdrop-blur-md rounded-lg border border-slate-700/50 shadow-xl z-50">
          <div className="p-4">
            <h3 className="text-sm font-medium text-white mb-3">Choose Theme</h3>
            <div className="space-y-2">
              {Object.entries(themes).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => {
                    setTheme(key as any);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                    theme === key
                      ? 'bg-indigo-500/20 border border-indigo-500/30'
                      : 'hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <div className="relative">
                    <div className={`w-8 h-8 rounded-lg ${config.gradient}`}></div>
                    {theme === key && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-white">{config.name}</div>
                    <div className="text-xs text-gray-400">
                      {key === 'dark' && 'Classic dark theme'}
                      {key === 'light' && 'Clean light theme'}
                      {key === 'purple' && 'Rich purple tones'}
                      {key === 'ocean' && 'Calm blue hues'}
                      {key === 'forest' && 'Natural green shades'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}