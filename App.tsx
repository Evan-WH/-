import React, { useState } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { ImageState, ProcessingStatus } from './types';
import { generateIDPhoto } from './services/geminiService';

const App: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<ImageState>({ file: null, previewUrl: null, base64: null });
  const [templateImage, setTemplateImage] = useState<ImageState>({ file: null, previewUrl: null, base64: null });
  const [status, setStatus] = useState<ProcessingStatus>(ProcessingStatus.IDLE);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleProcess = async () => {
    if (!sourceImage.base64 || !templateImage.base64) {
      setErrorMessage("Please upload both the source photo and the color template.");
      return;
    }

    setStatus(ProcessingStatus.PROCESSING);
    setErrorMessage(null);
    setResultUrl(null);

    try {
      const generatedImage = await generateIDPhoto(sourceImage.base64, templateImage.base64);
      setResultUrl(generatedImage);
      setStatus(ProcessingStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(ProcessingStatus.ERROR);
      setErrorMessage(error instanceof Error ? error.message : "Failed to generate image. Please try again.");
    }
  };

  const isReady = sourceImage.file !== null && templateImage.file !== null;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 text-blue-700 rounded-2xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
              <circle cx="9" cy="9" r="2"/>
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 tracking-tight">
            ID Photo Color Matcher
          </h1>
          <p className="text-slate-600 max-w-lg mx-auto text-lg">
            Upload your photo and a color template. We'll replace your background to match the template instantly.
          </p>
        </header>

        {/* Main Interface */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          
          {/* Upload Section */}
          <div className="p-6 md:p-10 border-b border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              
              <ImageUploader 
                id="source-upload"
                label="1. Original Photo" 
                description="Upload the photo you want to edit (Portrait/ID)."
                imageState={sourceImage}
                onImageUpload={setSourceImage}
                onClear={() => {
                  setSourceImage({ file: null, previewUrl: null, base64: null });
                  setResultUrl(null);
                }}
              />

              <div className="relative">
                <div className="absolute top-1/2 -left-6 md:-left-6 transform -translate-y-1/2 z-10 hidden md:block text-slate-300">
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </div>
                <ImageUploader 
                  id="template-upload"
                  label="2. Color Template" 
                  description="Upload a reference photo with the desired background color."
                  imageState={templateImage}
                  onImageUpload={setTemplateImage}
                  onClear={() => {
                    setTemplateImage({ file: null, previewUrl: null, base64: null });
                    setResultUrl(null);
                  }}
                />
              </div>

            </div>
          </div>

          {/* Action Section */}
          <div className="bg-slate-50/50 p-6 flex flex-col items-center justify-center">
            {errorMessage && (
              <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm w-full max-w-lg text-center border border-red-100">
                {errorMessage}
              </div>
            )}
            
            <button
              onClick={handleProcess}
              disabled={!isReady || status === ProcessingStatus.PROCESSING}
              className={`
                group relative px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 w-full max-w-xs
                ${!isReady || status === ProcessingStatus.PROCESSING
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl hover:-translate-y-0.5'
                }
              `}
            >
              <span className="flex items-center justify-center gap-2">
                {status === ProcessingStatus.PROCESSING ? 'Processing...' : 'Generate New ID Photo'}
                {!isReady && status !== ProcessingStatus.PROCESSING && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><path d="M12 5v14M5 12h14"/></svg>
                )}
                {isReady && status !== ProcessingStatus.PROCESSING && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8"/><path d="M3 16.2V21m0 0h4.8M3 21l6-6"/><path d="M21 7.8V3m0 0h-4.8M21 3l-6 6"/><path d="M3 7.8V3m0 0h4.8M3 3l6 6"/></svg>
                )}
              </span>
            </button>
          </div>

          {/* Result Section */}
          <div className={`transition-all duration-500 ease-in-out ${resultUrl || status === ProcessingStatus.PROCESSING ? 'max-h-[800px] opacity-100 py-8 border-t border-slate-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
             <ResultDisplay imageUrl={resultUrl} isLoading={status === ProcessingStatus.PROCESSING} />
          </div>

        </div>

        <p className="text-center text-slate-400 text-sm mt-8">
          Powered by Gemini 2.5 Flash Image. Photos are processed securely.
        </p>

      </div>
    </div>
  );
};

export default App;