
import React from 'react';
import { Shield, Layout, Cpu, Database, TrendingUp, BarChart3, Lock, Users, Activity, Layers } from 'lucide-react';

export const MarketIntel: React.FC = () => {
  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-right-10 duration-1000">
      
      {/* Imperial Intel Header */}
      <div className="relative p-16 rounded-[4rem] bg-gradient-to-br from-[#0a0a0a] to-[#000] border-2 border-white/5 overflow-hidden royal-glow">
        <div className="absolute top-0 right-0 p-16 opacity-10 pointer-events-none">
          <Database size={300} className="text-[#d4af37]" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
           <div className="space-y-6">
              <div className="flex items-center gap-4 text-[#d4af37]">
                <Shield size={32} />
                <span className="font-tech text-xs font-black uppercase tracking-[0.6em]">Imperial Intelligence Bureau</span>
              </div>
              <h2 className="font-monarch text-6xl font-black text-white uppercase tracking-tighter">Market <span className="gold-gradient-text">Conquest</span> Matrix</h2>
              <p className="font-tech text-sm text-slate-500 uppercase tracking-widest leading-loose max-w-2xl">Audit of FD vs DK behavioral architecture, color psychology, and backend WebSocket latency synchronization.</p>
           </div>
           
           <div className="grid grid-cols-2 gap-8">
              <div className="p-8 bg-[#1493FF]/5 border border-[#1493FF]/30 rounded-3xl text-center space-y-4">
                 <div className="text-4xl font-monarch font-black text-white">32%</div>
                 <div className="text-[10px] font-tech font-black text-[#1493FF] uppercase tracking-widest">FanDuel MS</div>
              </div>
              <div className="p-8 bg-[#9AC434]/5 border border-[#9AC434]/30 rounded-3xl text-center space-y-4">
                 <div className="text-4xl font-monarch font-black text-white">35%</div>
                 <div className="text-[10px] font-tech font-black text-[#9AC434] uppercase tracking-widest">DraftKings MS</div>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* FanDuel Column */}
        <div className="p-12 rounded-[3rem] bg-black/40 border border-[#1493FF]/20 space-y-10 relative overflow-hidden group">
           <div className="absolute top-0 left-0 w-full h-1 bg-[#1493FF]" />
           <div className="flex justify-between items-center">
              <h3 className="font-monarch text-3xl font-black text-white">FANDUEL_BLUE</h3>
              <Layers className="text-[#1493FF]" size={28} />
           </div>
           
           <div className="space-y-8">
              <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                 <div className="text-[10px] font-tech text-[#1493FF] font-black uppercase mb-3">UI Strategy</div>
                 <p className="text-xs text-slate-400 uppercase leading-relaxed">Minimalist, clean backgrounds, trust-focused vibrancy. optimized mobile-first structure.</p>
              </div>
              
              <ul className="space-y-4 text-[11px] font-tech text-slate-300 uppercase tracking-widest">
                 <li className="flex items-center gap-4"><TrendingUp size={16} className="text-[#1493FF]" /> Parlay Insurance Specialist</li>
                 <li className="flex items-center gap-4"><Activity size={16} className="text-[#1493FF]" /> SGP (Same Game Parlay) Dominance</li>
                 <li className="flex items-center gap-4"><Users size={16} className="text-[#1493FF]" /> Highest user reliability score</li>
              </ul>
           </div>
        </div>

        {/* DraftKings Column */}
        <div className="p-12 rounded-[3rem] bg-black/40 border border-[#9AC434]/20 space-y-10 relative overflow-hidden group">
           <div className="absolute top-0 left-0 w-full h-1 bg-[#9AC434]" />
           <div className="flex justify-between items-center">
              <h3 className="font-monarch text-3xl font-black text-white">DRAFTKINGS_LIME</h3>
              <Cpu className="text-[#9AC434]" size={28} />
           </div>
           
           <div className="space-y-8">
              <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                 <div className="text-[10px] font-tech text-[#9AC434] font-black uppercase mb-3">UI Strategy</div>
                 <p className="text-xs text-slate-400 uppercase leading-relaxed">High-energy dark mode, dense info presentation, action-oriented urgency cues.</p>
              </div>
              
              <ul className="space-y-4 text-[11px] font-tech text-slate-300 uppercase tracking-widest">
                 <li className="flex items-center gap-4"><BarChart3 size={16} className="text-[#9AC434]" /> Micro-Betting prop ecosystem</li>
                 <li className="flex items-center gap-4"><Lock size={16} className="text-[#9AC434]" /> Seamless Casino Integration</li>
                 <li className="flex items-center gap-4"><Cpu size={16} className="text-[#9AC434]" /> Dynamic Real-time Odds Engine</li>
              </ul>
           </div>
        </div>

        {/* Common Tech Stack Card */}
        <div className="col-span-full neon-card p-16 rounded-[4rem] space-y-12 shadow-[0_0_80px_rgba(212,175,55,0.05)]">
           <div className="flex flex-col items-center text-center space-y-4">
              <h3 className="font-monarch text-4xl font-black text-white uppercase">Shared <span className="text-[#d4af37]">Imperial</span> Architecture</h3>
              <p className="text-[10px] font-tech text-slate-500 uppercase tracking-[0.5em]">Consolidated Backend Telemetry Analysis</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
              {[
                { label: 'WebSocket Link', icon: Activity, desc: 'Real-time Sub-3s Synchronization' },
                { label: 'Geo-Verif', icon: Shield, desc: 'GPS + WiFi Triangulation' },
                { label: 'PCI DSS v4', icon: Lock, desc: 'Secure Escrowed Prize Logic' },
                { label: 'KYC Engine', icon: Users, desc: 'Zero-Touch Identity Validation' }
              ].map((tech, i) => (
                <div key={i} className="space-y-6 group">
                   <div className="size-20 bg-[#d4af37]/10 rounded-3xl flex items-center justify-center mx-auto border border-[#d4af37]/30 group-hover:bg-[#d4af37]/20 transition-all duration-500 group-hover:rotate-[360deg]">
                      <tech.icon size={32} className="text-[#d4af37]" />
                   </div>
                   <div className="space-y-2">
                      <div className="text-white font-monarch font-black text-sm uppercase">{tech.label}</div>
                      <p className="text-[9px] font-tech text-slate-500 tracking-widest leading-loose">{tech.desc}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};
