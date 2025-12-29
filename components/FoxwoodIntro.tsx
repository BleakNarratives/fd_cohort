
import React, { useEffect, useState } from 'react';
import { soundService } from '../services/soundService';

interface FoxwoodIntroProps {
  onComplete: () => void;
  isExit?: boolean;
}

export const FoxwoodIntro: React.FC<FoxwoodIntroProps> = ({ onComplete, isExit = false }) => {
  const [visible, setVisible] = useState(false);
  const academyText = "FOXWOOD ACADEMY";

  useEffect(() => {
    setVisible(true);
    if (!isExit) {
      soundService.playIntroSound();
    }
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 1200);
    }, 4500); 
    return () => clearTimeout(timer);
  }, [onComplete, isExit]);

  return (
    <div className={`fixed inset-0 z-[9999] bg-[#000105] flex flex-col items-center justify-center transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      
      {/* ELEVATED PANNING LIGHT SOURCE */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[60%] bg-gradient-to-r from-transparent via-blue-500/10 to-transparent rotate-12 animate-panning-light" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[100%] h-[40%] bg-gradient-to-l from-transparent via-[#d4af37]/5 to-transparent -rotate-12 animate-panning-light-reverse" />
      </div>

      <div className="relative flex flex-col items-center">
        {/* CINEMATIC LETTERING CONTAINER */}
        <div className="flex gap-1 mb-4 select-none">
          {academyText.split("").map((char, i) => (
            <span 
              key={i} 
              className={`text-4xl md:text-6xl font-black tracking-[-0.05em] inline-block stand-up-letter ${char === " " ? "w-4" : ""}`}
              style={{ 
                animationDelay: `${i * 0.08}s`,
                color: char === " " ? "transparent" : "#fff",
                // Specular Glint Effect
                background: i < 7 ? 'linear-gradient(135deg, #d4af37 0%, #fff 50%, #d4af37 100%)' : 'linear-gradient(135deg, #fff 0%, #94a3b8 50%, #fff 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: `stand-up 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.08}s both, glint 4s linear infinite`
              }}
            >
              {char}
            </span>
          ))}
        </div>

        {/* PROGRESS BAR WITH GLINT */}
        <div className="h-0.5 w-72 bg-white/5 mt-2 relative overflow-hidden rounded-full">
           <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent w-full -translate-x-full animate-progress-glint" />
        </div>

        {/* INHALE PULSE SUBTEXT */}
        <p className="mt-10 text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] animate-inhale-pulse">
          {isExit ? 'Session Terminated' : 'Initiating Executive Environment'}
        </p>
      </div>

      <style>{`
        @keyframes panning-light {
          0% { transform: translate(-30%, -10%) rotate(12deg); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translate(30%, 10%) rotate(12deg); opacity: 0; }
        }
        @keyframes panning-light-reverse {
          0% { transform: translate(30%, 10%) rotate(-12deg); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translate(-30%, -10%) rotate(-12deg); opacity: 0; }
        }
        @keyframes stand-up {
          0% { transform: translateY(40px) rotateX(-90deg) scale(0.8); opacity: 0; }
          60% { transform: translateY(-5px) rotateX(10deg) scale(1.05); opacity: 1; }
          100% { transform: translateY(0) rotateX(0) scale(1); opacity: 1; }
        }
        @keyframes glint {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes progress-glint {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes inhale-pulse {
          0%, 100% { transform: scale(1); opacity: 0.4; letter-spacing: 0.5em; }
          50% { transform: scale(1.05); opacity: 1; letter-spacing: 0.6em; }
        }
        .animate-panning-light { animation: panning-light 6s ease-in-out infinite; }
        .animate-panning-light-reverse { animation: panning-light-reverse 8s ease-in-out infinite; }
        .animate-progress-glint { animation: progress-glint 3s ease-in-out infinite; }
        .animate-inhale-pulse { animation: inhale-pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        
        .stand-up-letter {
          perspective: 1000px;
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
};
