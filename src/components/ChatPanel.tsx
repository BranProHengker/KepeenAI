import React, { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { MousePointer2, Download } from 'lucide-react';
import type { Message } from '../types';
import html2canvas from 'html2canvas';
import RoastCard from './RoastCard';

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
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Helper to extract all scores from the chat history for messages that still have active images
  const getScores = () => {
    const scores: { index: number; score: string; isGlowUp: boolean }[] = [];
    let ratingCount = 0;
    
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      if (msg.role === 'model') {
        const scoreMatch = msg.text.match(/(?:STRUCTURAL SCORE|SCORE|GLOW-UP SCORE):[\s\*]*(\d+\/100(?:[\s\*]*\(?Tier\s+[SABCF]\)?)?)/i);
        const isGlowUp = msg.text.match(/GLOW-UP SCORE/i);
        
        if (scoreMatch) {
          // Find the user message before this model message that had images
          let hasImage = false;
          for (let j = i - 1; j >= 0; j--) {
            if (messages[j].role === 'user') {
              if (messages[j].images && messages[j].images!.length > 0) {
                hasImage = true;
              }
              break; // Stop at the nearest user message
            }
          }
          
          if (hasImage) {
            ratingCount++;
            scores.push({
              index: ratingCount,
              score: scoreMatch[1],
              isGlowUp: !!isGlowUp
            });
          }
        }
      }
    }
    return scores;
  };

  const generatePreview = async () => {
    if (!cardRef.current || isExporting) return;
    setIsExporting(true);
    try {
      // Use scale: 2 for high-resolution crisp poster!
      const canvas = await html2canvas(cardRef.current, { scale: 2, useCORS: true });
      const dataUrl = canvas.toDataURL('image/png');
      setPreviewImage(dataUrl);
    } catch (e) {
      console.error(e);
      alert("Gagal membuat preview poster ngab!");
    } finally {
      setIsExporting(false);
    }
  };

  const downloadPoster = () => {
    if (!previewImage) return;
    const link = document.createElement('a');
    link.download = `kepeenAI-roast-${Date.now()}.png`;
    link.href = previewImage;
    link.click();
    setPreviewImage(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className={`w-full bg-beige p-0 border border-taupe flex flex-col ${messages.length === 0 ? 'h-fit' : 'h-[75vh] min-h-[600px]'} ${mode === 'compare' ? '' : 'lg:w-1/2'}`}>
      {/* Header */}
      <div className="border-b border-taupe p-5 bg-white flex flex-col gap-2">
        <div className="flex justify-between items-center w-full gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="font-mono text-[12.6px] font-semibold text-deep-black uppercase tracking-wider">Analysis & Chat Log</h2>
            {/* Rating History */}
            {(() => {
              const scores = getScores();
              if (scores.length > 1) {
                return (
                  <div className="flex flex-wrap gap-1.5 mt-1 items-center">
                    <span className="font-mono text-[10px] text-charcoal font-bold uppercase mr-1">History:</span>
                    {scores.map((s, idx) => (
                      <span 
                        key={idx} 
                        className={`font-mono text-[9px] px-1.5 py-0.5 border ${
                          idx === scores.length - 1 
                            ? 'border-deep-black bg-deep-black text-white font-bold' 
                            : 'border-taupe bg-beige text-charcoal'
                        }`}
                      >
                        #{s.index}: {s.score.replace(/\s+/g, '')}
                      </span>
                    ))}
                  </div>
                );
              }
              return null;
            })()}
          </div>
          
          {(() => {
            const scores = getScores();
            if (scores.length > 0) {
              const latestScore = scores[scores.length - 1];
              return (
                <div className="text-right">
                  <span className="font-mono text-[10px] text-taupe block mb-0.5">
                    {latestScore.isGlowUp ? 'GLOW-UP SCORE' : 'STRUCTURAL SCORE'}
                  </span>
                  <span className="font-sans text-[20px] md:text-[24px] font-bold text-deep-black leading-none whitespace-nowrap">
                    {latestScore.score}
                  </span>
                </div>
              );
            }
            return null;
          })()}
        </div>

        {/* Export Button row to avoid header squishing */}
        {(() => {
          const scores = getScores();
          if (scores.length > 0 && mode === 'roast') {
            return (
              <div className="flex justify-end mt-1">
                <button 
                  onClick={generatePreview}
                  disabled={isExporting}
                  className="bg-deep-black text-white px-3 py-1.5 font-mono text-[10px] flex items-center gap-1.5 hover:bg-charcoal transition-colors disabled:opacity-50 w-full sm:w-auto justify-center"
                  title="Share Roast Card"
                >
                  <Download className="w-3 h-3" /> 
                  {isExporting ? 'EXPORTING...' : 'EXPORT POSTER'}
                </button>
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

      {/* Render RoastCard offscreen for export */}
      {(() => {
         let latestScore = '';
         let latestTier = '';
         let latestQuote = '';
         let latestImage = '';
         
         for (let i = messages.length - 1; i >= 0; i--) {
           const msg = messages[i];
           if (msg.role === 'model') {
             const scoreMatch = msg.text.match(/(?:STRUCTURAL SCORE|SCORE):[\s\*]*(\d+\/100(?:[\s\*]*\(?Tier\s+([SABCF])\)?)?)/i);
             if (scoreMatch) {
               let userImg = '';
               for (let j = i - 1; j >= 0; j--) {
                 if (messages[j].role === 'user') {
                   if (messages[j].images && messages[j].images!.length > 0) {
                     userImg = messages[j].images![0];
                   }
                   break;
                 }
               }
               
               if (userImg) {
                 latestScore = scoreMatch[1].split('(')[0].trim();
                 latestTier = scoreMatch[2] || '';
                 latestQuote = msg.text.split('\n').find(line => line.trim().length > 20 && !line.includes('SCORE') && !line.includes('**'))?.replace(/[*_#`~]/g, '') || "Setup ini terlalu parah untuk dideskripsikan oleh AI.";
                 latestImage = userImg;
                 break;
               }
             }
           }
         }

         if (latestScore && latestImage) {
           return <RoastCard score={latestScore} tier={latestTier} quote={latestQuote} image={latestImage} cardRef={cardRef} />;
         }
         return null;
      })()}

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
            className="bg-deep-black text-white h-[60px] px-8 font-mono text-[14px] font-bold tracking-wider hover:bg-charcoal active:bg-[#050607] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center border border-deep-black min-w-[140px]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <MousePointer2 className="w-4 h-4 animate-spin" />
                LOADING
              </span>
            ) : (
              "SEND"
            )}
          </button>
        </div>
      </div>

      {/* Poster Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-[1000] bg-deep-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-beige border border-taupe max-w-[90vw] md:max-w-[450px] w-full flex flex-col shadow-2xl animate-[fadeIn_0.2s_ease-out]">
            {/* Modal Header */}
            <div className="border-b border-taupe p-4 bg-white flex justify-between items-center">
              <span className="font-mono text-[12px] font-bold text-deep-black tracking-wider uppercase">Poster Preview</span>
              <button 
                onClick={() => setPreviewImage(null)}
                className="text-taupe hover:text-deep-black font-mono text-[12px] font-bold uppercase transition-colors"
              >
                Close [X]
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 flex-1 overflow-y-auto max-h-[60vh] flex items-center justify-center bg-charcoal/5">
              <img 
                src={previewImage} 
                alt="Roast Card Preview" 
                className="max-h-[50vh] w-auto border border-taupe shadow-md object-contain"
              />
            </div>
            
            {/* Modal Footer */}
            <div className="border-t border-taupe p-4 bg-white flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={() => setPreviewImage(null)}
                className="px-4 py-2 border border-taupe text-charcoal font-mono text-[12px] hover:bg-beige transition-colors uppercase font-bold"
              >
                Cancel
              </button>
              <button
                onClick={downloadPoster}
                className="px-6 py-2 bg-deep-black text-white border border-deep-black font-mono text-[12px] hover:bg-charcoal transition-colors uppercase font-bold flex items-center justify-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                Download Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
