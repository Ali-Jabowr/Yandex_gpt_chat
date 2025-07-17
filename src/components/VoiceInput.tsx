'use client';
import { useState, useRef, useEffect } from 'react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  isEnabled?: boolean;
}

export default function VoiceInput({ onTranscript, isEnabled = true }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    // Check if Speech Recognition is supported
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSupported(true);
        recognitionRef.current = new SpeechRecognition();
        
        const recognition = recognitionRef.current;
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        recognition.onstart = () => {
          setIsListening(true);
        };
        
        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = '';
          let interimTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }
          
          setTranscript(finalTranscript || interimTranscript);
          
          if (finalTranscript) {
            onTranscript(finalTranscript);
            setTranscript('');
          }
        };
        
        recognition.onend = () => {
          setIsListening(false);
          setTranscript('');
        };
        
        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          setTranscript('');
        };
      }
    }
  }, [onTranscript]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isSupported || !isEnabled) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={toggleListening}
        className={`p-2 rounded-lg transition-all duration-200 ${
          isListening
            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
            : 'bg-slate-700/50 hover:bg-slate-700/70 text-gray-300 hover:text-white border border-slate-600/50'
        }`}
        title={isListening ? 'Stop recording' : 'Start voice input'}
      >
        {isListening ? (
          <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {/* Visual feedback */}
      {isListening && (
        <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
      )}

      {/* Transcript preview */}
      {transcript && (
        <div className="absolute bottom-full right-0 mb-2 p-2 bg-slate-800/95 backdrop-blur-sm rounded-lg border border-slate-700/50 min-w-48 max-w-64">
          <div className="text-xs text-gray-400 mb-1">Listening...</div>
          <div className="text-sm text-white">{transcript}</div>
        </div>
      )}
    </div>
  );
}

// Type declarations for Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}