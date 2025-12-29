
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, ShieldAlert, Cpu, Sparkles, MessageSquare } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { soundService } from '../services/soundService';
import { BetData } from '../types';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

export const StrategyConsultant: React.FC<{ bets: BetData[] }> = ({ bets }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "CONSULTANT_ONLINE. Tactical Link established. What's the strategy for today's market?" }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsThinking(true);
    soundService.playDataCrunch();

    const response = await geminiService.getStrategicAdvice(userMsg, bets);
    
    setMessages(prev => [...prev, { role: 'assistant', text: response }]);
    setIsThinking(false);
    soundService.playDigitalClick();
  };

  return (
    <div className="flex flex-col h-full space-y-4 steam-ingress">
      {/* Top Banner */}
      <div className="bg-blue-600/10 border border-blue-500/30 p-4 rounded-[2rem] flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="size-8 bg-blue-600 rounded-xl flex items-center justify-center border border-blue-400/50 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
               <Bot size={18} className="text-white" />
            </div>
            <div>
               <h3 className="text-[10px] font-black text-white uppercase tracking-widest">JaneBot Tactical Link</h3>
               <p className="text-[8px] text-blue-400 font-bold uppercase tracking-tight">Strategy Calibration: Active</p>
            </div>
         </div>
         <div className="flex gap-1">
            {[1, 2, 3].map(i => <div key={i} className="size-1.5 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />)}
         </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 bg-black/40 border border-white/5 rounded-[2.5rem] p-6 overflow-y-auto no-scrollbar space-y-6 shadow-inner relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent pointer-events-none" />
        
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-5 rounded-[2rem] border ${
              m.role === 'user' 
              ? 'bg-blue-600/20 border-blue-500/30 text-blue-100 rounded-tr-none' 
              : 'bg-slate-900/60 border-white/10 text-slate-200 rounded-tl-none'
            } shadow-xl relative overflow-hidden`}>
               {m.role === 'assistant' && <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />}
               <p className="text-[11px] leading-relaxed font-medium tracking-tight whitespace-pre-wrap italic">
                 {m.text}
               </p>
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex justify-start">
             <div className="bg-slate-900/60 border border-white/10 p-5 rounded-[2rem] rounded-tl-none animate-pulse flex items-center gap-3">
                <Cpu size={14} className="text-blue-500 animate-spin" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Crunching Market Alpha...</span>
             </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="relative mt-2">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="REQUEST_STRATEGIC_CALIBRATION..."
          className="w-full bg-slate-900/80 border-2 border-blue-500/30 rounded-[2.5rem] py-5 px-8 pr-20 text-[11px] font-black uppercase text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none transition-all shadow-2xl"
        />
        <button 
          type="submit"
          disabled={!input.trim() || isThinking}
          className="absolute right-3 top-1/2 -translate-y-1/2 size-12 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)] active:scale-90 transition-transform disabled:opacity-50 disabled:grayscale"
        >
          <Send size={18} className="text-white" />
        </button>
      </form>
    </div>
  );
};
