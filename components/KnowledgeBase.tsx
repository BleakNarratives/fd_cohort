
import React, { useState } from 'react';
import { FileText, Mail, Map, ListTodo, Shield, Copy, Check, ExternalLink } from 'lucide-react';

const ASSETS = {
  README: `# FAIRBANKS LOGISTICS v9.4\nUnified command for Kings Council & FanDuel Cohort.\n\n### Core Methodology\n- Scrape -> Swarm -> Strike.\n- Agentic 6-Hat Deliberation.\n- Local script bridging via Android /storage.`,
  ROADMAP: `Phase 1: Local Script Bridge [DONE]\nPhase 2: Swarm Advisory Engine [DONE]\nPhase 3: Multi-Book Adapter [IN_PROGRESS]\nPhase 4: Auto-Strike Protocol [LOCKED]`,
  TODO: `- Finalize Titan Ghost UI\n- Calibrate 6-hat weighted sentiment\n- Optimize swipe gesture collision`,
  OUTREACH: `Subject: Strategic Partnership - The Fairbanks Alpha Link\n\nDear Partner,\n\nWe have successfully established a zero-latency bridge between local strategy cohorts and live market headers. We are prepared to ship the Fairbanks Executive Suite...`,
  LICENSE: `FAIRBANKS ALPHA LICENSE v1.0\nInternal Use Only. Redistribution of the /storage/emulated/0/.../fanduel_cohort bridge scripts is strictly prohibited.`
};

export const KnowledgeBase: React.FC = () => {
  const [active, setActive] = useState<keyof typeof ASSETS>('README');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(ASSETS[active]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-[700px] bg-black/40 border border-white/5 rounded-[3rem] overflow-hidden animate-in zoom-in duration-500">
      {/* Sidebar */}
      <div className="w-80 border-r border-white/5 bg-[#050505]/60 p-8 flex flex-col gap-4">
        <h3 className="font-dk text-xs font-black text-white uppercase tracking-widest mb-6 px-4">Project Assets</h3>
        {[
          { id: 'README', icon: FileText },
          { id: 'ROADMAP', icon: Map },
          { id: 'TODO', icon: ListTodo },
          { id: 'OUTREACH', icon: Mail },
          { id: 'LICENSE', icon: Shield }
        ].map(item => (
          <button 
            key={item.id}
            onClick={() => setActive(item.id as any)}
            className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-tech text-[10px] font-black uppercase tracking-widest transition-all ${active === item.id ? 'bg-[#00f51d] text-black' : 'text-slate-500 hover:bg-white/5'}`}
          >
            <item.icon size={16} /> {item.id}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col p-12">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <span className="font-dk text-2xl font-black text-white">{active}</span>
            <span className="text-[10px] font-tech text-[#00f51d] font-bold">READY_TO_SHIP.v9</span>
          </div>
          <button 
            onClick={copyToClipboard}
            className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all text-[10px] font-tech font-black uppercase"
          >
            {copied ? <Check size={14} className="text-[#00f51d]" /> : <Copy size={14} />}
            {copied ? 'COPIED' : 'COPY_ASSET'}
          </button>
        </div>
        <div className="flex-1 bg-black/20 p-10 rounded-3xl border border-white/5 font-tech text-[11px] text-slate-400 leading-relaxed overflow-y-auto whitespace-pre-wrap">
          {ASSETS[active]}
        </div>
      </div>
    </div>
  );
};
