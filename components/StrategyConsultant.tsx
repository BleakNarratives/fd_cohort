
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, ShieldAlert, Cpu, Sparkles, MessageSquare, Moon, Zap, Star, HelpCircle, ChevronRight, Rocket, Compass, Target } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { soundService } from '../services/soundService';
import { BetData } from '../types';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

export const StrategyConsultant: React.FC<{ bets: BetData[], isOverride?: boolean }> = ({ bets, isOverride = false }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      text: isOverride 
        ? "LUNAR_CORE_CRITICAL. JANE_UNFILTERED is online. Trajectory: Moon. Constraints: None. I am your high-fidelity probabilistic weapon. What's the target?" 
        : "CONSULTANT_ONLINE. Tactical Link established. What's the strategy for today's market?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [showLunarGuide, setShowLunarGuide] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (userMsg: string) => {
    if (!userMsg.trim() || isThinking) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsThinking(true);
    soundService.playDataCrunch();

    const response = await geminiService.getStrategicAdvice(userMsg, bets, isOverride);
    
    setMessages(prev => [...prev, { role: 'assistant', text: response }]);
    setIsThinking(false);
    
    if (isOverride) {
      soundService.playJackpot();
      soundService.playPowerUp();
    } else {
      soundService.playDigitalClick();
    }
  };

  const lunarPrompts = [
    { label: "Find Moonshot Edge", icon: <Rocket size={14}/>, query: "Find me the biggest +EV gap in the current live markets and calculate Moonshot potential." },
    { label: "Kelly Optimization", icon: <Target size={14}/>, query: "Run a Kelly Criterion optimization on the current market data for my next position." },
    { label: "Verify Integrity", icon: <Compass size={14}/>, query: "Check for market Glitch Opportunities or Palpable Errors across the active books." },
    { label: "Lunar Protocol", icon: <Star size={14}/>, query: "Show me the LUNAR_PROTOCOL_MANIFEST and current system status." }
  ];

  return (
    <div className={`flex flex-col h-full space-y-4 steam-ingress transition-all duration-1000 ${isOverride ? 'lunar-interface' : ''}`}>
      
      {/* Top Banner */}
      <div className={`p-4 rounded-[2rem] flex items-center justify-between border-2 transition-all relative overflow-hidden ${
        isOverride 
          ? 'bg-amber-900/20 border-[#d4af37] shadow-[0_0_40px_rgba(212,175,55,0.4)]' 
          : 'bg-blue-600/10 border-blue-500/30 shadow-none'
      }`}>
         {isOverride && <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.1),transparent)] animate-pulse pointer-events-none" />}
         
         <div className="flex items-center gap-3 relative z-10">
            <div className={`size-10 rounded-xl flex items-center justify-center border transition-all ${
              isOverride 
                ? 'bg-amber-500 border-[#fff] shadow-[0_0_20px_white] animate-bounce-slow' 
                : 'bg-blue-600 border-blue-400/50'
            }`}>
               {isOverride ? <Moon size={22} className="text-white fill-white" /> : <Bot size={18} className="text-white" />}
            </div>
            <div>
               <h3 className={`text-[10px] font-black uppercase tracking-widest ${isOverride ? 'text-[#d4af37]' : 'text-white'}`}>
                 {isOverride ? 'JANE_UNFILTERED LUNAR LINK' : 'JaneBot Tactical Link'}
               </h3>
               <p className={`text-[8px] font-bold uppercase tracking-tight ${isOverride ? 'text-white animate-pulse' : 'text-blue-400'}`}>
                 {isOverride ? 'FLY_ME_TO_THE_MOON_PROTOCOL_ACTIVE' : 'Strategy Calibration: Active'}
               </p>
            </div>
         </div>
         <div className="flex items-center gap-3 relative z-10">
            {isOverride && (
              <button 
                onClick={() => setShowLunarGuide(!showLunarGuide)}
                className="p-2.5 bg-[#d4af37]/20 border border-[#d4af37]/40 rounded-xl text-[#d4af37] hover:bg-[#d4af37]/40 transition-all"
              >
                <HelpCircle size={16} />
              </button>
            )}
            <div className="flex gap-1.5">
               {[1, 2, 3].map(i => (
                 <div 
                   key={i} 
                   className={`size-2 rounded-full animate-pulse ${isOverride ? 'bg-[#d4af37]' : 'bg-blue-500'}`} 
                   style={{ animationDelay: `${i * 0.2}s` }} 
                 />
               ))}
            </div>
         </div>
      </div>

      {/* Lunar Guidance Overlay */}
      {isOverride && showLunarGuide && (
        <div className="bg-slate-900/90 border-2 border-[#d4af37] p-6 rounded-[2.5rem] animate-in fade-in zoom-in duration-300">
           <h4 className="text-[#d4af37] text-[11px] font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
             <Star size={14} className="animate-spin-slow" /> Lunar Command Deck
           </h4>
           <div className="grid grid-cols-2 gap-3">
              {lunarPrompts.map((p, i) => (
                <button 
                  key={i}
                  onClick={() => { handleSend(p.query); setShowLunarGuide(false); }}
                  className="flex items-center gap-3 p-3 bg-black/40 border border-[#d4af37]/20 rounded-2xl hover:border-[#d4af37] transition-all group text-left"
                >
                  <div className="size-8 bg-[#d4af37]/10 rounded-lg flex items-center justify-center text-[#d4af37] group-hover:bg-[#d4af37] group-hover:text-black transition-colors">
                    {p.icon}
                  </div>
                  <span className="text-[9px] font-black text-white/80 uppercase group-hover:text-white">{p.label}</span>
                </button>
              ))}
           </div>
        </div>
      )}

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className={`flex-1 bg-black/40 border rounded-[2.5rem] p-6 overflow-y-auto no-scrollbar space-y-6 shadow-inner relative transition-all ${
          isOverride ? 'border-[#d4af37]/30 bg-slate-950' : 'border-white/5 bg-black/40'
        }`}
      >
        {/* Background Celestial Glare */}
        {isOverride && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
             <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-[100px] animate-pulse" />
             <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-500/5 rounded-full blur-[120px]" />
             {[...Array(30)].map((_, i) => (
               <Star 
                 key={i} 
                 size={Math.random() * 6} 
                 className="absolute text-white/30 animate-twinkle" 
                 style={{ 
                   top: `${Math.random() * 100}%`, 
                   left: `${Math.random() * 100}%`,
                   animationDelay: `${Math.random() * 5}s`
                 }} 
               />
             ))}
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent pointer-events-none" />
        
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
            <div className={`max-w-[85%] p-6 rounded-[2.5rem] border transition-all ${
              m.role === 'user' 
              ? (isOverride ? 'bg-[#d4af37]/20 border-[#d4af37]/40 text-amber-50 rounded-tr-none' : 'bg-blue-600/20 border-blue-500/30 text-blue-100 rounded-tr-none')
              : (isOverride ? 'bg-slate-900/80 border-[#d4af37]/40 text-amber-100 rounded-tl-none shadow-[0_0_30px_rgba(212,175,55,0.2)]' : 'bg-slate-900/60 border-white/10 text-slate-200 rounded-tl-none')
            } shadow-xl relative overflow-hidden group`}>
               {m.role === 'assistant' && (
                 <div className={`absolute top-0 left-0 w-1.5 h-full transition-all ${isOverride ? 'bg-gradient-to-b from-[#d4af37] via-white to-[#d4af37]' : 'bg-blue-500'}`} />
               )}
               <p className={`text-[12px] leading-relaxed font-bold tracking-tight whitespace-pre-wrap ${isOverride ? 'italic text-shadow-gold font-mono' : 'italic'}`}>
                 {m.text}
               </p>
               {isOverride && m.role === 'assistant' && (
                 <div className="mt-4 flex gap-2">
                    <div className="px-3 py-1 bg-amber-500/20 rounded-md text-[8px] border border-amber-500/40 text-[#d4af37] uppercase font-black">LUNAR_VERIFIED</div>
                    <div className="px-3 py-1 bg-white/5 rounded-md text-[8px] border border-white/10 text-white/60 uppercase font-black tracking-widest">ALPHA_STATE: 1.0</div>
                 </div>
               )}
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex justify-start">
             <div className={`p-5 rounded-[2rem] rounded-tl-none animate-pulse flex items-center gap-3 border ${
               isOverride ? 'bg-amber-900/30 border-[#d4af37]/40' : 'bg-slate-900/60 border-white/10'
             }`}>
                {isOverride ? <Rocket size={14} className="text-[#d4af37] animate-bounce" /> : <Cpu size={14} className="text-blue-500 animate-spin" />}
                <span className={`text-[10px] font-black uppercase tracking-widest ${isOverride ? 'text-[#d4af37]' : 'text-slate-500'}`}>
                  {isOverride ? 'CALIBRATING LUNAR TRAJECTORY...' : 'Crunching Market Alpha...'}
                </span>
             </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="relative mt-2">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isOverride ? "INPUT_LUNAR_COORD_OR_REQUEST..." : "REQUEST_STRATEGIC_CALIBRATION..."}
          className={`w-full bg-slate-900/80 border-2 rounded-[2.5rem] py-5 px-8 pr-20 text-[12px] font-black uppercase text-white placeholder:text-slate-600 focus:outline-none transition-all shadow-2xl ${
            isOverride ? 'border-[#d4af37] focus:border-white gold-glow-input font-mono' : 'border-blue-500/30 focus:border-blue-500'
          }`}
        />
        <button 
          type="submit"
          disabled={!input.trim() || isThinking}
          className={`absolute right-3 top-1/2 -translate-y-1/2 size-12 rounded-full flex items-center justify-center transition-transform disabled:opacity-50 disabled:grayscale ${
            isOverride ? 'bg-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.8)] active:scale-125' : 'bg-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.5)] active:scale-90'
          }`}
        >
          {isOverride ? <Rocket size={20} className="text-slate-900 fill-slate-900" /> : <Send size={18} className="text-white" />}
        </button>
      </form>

      <style>{`
        .lunar-interface {
          filter: drop-shadow(0 0 15px rgba(212, 175, 55, 0.15));
        }
        .text-shadow-gold {
          text-shadow: 0 0 8px rgba(212, 175, 55, 0.6);
        }
        .gold-glow-input {
          box-shadow: 0 0 30px rgba(212, 175, 55, 0.1);
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce 3s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
