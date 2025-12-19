import React from 'react';

interface ResultDisplayProps {
  imageUrl: string | null;
  isLoading: boolean;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ imageUrl, isLoading }) => {
  if (!imageUrl && !isLoading) return null;

  return (
    <div className="flex flex-col items-center justify-center w-full mt-8 animate-fade-in">
      <div className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        Generated Result
        {isLoading && (
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
        )}
      </div>

      <div className="relative w-full max-w-sm aspect-[3/4] bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center gap-3 p-8">
            <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 text-sm font-medium animate-pulse">Processing ID photo...</p>
          </div>
        ) : imageUrl ? (
          <img 
            src={imageUrl} 
            alt="Generated ID Photo" 
            className="w-full h-full object-contain bg-slate-50"
          />
        ) : null}
      </div>

      {imageUrl && !isLoading && (
        <a 
          href={imageUrl} 
          download="modified-id-photo.png"
          className="mt-6 flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-md transition-all hover:shadow-lg active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" x2="12" y1="15" y2="3"/>
          </svg>
          Download Photo
        </a>
      )}
    </div>
  );
};