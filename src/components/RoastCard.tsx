import React from 'react';

type RoastCardProps = {
  score: string;
  tier: string;
  quote: string;
  image: string;
  cardRef: React.RefObject<HTMLDivElement>;
};

export default function RoastCard({ score, tier, quote, image, cardRef }: RoastCardProps) {
  return (
    <div 
      ref={cardRef}
      className="w-[1080px] h-[1920px] bg-[#0B1012] flex flex-col font-sans relative overflow-hidden"
      style={{ position: 'fixed', left: '-9999px', top: '-9999px' }}
    >
       <div className="flex-1 flex flex-col p-24 justify-between z-10 relative">
          
          {/* Header */}
          <div className="flex justify-between items-start">
             <div className="font-mono text-white text-[48px] font-bold tracking-widest uppercase">
               KEPEEN_AI
             </div>
             <div className="font-mono text-[#D4CEC6] text-[32px] border-2 border-[#D4CEC6] px-6 py-2 uppercase">
               SYSTEM: ROASTED
             </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col items-center justify-center my-auto w-full">
             {/* The Image */}
             <div className="w-[800px] h-[600px] border-[16px] border-white bg-white shadow-[32px_32px_0px_rgba(255,255,255,0.2)] mb-20 relative">
                <img src={image} className="w-full h-full object-cover filter grayscale contrast-125 sepia-[0.3]" alt="roasted setup" />
                <div className="absolute -bottom-12 -right-12 bg-red-600 text-white font-mono text-[80px] font-bold px-10 py-6 border-8 border-[#0B1012] shadow-[16px_16px_0px_rgba(11,16,18,1)] transform rotate-[-10deg]">
                   {tier ? `TIER ${tier}` : 'FAILED'}
                </div>
             </div>

             {/* The Score */}
             <div className="font-sans text-[240px] font-black text-white leading-none tracking-tighter mb-16 text-center">
               {score}
             </div>

             {/* The Quote */}
             <div className="bg-white text-[#0B1012] p-12 w-[900px] border-l-[24px] border-[#0B1012] shadow-[32px_32px_0px_rgba(255,255,255,0.2)]">
                <p className="font-mono text-[40px] font-bold uppercase leading-snug">
                  "{quote.substring(0, 180)}{quote.length > 180 ? '...' : ''}"
                </p>
             </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-end border-t-4 border-[#D4CEC6]/30 pt-8 mt-12 w-full">
             <div className="font-mono text-[#D4CEC6] text-[32px] uppercase tracking-wider">
               ROAST YOUR SETUP. UPGRADE YOUR VIBE.
             </div>
             <div className="font-mono text-white text-[32px] font-bold">
               {new Date().toLocaleDateString('id-ID')}
             </div>
          </div>

       </div>
    </div>
  );
}
