import React, { useState } from 'react';
import RoastMode from './RoastMode';
import CompareMode from './CompareMode';

export default function Uploader() {
  const [mode, setMode] = useState<'roast' | 'compare'>('roast');

  return (
    <div className="flex flex-col space-y-4 md:space-y-8 relative">
      {/* Mode Toggle */}
      <div className="flex justify-center z-10 relative">
        <div className="bg-beige border border-taupe p-1 flex font-mono text-[10px] md:text-[12px] shadow-sm">
          <button 
            onClick={() => setMode('roast')}
            className={`px-4 py-2 transition-all ${mode === 'roast' ? 'bg-deep-black text-white' : 'text-charcoal hover:bg-white'}`}
          >
            🔥 ROAST SETUP
          </button>
          <button 
            onClick={() => setMode('compare')}
            className={`px-4 py-2 transition-all ${mode === 'compare' ? 'bg-deep-black text-white' : 'text-charcoal hover:bg-white'}`}
          >
            ⚖️ COMPARE BEFORE/AFTER
          </button>
        </div>
      </div>

      {/* Conditionally Render Mode */}
      <div className="w-full">
        {mode === 'roast' ? <RoastMode /> : <CompareMode />}
      </div>
    </div>
  );
}
