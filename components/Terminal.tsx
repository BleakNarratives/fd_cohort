
import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, HelpCircle, ChevronRight, Play } from 'lucide-react';
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
    { cmd: "HELP", desc: "List all system capabilities." },
    { cmd: "LS", desc: "View the /fanduel_cohort directory." },
    { cmd: "RUN_PROB_ENGINE", desc: "Execute probability modeling." },
    { cmd: "SCANNERS", desc: "Display active market scouts." }
  ];

  return (
    <div className="bg-[#010409] border-2 border-blue-900/40 rounded-[2.5rem] p-8 h-[500px] flex flex-col font-mono text-[12px] shadow-[0_0_50px_rgba(0,0,0,1)] relative overflow-hidden group">
      
      {/* Terminal Header */}
      <div className="flex items-center justify-between border-b border-blue-900/30 pb-4 mb-4">
        <div className="flex items-center gap-2">
           <TerminalIcon size={16} className="text-blue-500" />
           <span className="text-blue-200 font-black tracking-tighter uppercase">Cohort_Terminal_v4.5</span>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={() => setShowTutorial(!showTutorial)}
             className="text-slate-500 hover:text-blue-400 transition-colors flex items-center gap-1.5"
           >
             <HelpCircle size={14} /> <span className="text-[10px] font-bold">GUIDE</span>
           </button>
           <div className="flex gap-1.5">
              <div className="size-2.5 rounded-full bg-red-900/50" />
              <div className="size-2.5 rounded-full bg-amber-900/50" />
              <div className="size-2.5 rounded-full bg-emerald-900/50" />
           </div>
        </div>
      </div>

      {/* Tutorial Overlay */}
      {showTutorial && (
        <div className="absolute inset-0 z-50 bg-black/95 p-10 flex flex-col items-center justify-center animate-in fade-in duration-300">
           <div className="max-w-md w-full space-y-6">
              <h3 className="text-xl font-black text-blue-400 tracking-tighter italic">NEW_USER_INDUCTION</h3>
              <p className="text-slate-400 text-[11px] leading-relaxed">Welcome to the Foxwood Command Line. Use these commands to manipulate the cohort scripts and market scouts.</p>
              <div className="space-y-3">
                 {tutorialSteps.map((step, i) => (
                   <div key={i} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl hover:border-blue-500/30 transition-all group cursor-pointer" onClick={() => { setInput(step.cmd); setShowTutorial(false); }}>
                      <div className="flex items-center gap-3">
                         <span className="text-blue-500 font-bold">{step.cmd}</span>
                         <span className="text-slate-500 text-[10px]">{step.desc}</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-700 group-hover:text-blue-400" />
                   </div>
                 ))}
              </div>
              <button 
                onClick={() => setShowTutorial(false)}
                className="w-full py-4 bg-blue-600 text-white font-black uppercase text-[10px] rounded-xl hover:brightness-110 active:scale-95 transition-all"
              >
                Close Induction
              </button>
           </div>
        </div>
      )}

      {/* Main Logs */}
      <div className="flex-1 overflow-y-auto mb-6 space-y-2 no-scrollbar pr-4">
        {logs.map((log, i) => (
          <div key={i} className={`leading-relaxed animate-in slide-in-from-left-2 duration-300 ${
            log.includes('cohort@analytics') ? 'text-blue-400 font-bold' : 
            log.includes('ERROR') ? 'text-red-500 font-bold' :
            log.includes('JANE_UNLEASHED') ? 'text-amber-400 font-black italic' :
            log.includes('FLY_ME_TO_THE_MOON') ? 'text-[#d4af37] font-black tracking-widest' :
            'text-slate-300'
          }`}>
            <span className="opacity-40 mr-2">[{new Date().toLocaleTimeString()}]</span>
            {log}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Input Section */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 text-emerald-500 font-black">
          {'>'}
        </div>
        <input
          autoFocus
          className="w-full bg-white/5 border border-blue-900/20 rounded-xl py-4 pl-8 pr-12 outline-none text-white font-mono uppercase focus:border-blue-500/50 transition-all placeholder:text-slate-800"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="AWAITING_COMMAND..."
        />
        <button 
          type="submit" 
          className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-white transition-colors"
        >
          <Play size={16} fill="currentColor" />
        </button>
      </form>
      
      {/* CRT Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20" />
    </div>
  );
};

export default Terminal;
