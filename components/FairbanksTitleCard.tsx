
import React, { useEffect, useState } from 'react';
import { soundService } from '../services/soundService';
import { Crown, Anchor, Shield, Sword, ShieldAlert, Coins, Skull } from 'lucide-react';

interface TitleCardProps {
  onComplete: () => void;
  mode: 'INTRO' | 'OUTRO';
}

const StoneDebris = () => {
  const [style] = useState(() => ({
    '--tw-x': `${(Math.random() - 0.5) * 400}px`,
    '--tw-y': `${(Math.random() * 300) + 150}px`,
    '--tw-r': `${Math.random() * 1080}deg`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    transform: `scale(${Math.random() * 3 + 0.5})`,
  } as React.CSSProperties));

  return <div className="chip" style={style} />;
};

export const FairbanksTitleCard: React.FC<TitleCardProps> = ({ onComplete, mode }) => {
  const [visible, setVisible] = useState(false);
  const [chips, setChips] = useState<number[]>([]);
  const [glintPos, setGlintPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setVisible(true);
    if (mode === 'INTRO') {
      soundService.playIntroSound();
      // Burst of stone chips on entry
      setTimeout(() => {
        setChips(Array.from({ length: 60 }, (_, i) => i));
      }, 1000);
    }
    
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 1200);
    }, 4800);
    return () => clearTimeout(timer);
  }, [onComplete, mode]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    setGlintPos({ x, y });
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className={`fixed inset-0 z-[20000] bg-[#050403] flex flex-col items-center justify-center transition-all duration-1000 overflow-hidden ${visible ? 'opacity-100' : 'opacity-0 scale-95 blur-xl'}`}
    >
      {/* Background Ambience: Ancient Parchment & Shadow */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_75%)]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] mix-blend-overlay opacity-30" />
      </div>

      {/* Floating Imperial Symbols */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <Crown className="absolute top-[10%] left-[10%] animate-pulse text-[#d4af37] rotate-[-15deg] blur-[1px]" size={120} strokeWidth={1} />
        <Shield className="absolute bottom-[10%] left-[5%] animate-bounce text-[#6b5113] rotate-[10deg] blur-[2px]" size={140} strokeWidth={1} />
        <Sword className="absolute top-[20%] right-[8%] animate-pulse text-[#d4af37] rotate-[45deg]" size={100} strokeWidth={0.5} />
        <Anchor className="absolute bottom-[15%] right-[12%] animate-bounce text-[#6b5113] rotate-[-20deg]" size={90} strokeWidth={1} />
      </div>

      <div 
        className="relative flex flex-col items-center text-center space-y-16 transition-transform duration-700 ease-out"
        style={{ transform: `translate(${glintPos.x}px, ${glintPos.y}px)` }}
      >
        <div className="flex items-center gap-14 opacity-60">
           <div className="h-[2px] w-56 bg-gradient-to-r from-transparent via-[#aa8a2e] to-[#f9e29c]" />
           <ShieldAlert className="text-[#f9e29c] animate-pulse" size={56} strokeWidth={1.2} />
           <div className="h-[2px] w-56 bg-gradient-to-l from-transparent via-[#aa8a2e] to-[#f9e29c]" />
        </div>

        <div className="space-y-2 relative">
          <div className="relative group">
            {/* Chisel Typography with dynamic chips */}
            <h1 className="font-monarch text-9xl md:text-[13rem] font-black tracking-[-0.04em] uppercase gold-gradient-text chipped-text transition-all duration-1000 group-hover:scale-[1.03]">
              FAIRBANKS
            </h1>
            
            {/* Falling Stone Chips */}
            <div className="absolute inset-0 pointer-events-none">
              {chips.map(id => <StoneDebris key={id} />)}
            </div>
          </div>

          <div className="flex items-center justify-center gap-10 -mt-8">
             <div className="p-5 bg-gradient-to-br from-[#d4af37] via-[#4d3a0d] to-[#d4af37] rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.9)] border border-[#f9e29c]/40 group hover:rotate-180 transition-transform duration-1000">
                <Crown className="text-white" size={48} />
             </div>
             <span className="font-monarch text-5xl md:text-7xl text-white tracking-[0.4em] font-black uppercase drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
               LOGISTICS
             </span>
          </div>
        </div>

        <div className="pt-24 flex flex-col items-center gap-8">
          <div className="px-16 py-5 bg-gradient-to-r from-transparent via-[#d4af37]/20 to-transparent rounded-full border border-[#d4af37]/40 shadow-[inset_0_0_30px_rgba(212,175,55,0.1)] relative group overflow-hidden">
            <p className="font-monarch text-sm text-[#f9e29c] uppercase tracking-[1em] font-black animate-pulse relative z-10">
              {mode === 'INTRO' ? 'DECREE_OF_ENGAGEMENT' : 'SEALING_THE_IMPERIAL_VAULT'}
            </p>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>
          
          <div className="flex gap-8 items-center opacity-40">
             <div className="h-[1px] w-20 bg-[#d4af37]/40" />
             <Coins className="text-[#d4af37] animate-bounce" size={32} />
             <div className="h-[1px] w-20 bg-[#d4af37]/40" />
          </div>
        </div>
      </div>

      {/* Cinematic Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.95)_100%)] pointer-events-none" />
    </div>
  );
};
