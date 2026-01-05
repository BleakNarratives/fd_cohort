
import React, { useEffect, useState } from 'react';
import { soundService } from '../services/soundService';
import { Crown, Club, Spade, Heart, Diamond, Zap, FastForward } from 'lucide-react';

interface KingsCouncilIntroProps {
  onComplete: () => void;
}

export const KingsCouncilIntro: React.FC<KingsCouncilIntroProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [isSkipping, setIsSkipping] = useState(false);

  useEffect(() => {
    soundService.resume().then(() => {
      soundService.playIntroSound();
    });

    const timers = [
      setTimeout(() => setStep(1), 500),  // Start cascade
      setTimeout(() => setStep(2), 1500), // Card stand up
      setTimeout(() => setStep(3), 3000), // Chip spin finish
      setTimeout(() => setStep(4), 4500), // Final transition
      setTimeout(() => onComplete(), 5200)
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, [onComplete]);

  const handleSkip = () => {
    setIsSkipping(true);
    soundService.playPowerUp();
    onComplete();
  };

  const suits = [
    { icon: <Spade size={48} />, delay: '0s', label: 'POWER' },
    { icon: <Heart size={48} />, delay: '0.2s', label: 'STRATEGY' },
    { icon: <Diamond size={48} />, delay: '0.4s', label: 'ALPHA' },
    { icon: <Club size={48} />, delay: '0.6s', label: 'LUCK' }
  ];

  if (isSkipping) return null;

  return (
    <div className="fixed inset-0 z-[10000] bg-[#020400] flex items-center justify-center overflow-hidden">
      {/* Background Grids */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(var(--neon-green) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      {/* Force Kill / Bypass Button */}
      <button 
        onClick={handleSkip}
        className="absolute bottom-12 right-12 z-[10002] flex items-center gap-3 px-6 py-3 bg-[#00f51d]/10 border border-[#00f51d]/30 rounded-xl text-[#00f51d] font-tech text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#00f51d] hover:text-black transition-all group"
      >
        <span>FORCE_ENTRY</span>
        <FastForward size={14} className="group-hover:translate-x-1 transition-transform" />
      </button>

      <div className={`relative flex flex-col items-center w-full max-w-5xl transition-all duration-500 ${step === 4 ? 'scale-110 blur-sm opacity-0' : 'scale-100 opacity-100'}`}>
        
        {/* The Casino Chip Loader */}
        <div className={`transition-all duration-1000 transform mb-16 ${step >= 1 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
          <div className="casino-chip" />
        </div>

        {/* The Cascading Cards */}
        <div className="flex gap-4 md:gap-8 justify-center w-full mb-12">
          {suits.map((suit, i) => (
            <div 
              key={i}
              className={`w-24 h-36 md:w-32 md:h-48 neon-card rounded-xl flex flex-col items-center justify-between p-4 transition-all duration-700 ${
                step >= 1 ? 'animate-[card-slide-in_0.8s_ease-out_forwards]' : 'opacity-0'
              } ${step >= 2 ? 'shadow-[0_0_40px_rgba(0,245,29,0.3)]' : ''}`}
              style={{ animationDelay: suit.delay }}
            >
              <div className="self-start text-[10px] font-dk font-bold text-[#00f51d]">{i + 1}0</div>
              <div className="text-[#00f51d]">{suit.icon}</div>
              <div className="text-[8px] font-tech font-black tracking-widest text-[#00f51d] uppercase">{suit.label}</div>
            </div>
          ))}
        </div>

        {/* Main Branding */}
        <div className={`text-center transition-all duration-1000 ${step >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <div className="flex items-center justify-center gap-4 mb-4">
            <Crown size={40} className="text-[#f5e600] animate-pulse" />
            <h1 className="font-dk text-4xl md:text-6xl font-black text-white tracking-tighter uppercase">
              KINGS <span className="text-[#00f51d]">COUNCIL</span>
            </h1>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <span className="font-tech text-[10px] text-[#a3ff00] font-black uppercase tracking-[0.6em] animate-pulse">
              SHUFFLING_THE_DECK
            </span>
            <div className="h-0.5 w-64 bg-white/5 rounded-full overflow-hidden mt-4">
              <div 
                className="h-full bg-gradient-to-r from-[#00f51d] via-[#f5e600] to-[#00f51d] transition-all duration-[3000ms] ease-linear"
                style={{ width: step >= 2 ? '100%' : '0%' }}
              />
            </div>
          </div>
        </div>

        {/* Neural Sync Log */}
        <div className={`absolute bottom-12 left-12 font-tech text-[8px] text-[#00f51d]/40 uppercase tracking-widest space-y-1 transition-all duration-1000 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}>
          <div>DECK_MOUNTED: /COHORT</div>
          <div>SUIT_SYNC: OK</div>
          <div>NEURAL_DEALER: ACTIVE</div>
        </div>
      </div>

      {/* Final Vegas Transition - Sliding Cards Cover Screen */}
      <div className={`fixed inset-0 z-[10001] pointer-events-none flex flex-col transition-all duration-700 ${step >= 4 ? 'translate-x-full' : '-translate-x-0'}`}>
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className="flex-1 bg-[#00f51d] border-b border-black/20 transition-transform duration-700" 
            style={{ 
              transitionDelay: `${i * 0.1}s`,
              transform: step >= 4 ? 'translateX(100%)' : 'translateX(0)' 
            }}
          />
        ))}
      </div>
    </div>
  );
};
