
import React, { useState, useEffect, useRef } from 'react';

interface TerminalProps {
  onCommand: (cmd: string) => void;
  logs: string[];
}

const Terminal: React.FC<TerminalProps> = ({ onCommand, logs }) => {
  const [input, setInput] = useState('');
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

  return (
    <div className="bg-[#020617] border border-white/10 rounded-[2rem] p-5 h-[400px] flex flex-col font-mono text-[11px] shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-transparent to-blue-600 opacity-30" />
      <div className="flex-1 overflow-y-auto mb-4 space-y-1.5 no-scrollbar pr-2">
        <div className="text-slate-500 opacity-60 mb-3 italic tracking-tight font-bold"># COHORT_SCRIPTS_CONSOLE v2.1.0</div>
        {logs.map((log, i) => (
          <div key={i} className={`leading-relaxed ${log.includes('cohort@analytics') ? 'text-blue-400' : 'text-slate-300'}`}>
            {log}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2.5 border-t border-white/5 pt-4 bg-[#020617] sticky bottom-0">
        <span className="text-blue-500 font-black tracking-tighter uppercase">RUN:</span>
        <input
          autoFocus
          className="bg-transparent border-none outline-none text-white flex-1 font-mono uppercase placeholder:text-slate-700"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ENTER_SCRIPT_CMD"
        />
      </form>
    </div>
  );
};

export default Terminal;
