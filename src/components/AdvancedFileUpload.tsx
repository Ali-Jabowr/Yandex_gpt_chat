'use client';
import { useState, useCallback } from 'react';

interface AdvancedFileUploadProps {
  onFileUpload: (file: File) => void;
  onFileRemove: () => void;
  currentFile?: File;
  isUploading?: boolean;
  uploadProgress?: number;
}

export default function AdvancedFileUpload({
  onFileUpload,
  onFileRemove,
  currentFile,
  isUploading = false,
  uploadProgress = 0
}: AdvancedFileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragCounter(prev => prev + 1);
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragCounter(prev => prev - 1);
    if (dragCounter <= 1) {
      setIsDragging(false);
    }
  }, [dragCounter]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setDragCounter(0);
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');
    
    if (pdfFile) {
      onFileUpload(pdfFile);
    }
  }, [onFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const pdfFile = files.find(file => file.type === 'application/pdf');
    
    if (pdfFile) {
      onFileUpload(pdfFile);
    }
  }, [onFileUpload]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (currentFile) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white truncate">
                  {currentFile.name}
                </p>
                <p className="text-xs text-gray-400">
                  {formatFileSize(currentFile.size)} • PDF
                </p>
              </div>
              
              <button
                onClick={onFileRemove}
                className="p-1 rounded-full hover:bg-slate-700/50 text-gray-400 hover:text-white transition-colors"
                disabled={isUploading}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            {isUploading && (
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 min-w-0">
                    {uploadProgress}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
        isDragging 
          ? 'border-indigo-500 bg-indigo-500/10' 
          : 'border-slate-600 hover:border-slate-500'
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileSelect}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      
      <div className="text-center">
        <div className={`w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center transition-colors ${
          isDragging ? 'bg-indigo-500/20' : 'bg-slate-700/50'
        }`}>
          <svg className={`w-6 h-6 transition-colors ${
            isDragging ? 'text-indigo-400' : 'text-gray-400'
          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        
        <p className={`text-sm font-medium mb-1 transition-colors ${
          isDragging ? 'text-indigo-400' : 'text-white'
        }`}>
          {isDragging ? 'Drop your PDF here' : 'Upload PDF document'}
        </p>
        
        <p className="text-xs text-gray-400">
          Drag and drop or click to select
        </p>
      </div>
    </div>
  );
}