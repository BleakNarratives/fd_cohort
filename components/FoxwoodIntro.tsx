
import React, { useEffect, useState } from 'react';
import { soundService } from '../services/soundService';

interface FoxwoodIntroProps {
  onComplete: () => void;
  isExit?: boolean;
}

export const FoxwoodIntro: React.FC<FoxwoodIntroProps> = ({ onComplete, isExit = false }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    if (!isExit) {
      soundService.playIntroSound();
    }
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 1000);
    }, 3500); // Slightly longer for cinematic effect
    return () => clearTimeout(timer);
  }, [onComplete, isExit]);

  return (
    <div className={`fixed inset-0 z-[9999] bg-[#020617] flex flex-col items-center justify-center transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      
      {/* Secondary Panning Light Source */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-tr from-transparent via-blue-500/10 to-transparent rotate-45 animate-panning-light" />
      </div>

      <div className="relative flex flex-col items-center">
        {/* Anamorphic Lens Flare Burst */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300vw] h-px bg-white/40 blur-[2px] animate-lens-flare" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-24 bg-white rounded-full blur-3xl opacity-40 scale-0 animate-flare-burst" />
        
        <div className="text-4xl font-black tracking-tighter text-white flex items-center gap-2 relative z-10">
           <span className="text-[#d4af37] drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]">FOX</span>WOOD ACADEMY
        </div>
        <div className="h-0.5 w-64 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mt-2 relative overflow-hidden">
           <div className="absolute inset-0 bg-white/50 -translate-x-full animate-progress-glint" />
        </div>
      </div>
      
      <p className="mt-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] animate-fade-in-delayed">
        {isExit ? 'Thanks for Playing' : 'Initiating Executive Environment'}
      </p>
      
      {isExit && (
        <div className="fixed bottom-8 right-8 opacity-30 text-[8px] font-black text-white pointer-events-none">
          FOXWOOD_WATERMARK_V4.5
        </div>
      )}

      <style>{`
        @keyframes panning-light {
          0% { transform: translate(-20%, -20%) rotate(45deg); }
          100% { transform: translate(20%, 20%) rotate(45deg); }
        }
        @keyframes lens-flare {
          0% { width: 0; opacity: 0; }
          20% { width: 300vw; opacity: 0.6; }
          80% { width: 300vw; opacity: 0.6; }
          100% { width: 0; opacity: 0; }
        }
        @keyframes flare-burst {
          0% { scale: 0; opacity: 0; }
          30% { scale: 1.5; opacity: 0.6; }
          100% { scale: 1; opacity: 0; }
        }
        @keyframes progress-glint {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes fade-in-delayed {
          0%, 40% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-panning-light { animation: panning-light 4s ease-in-out infinite alternate; }
        .animate-lens-flare { animation: lens-flare 3.5s ease-in-out forwards; }
        .animate-flare-burst { animation: flare-burst 3.5s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
        .animate-progress-glint { animation: progress-glint 2s ease-in-out infinite; }
        .animate-fade-in-delayed { animation: fade-in-delayed 2s ease-out forwards; }
      `}</style>
    </div>
  );
};
