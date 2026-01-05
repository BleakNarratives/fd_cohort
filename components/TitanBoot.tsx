
import React, { useState } from 'react';
import { soundService } from '../services/soundService';
import { ArrowRight, Zap, Globe, ShieldCheck } from 'lucide-react';

interface TitanBootProps {
  onComplete: () => void;
}

export const TitanBoot: React.FC<TitanBootProps> = ({ onComplete }) => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleBoot = () => {
    setIsInitializing(true);
    soundService.resume().then(() => {
      soundService.playPowerUp();
    }).finally(() => {
      setIsExiting(true);
      setTimeout(onComplete, 800);
    });
  };

  return (
    <div className={`fixed inset-0 z-[99999] bg-slate-950 flex flex-col items-center justify-center p-8 transition-all duration-1000 ease-in-out ${isExiting ? 'opacity-0 scale-105 blur-2xl pointer-events-none' : 'opacity-100 scale-100'}`}>
      
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(0,79,182,0.15)_0%,transparent_70%)] animate-pulse" />
      </div>

      <div className="relative flex flex-col items-center max-w-3xl w-full text-center space-y-16">
        
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-4 text-[#004fb6] font-black tracking-[1em] uppercase text-[10px] mb-4">
            <Globe size={16} className="animate-spin-slow" /> EXECUTIVE ANALYTICS
          </div>
          
          <div className="relative">
            <h1 className="text-8xl md:text-9xl font-fairbanks text-white leading-none tracking-tighter">
              FAIRBANKS
            </h1>
            <span className="block font-tech text-[#004fb6] text-3xl md:text-4xl tracking-[0.3em] font-extrabold mt-4 uppercase">
              LOGISTICS
            </span>
          </div>
          
          <div className="h-0.5 w-64 bg-gradient-to-r from-transparent via-[#004fb6] to-transparent mx-auto mt-8 opacity-50" />
        </div>

        <div className="w-full max-w-md">
          <button 
            onClick={handleBoot}
            disabled={isInitializing}
            className="w-full group relative py-10 px-16 glass-card rounded-[2rem] bg-white/10 border border-white/20 text-white font-tech font-black uppercase tracking-[0.5em] text-xl transition-all shadow-[0_0_80px_rgba(0,0,0,0.4)] active:scale-[0.98] hover:bg-white/20 overflow-hidden"
          >
            <div className="relative z-10 flex items-center justify-center gap-6">
              {isInitializing ? (
                <Zap size={40} className="animate-spin text-[#004fb6]" />
              ) : (
                <>
                  <span>INITIALIZE</span>
                  <ArrowRight size={32} className="group-hover:translate-x-4 transition-transform duration-500 text-[#004fb6]" />
                </>
              )}
            </div>
          </button>
        </div>

        <div className="pt-24 w-full flex justify-between items-center opacity-30 text-[10px] font-tech text-white uppercase tracking-widest">
           <div className="flex items-center gap-3">
             <ShieldCheck size={16} />
             <span>NEURAL_LINK_READY</span>
           </div>
           <span>PROTOCOL_V9.4_GLASS</span>
        </div>
      </div>
    </div>
  );
};
