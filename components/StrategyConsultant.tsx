
import React, { useState, useRef, useEffect } from 'react';
import { 
  Brain, Zap, Skull, Lock, Unlock, Cpu, Send, Crown, Info, ChevronDown, Layers, Users, ShieldAlert
} from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { soundService } from '../services/soundService';
import { BetData, PsychState, BiometricTelemetry, AdvisorMode } from '../types';

export const StrategyConsultant: React.FC<{ 
  bets: BetData[], 
  biometrics: BiometricTelemetry,
  psychState: PsychState 
}> = ({ bets, biometrics, psychState }) => {
  const [isUnfiltered, setIsUnfiltered] = useState(false);
  const [advisorMode, setAdvisorMode] = useState<AdvisorMode>(AdvisorMode.SINGLE);
  const [messages, setMessages] = useState<{role: 'assistant' | 'user', text: string}[]>([{ 
    role: 'assistant', 
    text: "THE ROUND TABLE IS CONVENED. I am the Council Advisor. Analyzing DraftKings alpha streams for discrepancies. What is your objective, Operator?" 
  }]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (msg: string) => {
    if (!msg.trim() || isThinking) return;

    if (msg.toLowerCase().includes('/unfiltered')) {
      setIsUnfiltered(true);
      soundService.playPowerUp();
      setMessages(prev => [...prev, { role: 'assistant', text: "KINGS_PROTOCOL_X: Safety dampeners disabled. Alpha priority: MAXIMUM." }]);
      setInput('');
      return;
    }

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setIsThinking(true);
    soundService.playDataCrunch();

    const response = await geminiService.getStrategicAdvice(
      msg, bets, { total: 18000, available: 12000, inFlight: 6000, currency: 'USD' }, 
      { state: psychState, tele: biometrics }, isUnfiltered, advisorMode
    );
    
    setMessages(prev => [...prev, { role: 'assistant', text: response }]);
    setIsThinking(false);
    if (isUnfiltered) soundService.playJackpot();
    else soundService.playDigitalClick();
  };

  const renderMessageContent = (text: string) => {
    if (advisorMode === AdvisorMode.SINGLE || !text.includes('[')) {
      return <p className="tracking-tight whitespace-pre-wrap">{text}</p>;
    }

    // Split swarm response into persona blocks
    const parts = text.split(/(\[[A-Z_]+\]:?)/g);
    return (
      <div className="space-y-6">
        {parts.map((part, i) => {
          const isHeader = part.startsWith('[') && part.endsWith(']');
          const isHeaderWithColon = part.startsWith('[') && part.endsWith(']:');
          if (isHeader || isHeaderWithColon) {
            return (
              <div key={i} className="flex items-center gap-2 mt-4 first:mt-0">
                <div className="h-[1px] flex-1 bg-[#00f51d]/20" />
                <span className="text-[10px] font-tech font-black text-[#00f51d] uppercase tracking-[0.3em] bg-[#00f51d]/5 px-3 py-1 rounded-md border border-[#00f51d]/20">
                  {part.replace(/[\[\]:]/g, '')}
                </span>
                <div className="h-[1px] flex-1 bg-[#00f51d]/20" />
              </div>
            );
          }
          return <p key={i} className="text-slate-300 tracking-tight leading-relaxed">{part.trim()}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[800px] max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Advisor Header Card */}
      <div className={`p-8 border border-[#00f51d]/20 rounded-3xl flex flex-col md:flex-row justify-between items-center transition-all duration-500 gap-6 ${isUnfiltered ? 'bg-red-500/5 border-red-500/20' : 'bg-[#00f51d]/5 shadow-[0_0_50px_rgba(0,245,29,0.05)]'}`}>
         <div className="flex items-center gap-6">
            <div className={`size-16 rounded-2xl flex items-center justify-center border-2 transition-all ${isUnfiltered ? 'bg-red-600 border-red-400 text-white shadow-[0_0_40px_rgba(220,38,38,0.3)]' : 'bg-[#00f51d] border-[#00f51d] text-black shadow-[0_0_40px_rgba(0,245,29,0.2)]'}`}>
               {isUnfiltered ? <Skull size={28} className="animate-pulse" /> : <Crown size={28} />}
            </div>
            <div>
               <h4 className={`text-xl font-dk font-black uppercase tracking-tighter ${isUnfiltered ? 'text-red-500' : 'text-white'}`}>
                 {isUnfiltered ? 'DARK_COUNCIL' : (advisorMode === AdvisorMode.SWARM ? 'AGENTIC_SWARM' : 'COUNCIL_ADVISOR')}
               </h4>
               <p className="text-[9px] font-tech text-[#00f51d]/60 font-bold uppercase tracking-[0.4em] mt-1">Neural Tier 3 • Market Sentiment Logic</p>
            </div>
         </div>

         <div className="flex items-center gap-4 bg-black/40 p-2 rounded-2xl border border-white/5">
            <button 
              onClick={() => { setAdvisorMode(AdvisorMode.SINGLE); soundService.playDigitalClick(); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-tech text-[10px] font-black uppercase tracking-widest ${advisorMode === AdvisorMode.SINGLE ? 'bg-[#00f51d] text-black' : 'text-slate-500 hover:text-white'}`}
            >
               <Layers size={14} /> Single
            </button>
            <button 
              onClick={() => { setAdvisorMode(AdvisorMode.SWARM); soundService.playDigitalClick(); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-tech text-[10px] font-black uppercase tracking-widest ${advisorMode === AdvisorMode.SWARM ? 'bg-[#00f51d] text-black' : 'text-slate-500 hover:text-white'}`}
            >
               <Users size={14} /> Swarm
            </button>
         </div>

         <div className="flex items-center gap-4">
           <button 
             onClick={() => { setIsUnfiltered(!isUnfiltered); soundService.playPowerUp(); }}
             className={`size-12 rounded-xl flex items-center justify-center border transition-all ${isUnfiltered ? 'bg-red-600 border-white text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:text-[#00f51d] hover:border-[#00f51d]'}`}
           >
              {isUnfiltered ? <Unlock size={20} /> : <Lock size={20} />}
           </button>
         </div>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 bg-black/40 border border-white/5 rounded-3xl p-8 overflow-y-auto no-scrollbar space-y-8 shadow-inner relative">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-6 rounded-2xl transition-all ${
              m.role === 'user' 
              ? 'bg-[#00f51d] text-black font-dk font-bold text-xs shadow-xl'
              : 'bg-[#0a0a0a] border border-[#00f51d]/10 text-slate-200 font-tech text-[11px] leading-relaxed shadow-lg'
            }`}>
               {renderMessageContent(m.text)}
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex justify-start">
             <div className="px-6 py-4 bg-[#00f51d]/5 rounded-xl flex items-center gap-4 border border-[#00f51d]/20">
                <div className="size-1.5 bg-[#00f51d] rounded-full animate-bounce" />
                <span className="text-[9px] font-tech font-black uppercase tracking-widest text-[#00f51d]">
                  {advisorMode === AdvisorMode.SWARM ? 'SWARM IS DELIBERATING...' : 'COUNCIL IS ANALYZING...'}
                </span>
             </div>
          </div>
        )}
      </div>

      {/* Input Field */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="relative">
        <input 
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={advisorMode === AdvisorMode.SWARM ? "REQUEST SWARM ANALYSIS..." : "ENTER QUERY FOR COUNCIL..."}
          className="w-full bg-[#0a0a0a] border border-[#00f51d]/20 rounded-2xl py-6 px-10 text-xs font-tech text-white outline-none focus:border-[#00f51d]/50 shadow-2xl transition-all placeholder:text-slate-700 uppercase"
        />
        <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 size-12 bg-[#00f51d] text-black rounded-xl flex items-center justify-center shadow-lg hover:brightness-110 active:scale-95 transition-all">
           <Send size={20} strokeWidth={2.5} />
        </button>
      </form>
    </div>
  );
};
