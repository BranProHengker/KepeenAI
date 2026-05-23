import React, { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { MousePointer2 } from 'lucide-react';
import type { Message } from '../types';

// Markdown components for "raw document" styling
const MarkdownComponents = {
  p: (props: any) => <p className="mb-4 last:mb-0" {...props} />,
  strong: (props: any) => <strong className="font-bold text-deep-black" {...props} />,
  ul: (props: any) => <ul className="list-disc pl-5 mb-4 space-y-2 marker:text-charcoal" {...props} />,
  ol: (props: any) => <ol className="list-decimal pl-5 mb-4 space-y-2 marker:text-charcoal font-mono text-sm" {...props} />,
  li: (props: any) => <li className="pl-1" {...props} />,
  h1: (props: any) => <h1 className="font-mono text-xl font-bold mb-4 uppercase text-deep-black" {...props} />,
  h2: (props: any) => <h2 className="font-mono text-lg font-bold mb-3 uppercase text-deep-black" {...props} />,
  h3: (props: any) => <h3 className="font-mono text-base font-bold mb-2 uppercase text-deep-black" {...props} />,
};

type ChatPanelProps = {
  messages: Message[];
  pendingImagesCount: number;
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  loading: boolean;
  mode?: 'roast' | 'compare';
};

export default function ChatPanel({ messages, pendingImagesCount, input, setInput, onSend, loading, mode = 'roast' }: ChatPanelProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className={`w-full bg-beige p-0 border border-taupe flex flex-col ${messages.length === 0 ? 'h-fit' : 'h-[75vh] min-h-[600px]'} ${mode === 'compare' ? '' : 'lg:w-1/2'}`}>
      {/* Header */}
      <div className="border-b border-taupe p-5 bg-white flex justify-between items-start">
        <h2 className="font-mono text-[12.6px] font-semibold text-deep-black uppercase tracking-wider mt-2">Analysis & Chat Log</h2>
        {(() => {
          const firstAiMessage = messages.find(m => m.role === 'model')?.text || '';
          const scoreMatch = firstAiMessage.match(/(?:STRUCTURAL SCORE|SCORE|GLOW-UP SCORE):[\s\*]*(\d+\/100(?:[\s\*]*\(?Tier\s+[SABCF]\)?)?)/i);
          const isGlowUp = firstAiMessage.match(/GLOW-UP SCORE/i);
          
          if (scoreMatch) {
            return (
              <div className="flex flex-col items-end text-right">
                <span className="font-mono text-[10.8px] text-taupe block mb-1">
                  {isGlowUp ? 'GLOW-UP SCORE' : 'STRUCTURAL SCORE'}
                </span>
                <span className="font-sans text-[24px] md:text-[28px] font-bold text-deep-black leading-none">{scoreMatch[1]}</span>
              </div>
            );
          }
          return null;
        })()}
      </div>

      {/* Chat History */}
      <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-10">
        {messages.length === 0 && pendingImagesCount > 0 && (
           <div className="flex flex-col items-start justify-center h-full opacity-60 text-left">
             <p className="font-mono text-[14px] text-deep-black mb-2 uppercase tracking-wider">Image Ready</p>
             <p className="font-sans text-[16px] text-charcoal">
               Add a description below and hit SEND to start the roast session.
             </p>
           </div>
        )}

        {messages.map((msg, idx) => {
          let displayText = msg.text;
           if (msg.role === 'model') {
             displayText = displayText.replace(/\*?\*?(?:STRUCTURAL SCORE|SCORE|GLOW-UP SCORE):\*?\*?[\s\*]*\d+\/100(?:[\s\*]*\(?Tier\s+[SABCF]\)?)?\*?\*?\n*/ig, '');
          }

          return (
            <div key={idx} className="flex flex-col gap-3">
              <span className={`font-mono text-[10px] tracking-widest font-bold uppercase ${msg.role === 'user' ? 'text-deep-black' : 'text-taupe'}`}>
                {msg.role === 'user' ? '> USER' : '> KEPEENAI'}
              </span>
              
              <div className={`font-sans text-[16px] leading-[26px] ${msg.role === 'user' ? 'text-deep-black font-medium pl-4 border-l-2 border-deep-black' : 'text-charcoal'}`}>
                {msg.role === 'user' ? (
                  <p className="whitespace-pre-wrap">{msg.text || "(Image attached)"}</p>
                ) : (
                  <ReactMarkdown components={MarkdownComponents}>{displayText.trim()}</ReactMarkdown>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex flex-col gap-3">
             <span className="font-mono text-[10px] text-taupe tracking-widest font-bold uppercase">&gt; KEPEENAI</span>
             <div className="flex items-center gap-4 text-charcoal bg-white/50 p-4 border border-taupe/30">
               <MousePointer2 className="w-4 h-4 animate-[spin_2s_linear_infinite] text-deep-black" />
               <span className="font-mono text-[12.6px] uppercase tracking-wider">Generating response...</span>
             </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-taupe bg-white p-4">
        <div className="flex gap-4 items-end">
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={messages.length === 0 ? (mode === 'compare' ? "Ceritain perubahannya..." : "Describe your setup...") : "Reply to kepeenAI..."}
            className="flex-1 bg-beige border border-taupe p-4 font-sans text-[16px] text-deep-black focus:outline-none focus:border-deep-black focus:ring-1 focus:ring-deep-black resize-none min-h-[60px] max-h-[150px] transition-all"
            rows={input.split('\n').length > 1 ? Math.min(input.split('\n').length, 5) : 1}
          />
          <button
            onClick={onSend}
            disabled={loading || (!input.trim() && pendingImagesCount === 0)}
            className="bg-deep-black text-white h-[60px] px-8 font-mono text-[14px] font-bold tracking-wider hover:bg-charcoal active:bg-[#050607] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center border border-deep-black"
          >
            SEND
          </button>
        </div>
      </div>
    </div>
  );
}
