
import React from 'react';
import { AlertTriangle, ShieldAlert, Check, Skull, Scale, Gavel, HeartOff } from 'lucide-react';

export const WarningOverlay: React.FC<{ onAccept: () => void }> = ({ onAccept }) => {
  return (
    <div className="fixed inset-0 z-[25000] bg-black flex items-center justify-center p-4 md:p-12 overflow-y-auto">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06)_0%,transparent_75%)]" />
      </div>

      <div className="max-w-4xl w-full bg-[#080808] border-2 border-red-900/60 rounded-[3rem] p-10 md:p-20 space-y-14 shadow-[0_0_150px_rgba(255,0,0,0.2)] relative z-10">
        
        <div className="flex flex-col md:flex-row items-center gap-10 text-red-500 text-center md:text-left border-b border-red-900/30 pb-12">
          <div className="p-8 bg-red-950/40 rounded-full border border-red-600/40 shadow-[0_0_40px_rgba(239,68,68,0.3)]">
            <Scale size={72} strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <h2 className="font-monarch text-5xl md:text-6xl font-black uppercase tracking-tighter text-white">
              DECREE OF <span className="text-red-500">INDEMNITY</span>
            </h2>
            <p className="font-tech text-xs uppercase tracking-[0.6em] opacity-60">IMPERIAL_JUDICIAL_CLEARENCE_v9.4_EXTREME</p>
          </div>
        </div>

        <div className="space-y-10 font-tech text-[11px] md:text-[12px] text-slate-400 leading-relaxed uppercase overflow-y-auto max-h-[45vh] pr-6 custom-scrollbar">
          
          <div className="p-10 bg-red-950/15 rounded-3xl border border-red-900/40 space-y-6">
            <div className="flex items-center gap-4 text-red-400 font-black text-sm mb-2">
              <ShieldAlert size={22} />
              <span>PRIMARY LIABILITY & SECURITY INTEREST WAIVER</span>
            </div>
            <p className="font-bold text-slate-100 text-sm">
              THE OPERATOR EXPRESSLY AGREES THAT THE CREATORS DO NOT HOLD A PRIMARY SECURITY INTEREST IN ANY HARM BEFALLING THE OPERATOR. YOU AGREE TO HOLD THE CREATORS COMPLETELY HARMLESS AND INDEMNIFIED IN THE EVENT OF ANY SIGNIFICANT FINANCIAL LOSS OR PERSONAL HARM.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6 p-8 border border-red-900/20 rounded-3xl bg-red-950/5">
              <div className="text-red-500 font-black flex items-center gap-3 text-sm">
                <HeartOff size={18} /> CRITICAL LIFE NOTICE
              </div>
              <p className="normal-case text-slate-300">
                WE EXPRESSLY DISCLAIM ANY AND ALL LIABILITY FOR MENTAL HEALTH DECLINE OR <span className="text-white font-black underline">ACTS OF SELF-HARM/SUICIDE</span> RESULTING FROM THE USE OF THIS SYSTEM. THE OPERATOR ASSUMES TOTAL RESPONSIBILITY FOR THEIR OWN PSYCHOLOGICAL STABILITY AND FINANCIAL SURVIVAL.
              </p>
            </div>
            
            <div className="space-y-6 p-8 border border-white/5 rounded-3xl bg-white/[0.02]">
              <div className="text-[#d4af37] font-black flex items-center gap-3 text-sm">
                <Gavel size={18} /> NO ADVICE / STRICT RAG
              </div>
              <p className="normal-case text-slate-300">
                THIS PLATFORM IS NOT A PROFESSIONAL SERVICE. WE DO NOT GIVE ADVICE. ALL OUTPUT IS CHARACTERIZED STRICTLY AS <span className="text-white font-bold italic underline">ODD-BASED RETRIEVAL AUGMENTED GENERATION (RAG)</span>. GENERATED DATA IS AN ALGORITHMIC PROJECTION AND SHOULD NEVER BE TREATED AS A FINANCIAL DIRECTIVE.
              </p>
            </div>
          </div>

          <div className="p-8 border-t border-red-900/30 text-center italic text-[10px] opacity-50 font-black tracking-widest">
            BY PROCEEDING, YOU SURRENDER ALL RIGHTS TO LITIGATION OR CLAIMS OF NEGLIGENCE.
          </div>
        </div>

        <div className="pt-8">
          <button 
            onClick={onAccept}
            className="w-full py-10 bg-gradient-to-r from-red-900 to-red-600 text-white font-monarch font-black text-lg uppercase rounded-3xl shadow-[0_25px_80px_rgba(239,68,68,0.4)] hover:brightness-125 transition-all flex flex-col items-center justify-center gap-3 group border border-red-400/40 relative overflow-hidden"
          >
            <span className="tracking-[0.2em] relative z-10">I ACCEPT ALL OPERATIONAL & FATAL RISK</span>
            <div className="flex items-center gap-3 opacity-70 text-[10px] font-tech group-hover:opacity-100 transition-opacity relative z-10">
               <Check size={16} /> SESSION_AUTHENTICATED_AND_INDEMNIFIED
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(239, 68, 68, 0.4); border-radius: 10px; }
      `}</style>
    </div>
  );
};
