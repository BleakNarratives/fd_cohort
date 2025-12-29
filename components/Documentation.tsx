
import React from 'react';
import { BookOpen, Code, Terminal, FileText, ChevronRight } from 'lucide-react';

const sections = [
  {
    title: "Scout Engine Setup",
    icon: <BookOpen size={18} />,
    items: [
      { name: "API Key Configuration", desc: "Setting environment variables for Gemini-3-Pro." },
      { name: "Grounding Filters", desc: "How to tune Google Search for specific sectors." }
    ]
  },
  {
    title: "Script Cohort Integration",
    icon: <Terminal size={18} />,
    items: [
      { name: "Path Setup", desc: "Defaulting to /storage/emulated/0/root_2025/fanduel_cohort." },
      { name: "Response Interception", desc: "Parsing JSON logs from Python outputs." }
    ]
  },
  {
    title: "Advanced Analytics",
    icon: <Code size={18} />,
    items: [
      { name: "Calibrating the Accuracy Pit", desc: "Statistical models used for line drift." },
      { name: "Voice Triggers", desc: "Custom tool calls for automated refreshes." }
    ]
  }
];

export const Documentation: React.FC = () => {
  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <FileText size={14} className="text-[#d4af37]" /> Knowledge Base
        </h3>
      </div>

      <div className="space-y-4">
        {sections.map((section, idx) => (
          <div key={idx} className="bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden">
            <div className="px-6 py-4 bg-white/5 flex items-center gap-3 border-b border-white/5">
              <div className="text-blue-400">{section.icon}</div>
              <h4 className="text-sm font-extrabold text-white tracking-tight">{section.title}</h4>
            </div>
            <div className="divide-y divide-white/5">
              {section.items.map((item, i) => (
                <button key={i} className="w-full px-6 py-4 flex justify-between items-center hover:bg-white/5 transition-all text-left group">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-200 group-hover:text-[#d4af37] transition-colors">{item.name}</div>
                    <div className="text-[10px] text-slate-500">{item.desc}</div>
                  </div>
                  <ChevronRight size={14} className="text-slate-700 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
