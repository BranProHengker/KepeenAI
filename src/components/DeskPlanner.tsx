import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

type DeskPlannerProps = {
  loading: boolean;
  onSubmit: (deskSize: string, items: string, theme: string) => void;
};

export default function DeskPlanner({ loading, onSubmit }: DeskPlannerProps) {
  const [deskSize, setDeskSize] = useState('');
  const [items, setItems] = useState('');
  const [theme, setTheme] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deskSize.trim() || !items.trim() || !theme.trim() || loading) return;
    onSubmit(deskSize, items, theme);
    setDeskSize('');
    setItems('');
    setTheme('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-taupe p-6 flex flex-col gap-4 bg-white mt-4 text-left">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-deep-black" />
        <h4 className="font-mono text-[11px] font-bold text-deep-black uppercase tracking-wider">Desk Planner AI</h4>
      </div>
      <p className="font-sans text-[13px] text-charcoal leading-relaxed">
        Punya rencana beres-beres meja? Tulis spek meja lu, AI bakal kasih layout workspace yang paling ergonomis dan aesthetic.
      </p>
      
      <div className="flex flex-col">
        <label className="font-mono text-[9px] font-bold uppercase text-charcoal mb-1.5">Ukuran Meja (Lebar x Dalam)</label>
        <input 
          type="text" 
          value={deskSize}
          onChange={(e) => setDeskSize(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. 120x60 cm / 150x80 cm"
          className="bg-beige border border-taupe p-2.5 font-sans text-[14px] text-deep-black focus:outline-none focus:border-deep-black transition-all"
        />
      </div>

      <div className="flex flex-col">
        <label className="font-mono text-[9px] font-bold uppercase text-charcoal mb-1.5">Barang yang Pengen Ditaruh</label>
        <input 
          type="text" 
          value={items}
          onChange={(e) => setItems(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Monitor 27', laptop, mech keyb, mouse, lightbar"
          className="bg-beige border border-taupe p-2.5 font-sans text-[14px] text-deep-black focus:outline-none focus:border-deep-black transition-all"
        />
      </div>

      <div className="flex flex-col">
        <label className="font-mono text-[9px] font-bold uppercase text-charcoal mb-1.5">Tema Setup / Aesthetic</label>
        <input 
          type="text" 
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Minimalist Monokrom, Cozy Warm Wood, RGB Cyberpunk"
          className="bg-beige border border-taupe p-2.5 font-sans text-[14px] text-deep-black focus:outline-none focus:border-deep-black transition-all"
        />
      </div>

      <button 
        type="submit"
        disabled={loading || !deskSize.trim() || !items.trim() || !theme.trim()}
        className="bg-deep-black text-white py-2.5 font-mono text-[10.8px] font-bold uppercase hover:bg-charcoal transition-all disabled:opacity-50 tracking-wider flex items-center justify-center gap-1.5"
      >
        <span>GET DESK LAYOUT</span>
      </button>
    </form>
  );
}
