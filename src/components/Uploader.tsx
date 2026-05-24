import React, { useState } from 'react';
import RoastMode from './RoastMode';
import CompareMode from './CompareMode';
import RateMyPC from './RateMyPC';
import { Flame, GitCompare, Monitor } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Uploader() {
  const [mode, setMode] = useState<'roast' | 'compare' | 'rate-pc'>('roast');

  return (
    <div className="flex flex-col space-y-4 md:space-y-8 relative">
      {/* Mode Toggle */}
      <div className="flex justify-center z-10 relative">
        <div className="bg-beige border border-taupe p-1 flex font-mono text-[10px] md:text-[12px] shadow-sm">
          <button 
            onClick={() => setMode('roast')}
            className={`px-4 py-2 flex items-center gap-1.5 transition-all ${mode === 'roast' ? 'bg-deep-black text-white' : 'text-charcoal hover:bg-white'}`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>ROAST SETUP</span>
          </button>
          <button 
            onClick={() => setMode('compare')}
            className={`px-4 py-2 flex items-center gap-1.5 transition-all ${mode === 'compare' ? 'bg-deep-black text-white' : 'text-charcoal hover:bg-white'}`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>COMPARE BEFORE/AFTER</span>
          </button>
          <button 
            onClick={() => setMode('rate-pc')}
            className={`px-4 py-2 flex items-center gap-1.5 transition-all ${mode === 'rate-pc' ? 'bg-deep-black text-white' : 'text-charcoal hover:bg-white'}`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>RATE MY PC</span>
          </button>
        </div>
      </div>

      {/* Conditionally Render Mode */}
      <div className="w-full relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            {mode === 'roast' ? (
              <RoastMode />
            ) : mode === 'compare' ? (
              <CompareMode />
            ) : (
              <RateMyPC />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
