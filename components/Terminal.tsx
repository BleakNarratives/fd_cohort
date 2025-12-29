
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
    <div className="bg-black border border-slate-800 rounded-lg p-4 h-[500px] flex flex-col font-mono text-sm">
      <div className="flex-1 overflow-y-auto mb-4 space-y-1">
        <div className="text-emerald-500"># System initialized. Path: /storage/emulated/0/root_2025/fanduel_cohort</div>
        {logs.map((log, i) => (
          <div key={i} className="text-slate-300">
            <span className="text-slate-500 mr-2">[{new Date().toLocaleTimeString()}]</span>
            {log}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <span className="text-emerald-500">janebot@fanduel:~$</span>
        <input
          autoFocus
          className="bg-transparent border-none outline-none text-white flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="run strategy_main.py --mode=pro"
        />
      </form>
    </div>
  );
};

export default Terminal;
