import React from 'react';
import { X, Plus, RotateCcw } from 'lucide-react';

type ImagePanelProps = {
  images: string[];
  onDeleteImage: (imageToRemove: string) => void;
  onAddImage: (slot?: number) => void;
  onReset: () => void;
  disabled: boolean;
  mode?: 'roast' | 'compare';
};

export default function ImagePanel({ images, onDeleteImage, onAddImage, onReset, disabled, mode = 'roast' }: ImagePanelProps) {
  return (
    <div className={`w-full flex flex-col relative h-fit gap-4 ${mode === 'compare' ? '' : 'lg:sticky lg:top-8 lg:w-1/2'}`}>
      <div className="flex justify-between items-end mb-2">
         <h2 className="font-mono text-[12.6px] font-semibold text-deep-black uppercase tracking-wider">
           Setup Reference {mode === 'compare' && <span className="text-charcoal font-normal text-[10px] ml-1">(COMPARE MODE)</span>}
         </h2>
         {images.length < 2 && (
           <button 
             onClick={() => onAddImage()}
             disabled={disabled}
             className="flex items-center gap-1 text-charcoal hover:text-deep-black transition-colors font-mono text-[10.8px] disabled:opacity-50"
           >
             <Plus className="w-3 h-3" /> ADD IMAGE
           </button>
         )}
      </div>
      
      {mode === 'compare' ? (
        <div className="flex flex-col md:flex-row gap-4">
          {/* Slot 1: BEFORE */}
          {images[0] ? (
            <div className="relative group flex-1" data-slot="0">
              <img src={images[0]} alt="Setup Before" className="w-full h-auto border border-taupe object-cover shadow-sm" loading="lazy" />
              <div className="absolute top-2 left-2 bg-deep-black/90 text-white px-2 py-1 font-mono text-[10px] uppercase shadow-sm">
                📷 BEFORE
              </div>
              <button 
                onClick={() => onDeleteImage(images[0])}
                disabled={disabled}
                className="absolute top-2 right-2 bg-deep-black text-white p-2 border border-deep-black hover:bg-white hover:text-deep-black transition-all shadow-sm disabled:opacity-50 lg:opacity-0 lg:group-hover:opacity-100"
                title="Delete image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => onAddImage(0)}
              data-slot="0"
              className={`flex-1 aspect-[4/3] bg-beige border-2 border-dashed border-taupe flex flex-col items-center justify-center text-taupe font-mono text-sm gap-2 cursor-pointer hover:bg-white transition-colors ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <div className="bg-deep-black text-white px-2 py-1 font-mono text-[10px] uppercase shadow-sm">📷 BEFORE</div>
              <Plus className="w-6 h-6 mt-2 text-charcoal" />
              <p>Upload BEFORE image</p>
            </div>
          )}

          {/* Slot 2: AFTER */}
          {images[1] ? (
            <div className="relative group flex-1" data-slot="1">
              <img src={images[1]} alt="Setup After" className="w-full h-auto border border-taupe object-cover shadow-sm" loading="lazy" />
              <div className="absolute top-2 left-2 bg-deep-black/90 text-white px-2 py-1 font-mono text-[10px] uppercase shadow-sm">
                📸 AFTER
              </div>
              <button 
                onClick={() => onDeleteImage(images[1])}
                disabled={disabled}
                className="absolute top-2 right-2 bg-deep-black text-white p-2 border border-deep-black hover:bg-white hover:text-deep-black transition-all shadow-sm disabled:opacity-50 lg:opacity-0 lg:group-hover:opacity-100"
                title="Delete image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => onAddImage(1)}
              data-slot="1"
              className={`flex-1 aspect-[4/3] bg-beige border-2 border-dashed border-taupe flex flex-col items-center justify-center text-taupe font-mono text-sm gap-2 cursor-pointer hover:bg-white transition-colors ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <div className="bg-deep-black text-white px-2 py-1 font-mono text-[10px] uppercase shadow-sm">📸 AFTER</div>
              <Plus className="w-6 h-6 mt-2 text-charcoal" />
              <p>Upload AFTER image</p>
            </div>
          )}
        </div>
      ) : images.length > 0 ? (
        <div className="flex flex-col gap-4">
          {images.map((img, idx) => (
            <div key={idx} className="relative group">
              <img src={img} alt={`Setup ${idx+1}`} className="w-full h-auto border border-taupe object-cover shadow-sm" loading="lazy" />
              <div className="absolute top-2 left-2 bg-deep-black/90 text-white px-2 py-1 font-mono text-[10px] uppercase shadow-sm">
                IMAGE {idx + 1}
              </div>
              <button 
                onClick={() => onDeleteImage(img)}
                disabled={disabled}
                className="absolute top-2 right-2 bg-deep-black text-white p-2 border border-deep-black hover:bg-white hover:text-deep-black transition-all shadow-sm disabled:opacity-50 lg:opacity-0 lg:group-hover:opacity-100"
                title="Delete image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full aspect-video bg-beige border border-taupe flex flex-col items-center justify-center text-taupe font-mono text-sm gap-4">
          <p>No images provided</p>
          <button 
             onClick={() => onAddImage()}
             disabled={disabled}
             className="flex items-center gap-2 border border-taupe px-4 py-2 hover:bg-white transition-all text-deep-black bg-white shadow-sm"
          >
             <Plus className="w-4 h-4" /> UPLOAD IMAGE
          </button>
        </div>
      )}
      
      <button 
        onClick={onReset}
        disabled={disabled}
        className="mt-4 flex items-center justify-center gap-2 w-full bg-transparent text-charcoal font-mono text-[10.8px] font-medium leading-[9px] py-[13.5px] border border-transparent hover:border-taupe hover:bg-beige transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <RotateCcw className="w-3 h-3" /> RESET ALL CHAT & IMAGES
      </button>
    </div>
  );
}
