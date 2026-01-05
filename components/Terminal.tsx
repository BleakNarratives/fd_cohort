
import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, HelpCircle, ChevronRight, Play, ShieldAlert } from 'lucide-react';
import { soundService } from '../services/soundService';

interface TerminalProps {
  onCommand: (cmd: string) => void;
  logs: string[];
}

const Terminal: React.FC<TerminalProps> = ({ onCommand, logs }) => {
  const [input, setInput] = useState('');
  const [showTutorial, setShowTutorial] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onCommand(input);
      setInput('');
    }
  };

  const tutorialSteps = [
    { cmd: "AFIREFLY --SCAN", desc: "Launch the header scraper." },
    { cmd: "LS /COHORT", desc: "View the script directory." },
    { cmd: "COUNCIL --CONSULT", desc: "Open the round table briefing." },
    { cmd: "CLEAR", desc: "Flush the command buffer." }
  ];

  return (
    <div className="bg-[#050505] border border-[#00f51d]/20 rounded-2xl p-6 h-[500px] flex flex-col font-tech text-[12px] shadow-2xl relative overflow-hidden group">
      
      {/* Terminal Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
        <div className="flex items-center gap-3">
           <TerminalIcon size={16} className="text-[#00f51d]" />
           <span className="text-white font-black tracking-widest uppercase opacity-80">COHORT_SHELL_v5.0</span>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={() => setShowTutorial(!showTutorial)}
             className="text-slate-500 hover:text-[#00f51d] transition-colors flex items-center gap-1.5"
           >
             <HelpCircle size={14} /> <span className="text-[10px] font-bold">INFO</span>
           </button>
           <div className="flex gap-1.5">
              <div className="size-2 rounded-full bg-slate-800" />
              <div className="size-2 rounded-full bg-slate-800" />
              <div className="size-2 rounded-full bg-[#00f51d]/40" />
           </div>
        </div>
      </div>

      {/* Tutorial Overlay */}
      {showTutorial && (
        <div className="absolute inset-0 z-50 bg-black/95 p-10 flex flex-col items-center justify-center animate-in fade-in duration-300">
           <div className="max-w-md w-full space-y-6">
              <div className="flex items-center gap-3 text-[#00f51d]">
                <ShieldAlert size={20} />
                <h3 className="text-xl font-dk font-black tracking-tighter uppercase">OPERATOR_MANUAL</h3>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed font-tech">Access the DraftKings header stream via aFiREFLY hooks. Manipulate cohort scripts for local execution.</p>
              <div className="space-y-3">
                 {tutorialSteps.map((step, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:border-[#00f51d]/30 transition-all group cursor-pointer" onClick={() => { setInput(step.cmd); setShowTutorial(false); }}>
                      <div className="flex items-center gap-4">
                         <span className="text-[#00f51d] font-bold">{step.cmd}</span>
                         <span className="text-slate-500 text-[9px] uppercase tracking-widest">{step.desc}</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-700 group-hover:text-[#00f51d]" />
                   </div>
                 ))}
              </div>
              <button 
                onClick={() => setShowTutorial(false)}
                className="w-full py-4 border border-[#00f51d]/30 text-[#00f51d] font-dk font-black uppercase text-[10px] rounded-xl hover:bg-[#00f51d]/10 transition-all"
              >
                DISMISS
              </button>
           </div>
        </div>
      )}

      {/* Main Logs */}
      <div className="flex-1 overflow-y-auto mb-6 space-y-2 no-scrollbar pr-4 font-tech">
        {logs.map((log, i) => (
          <div key={i} className={`leading-relaxed animate-in slide-in-from-left-1 duration-200 ${
            log.includes('council@roundtable') ? 'text-[#00f51d] font-bold' : 
            log.includes('ERR') ? 'text-red-500' :
            log.includes('SUCCESS') ? 'text-[#00f51d] font-black' :
            'text-slate-400'
          }`}>
            <span className="opacity-20 mr-2 text-[10px]">[{new Date().toLocaleTimeString([], {hour12: false})}]</span>
            {log}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Input Section */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00f51d] font-black opacity-50">
          $
        </div>
        <input
          autoFocus
          className="w-full bg-white/5 border border-white/5 rounded-xl py-4 pl-10 pr-12 outline-none text-white font-tech uppercase focus:border-[#00f51d]/30 transition-all placeholder:text-slate-800"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="AWAITING_INPUT..."
        />
        <button 
          type="submit" 
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#00f51d] hover:scale-110 transition-transform"
        >
          <Play size={16} fill="currentColor" />
        </button>
      </form>
      
      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-10" />
    </div>
  );
};

export default Terminal;
