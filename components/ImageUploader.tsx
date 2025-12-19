import React, { ChangeEvent } from 'react';
import { ImageState } from '../types';

interface ImageUploaderProps {
  label: string;
  description: string;
  imageState: ImageState;
  onImageUpload: (image: ImageState) => void;
  onClear: () => void;
  id: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  description,
  imageState,
  onImageUpload,
  onClear,
  id
}) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      onImageUpload({
        file,
        previewUrl: URL.createObjectURL(file),
        base64
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-semibold text-slate-700 block mb-1">
        {label}
      </label>
      
      {imageState.previewUrl ? (
        <div className="relative w-full aspect-[3/4] bg-slate-100 rounded-xl overflow-hidden border-2 border-slate-200 group">
          <img 
            src={imageState.previewUrl} 
            alt={label} 
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClear}
            className="absolute top-2 right-2 bg-white/90 hover:bg-red-50 text-slate-600 hover:text-red-600 p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200"
            title="Remove image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>
      ) : (
        <label 
          htmlFor={id}
          className="flex flex-col items-center justify-center w-full aspect-[3/4] border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors duration-200"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
            <div className="w-10 h-10 mb-3 text-slate-400 bg-white rounded-full flex items-center justify-center shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
              </svg>
            </div>
            <p className="mb-1 text-sm font-medium text-slate-700">Click to upload</p>
            <p className="text-xs text-slate-500">{description}</p>
          </div>
          <input 
            id={id} 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileChange}
          />
        </label>
      )}
    </div>
  );
};