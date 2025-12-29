
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Presentation, Target, TrendingUp, Cpu, Shield } from 'lucide-react';

const slides = [
  {
    title: "The Information Gap",
    icon: <Target className="text-[#d4af37]" />,
    content: "Professional bettors lose edge due to 200ms-500ms latency in market head-ends. FanDuel Cohort closes this gap using AI-powered edge detection.",
    points: ["Latency Correction", "Header Scrutiny", "Sentiment Overlay"]
  },
  {
    title: "The Scout Engine",
    icon: <Cpu className="text-blue-400" />,
    content: "Our Gemini-3-Pro integration crawls live web headers for hidden line movements before they hit the main UI filters.",
    points: ["Grounded Search", "Real-time Verification", "Zero Hallucination"]
  },
  {
    title: "Script Cohort Scalability",
    icon: <TrendingUp className="text-emerald-400" />,
    content: "Deploy local Python strategies directly via /fanduel_cohort path. Our bridge provides a unified terminal for execution and monitoring.",
    points: ["Local Execution", "Data Pass-through", "Historical Backtesting"]
  },
  {
    title: "Safe Play Framework",
    icon: <Shield className="text-[#d4af37]" />,
    content: "Profitability is nothing without sustainability. We embed deep-level responsible play triggers directly into the UI core.",
    points: ["Reality Checks", "Session Caps", "Support Ingestion"]
  }
];

export const PitchDeck: React.FC = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="bg-slate-900/80 border border-white/5 rounded-[2.5rem] p-8 min-h-[420px] flex flex-col justify-between relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <Presentation size={120} />
        </div>

        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="size-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
              {slides[current].icon}
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">{slides[current].title}</h2>
          </div>

          <p className="text-slate-400 text-sm leading-relaxed max-w-md">
            {slides[current].content}
          </p>

          <div className="flex flex-wrap gap-2">
            {slides[current].points.map((p, i) => (
              <span key={i} className="px-3 py-1 bg-blue-600/10 border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase rounded-full">
                {p}
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mt-8">
          <div className="flex gap-1">
            {slides.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-[#d4af37]' : 'w-2 bg-slate-700'}`} />
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={prev} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all active:scale-95">
              <ChevronLeft size={20} />
            </button>
            <button onClick={next} className="p-3 bg-[#d4af37] text-slate-900 hover:brightness-110 rounded-2xl shadow-lg shadow-[#d4af37]/20 transition-all active:scale-95">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="text-center p-4">
        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Confidential Strategy Deck • v4.0.1</span>
      </div>
    </div>
  );
};
