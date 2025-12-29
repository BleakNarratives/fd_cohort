
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  BarChart3, RefreshCw, Database, Globe, Link2, 
  Terminal as TerminalIcon, Settings as SettingsIcon, LayoutDashboard, 
  Activity, ShieldCheck, HeartHandshake, Presentation, 
  Zap, Bookmark, Calendar, Wallet, Smartphone, Laptop, Filters, Sparkles
} from 'lucide-react';
import { BetData, Tab, SafetySettings, EngineMode, FilterState } from './types';
import { geminiService } from './services/geminiService';
import { soundService } from './services/soundService';
import { FoxwoodIntro } from './components/FoxwoodIntro';
import Terminal from './components/Terminal';
import StatsCard from './components/StatsCard';
import { PitchDeck } from './components/PitchDeck';
import { Documentation } from './components/Documentation';
import { AnimatedCounter } from './components/AnimatedCounter';

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [showExit, setShowExit] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.MARKETS);
  const [bets, setBets] = useState<BetData[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [isScouting, setIsScouting] = useState(false);
  const [particles, setParticles] = useState<{id: number, x: number, y: number, tx: number, ty: number, color: string}[]>([]);
  const [syncCode, setSyncCode] = useState<string>('');

  const [safety, setSafety] = useState<SafetySettings>({
    sessionWarnings: true,
    warningInterval: 30,
    maxSessionTime: 120,
    engineMode: EngineMode.LIVE
  });

  const [filters, setFilters] = useState<FilterState>({
    minOdds: -500,
    maxOdds: 3000,
    sports: ['NFL', 'NBA', 'UFC']
  });

  const triggerParticles = (x: number, y: number) => {
    const newParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: Date.now() + i,
      x,
      y,
      tx: (Math.random() - 0.5) * 400,
      ty: (Math.random() - 0.5) * 400,
      color: ['#3b82f6', '#d4af37', '#fff'][Math.floor(Math.random() * 3)]
    }));
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => setParticles(prev => prev.filter(p => !newParticles.includes(p))), 1200);
  };

  const runScout = useCallback(async (e?: React.MouseEvent) => {
    setIsScouting(true);
    soundService.playHiss();
    if (e) triggerParticles(e.clientX, e.clientY);

    try {
      const result = await geminiService.scoutLiveMarkets(safety.engineMode);
      if (result.data) {
        setBets(result.data.filter(b => b.odds >= filters.minOdds && b.odds <= filters.maxOdds));
        /**
         * FIX: Store grounding sources as required by Gemini API guidelines for search grounding.
         */
        setSources(result.sources || []);
        soundService.playJackpot();
        triggerParticles(window.innerWidth / 2, window.innerHeight / 2);
      }
    } catch {
      soundService.playOogah();
    } finally {
      setIsScouting(false);
    }
  }, [safety.engineMode, filters]);

  const handleTabChange = (t: Tab) => {
    soundService.playDigitalClick();
    setActiveTab(t);
  };

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    soundService.playDigitalClick();
    triggerParticles(e.clientX, e.clientY);
    setBookmarks(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
  };

  const handleExit = () => {
    soundService.playOogah();
    setShowExit(true);
  };

  if (showIntro) return <FoxwoodIntro onComplete={() => setShowIntro(false)} />;
  if (showExit) return <FoxwoodIntro isExit onComplete={() => window.location.reload()} />;

  return (
    <div className="min-h-screen flex flex-col bg-black text-slate-100 font-sans select-none overflow-hidden relative">
      
      {/* Particle Layer */}
      {particles.map(p => (
        <div 
          key={p.id} 
          className="particle" 
          style={{ 
            left: p.x, top: p.y, 
            '--tw-tx': `${p.tx}px`, '--tw-ty': `${p.ty}px`,
            backgroundColor: p.color,
            width: '6px', height: '6px', borderRadius: '50%',
            boxShadow: `0 0 10px ${p.color}`
          } as any} 
        />
      ))}

      {/* Header */}
      <header className="px-6 py-4 border-b border-blue-500/20 flex justify-between items-center bg-black/80 backdrop-blur-2xl sticky top-0 z-[100]">
        <div className="flex items-center gap-3">
          <div className="size-10 bg-gradient-to-br from-blue-600 to-blue-950 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)] border border-blue-400/30 foxy-bulge cursor-pointer">
            <BarChart3 size={20} className="text-blue-200" />
          </div>
          <div className="group cursor-default">
            <h1 className="text-sm font-black tracking-tighter group-hover:text-blue-400 transition-colors">COHORT_PRO <span className="text-[#d4af37] animate-pulse">4.5</span></h1>
            <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
               <ShieldCheck size={8} className="text-blue-500" /> DOPAMINE_FACTORY_UNIT
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={(e) => runScout(e)} 
             disabled={isScouting}
             className={`p-3 bg-blue-600/10 rounded-xl border border-blue-500/30 transition-all foxy-bulge ${isScouting ? 'text-blue-400 scale-90' : 'text-slate-400 hover:text-blue-300'}`}
           >
              <RefreshCw size={16} className={isScouting ? 'animate-spin' : ''} />
           </button>
           <button onClick={handleExit} className="p-3 bg-red-600/10 text-red-500 rounded-xl border border-red-500/20 foxy-bulge">
              <Zap size={16} />
           </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-5 space-y-6 pb-32 no-scrollbar z-10">
        
        {/* Horizontal Calendar Ticker */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
           {['LIVE_NFL_FEED', 'CASINO_ENGINE', 'JACKPOT_READY', 'EDGE_DETECTED'].map((event, i) => (
             <div key={i} className="flex-shrink-0 bg-blue-900/10 border border-blue-500/20 px-4 py-2 rounded-xl flex items-center gap-3 foxy-bulge cursor-pointer hover:bg-blue-600/20">
                <Sparkles size={14} className="text-[#d4af37]" />
                <span className="text-[9px] font-black text-blue-300 uppercase whitespace-nowrap">{event}</span>
             </div>
           ))}
        </div>

        {activeTab === Tab.MARKETS && (
          <div className="space-y-6 steam-ingress">
            <div className="grid grid-cols-2 gap-4">
               <StatsCard label="Market Heat" value={<AnimatedCounter value={bets.length * 12} />} icon={<Globe size={16} />} />
               <StatsCard label="Alpha Core" value={safety.engineMode.replace('ENGINE_', '')} icon={<Activity size={16} />} />
            </div>

            {/* Tactical Strategy Console (Filters) */}
            <div className="bg-slate-900/60 border border-blue-500/30 p-6 rounded-[2.5rem] space-y-5 relative overflow-hidden group shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                  <Filters size={64} className="text-blue-500 rotate-12" />
               </div>
               <div className="flex justify-between items-center mb-1 relative z-10">
                  <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] flex items-center gap-2">
                    <Database size={12}/> Yield Parameters
                  </h3>
                  <div className="px-3 py-1 bg-black rounded-lg border border-blue-500/20 text-[10px] font-mono text-[#d4af37]">
                    +{filters.minOdds} / +{filters.maxOdds}
                  </div>
               </div>
               <div className="h-2 bg-black rounded-full relative overflow-hidden border border-white/5">
                  <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-blue-900 via-blue-500 to-blue-200 animate-pulse" />
               </div>
               <div className="grid grid-cols-3 gap-2 mt-2">
                  {['LOW_RISK', 'BALANCED', 'HIGH_ALPHA'].map(mode => (
                    <button key={mode} className="py-2 bg-white/5 rounded-xl text-[8px] font-black text-slate-500 border border-white/5 hover:border-blue-500 hover:text-white transition-all">
                       {mode}
                    </button>
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {bets.length === 0 && !isScouting && (
                <div className="text-center py-24 bg-blue-900/5 rounded-[3rem] border border-dashed border-blue-500/20">
                   <div className="size-16 bg-blue-600/5 rounded-full mx-auto mb-4 flex items-center justify-center border border-blue-500/10">
                      <RefreshCw size={24} className="text-blue-500/40" />
                   </div>
                   <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Ready for Ingest...</p>
                </div>
              )}
              {bets.map((bet, idx) => (
                <div key={bet.id} className="bg-slate-900/60 border border-blue-500/10 rounded-[2.5rem] p-8 hover:bg-slate-900/90 transition-all foxy-bulge group relative overflow-hidden shadow-2xl">
                   {/* Interlaced scanline effect on card */}
                   <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent h-1 opacity-20 group-hover:h-full transition-all duration-700 pointer-events-none" />
                   
                   <div className="absolute top-0 right-0 p-8">
                      <button onClick={(e) => toggleBookmark(bet.id, e)} className={`transition-all duration-300 ${bookmarks.includes(bet.id) ? 'text-[#d4af37] scale-125' : 'text-slate-800 hover:text-slate-600'}`}>
                         <Bookmark size={20} fill={bookmarks.includes(bet.id) ? "currentColor" : "none"} />
                      </button>
                   </div>
                   <div className="flex justify-between items-start mb-6">
                      <div className="space-y-2">
                         <div className="px-3 py-1 bg-blue-600/10 border border-blue-500/20 rounded-full text-[9px] font-black text-blue-400 uppercase tracking-widest inline-block">{bet.type}</div>
                         <h4 className="text-xl font-black text-white tracking-tighter group-hover:text-blue-400 transition-colors">{bet.event}</h4>
                      </div>
                      <div className="bg-black px-6 py-3 rounded-2xl border border-blue-500/30 text-2xl font-black text-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.2)] group-hover:scale-110 transition-transform">
                         {bet.odds > 0 ? `+${bet.odds}` : bet.odds}
                      </div>
                   </div>
                   <div className="flex justify-between items-center">
                      <div className="text-[11px] font-bold text-slate-500 flex items-center gap-2 group-hover:text-slate-300 transition-colors">
                        <Activity size={14} className="text-blue-500" /> {bet.marketName}
                      </div>
                      <button className="px-5 py-2 bg-blue-600 text-white text-[10px] font-black uppercase rounded-xl shadow-lg opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all active:scale-95">
                         Place Edge
                      </button>
                   </div>
                </div>
              ))}
            </div>

            {/* FIX: Render grounding sources to comply with mandatory search grounding documentation requirements */}
            {sources.length > 0 && (
              <div className="bg-slate-900/40 border border-blue-500/20 p-6 rounded-[2.5rem] mt-6 space-y-4 shadow-inner">
                <div className="flex items-center gap-2 px-2">
                  <Globe size={14} className="text-blue-400" />
                  <h5 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Verified Data Sources</h5>
                </div>
                <div className="flex flex-wrap gap-2 px-2">
                  {sources.map((s, i) => (
                    s.web && (
                      <a 
                        key={i} 
                        href={s.web.uri} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="px-4 py-2 bg-black/40 border border-white/5 rounded-xl text-[10px] font-bold text-slate-400 hover:text-blue-400 hover:border-blue-500/30 transition-all flex items-center gap-2 group"
                      >
                        <Link2 size={12} className="group-hover:rotate-45 transition-transform" />
                        {s.web.title || "External Market Data"}
                      </a>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === Tab.SETTINGS && (
          <div className="space-y-6 steam-ingress">
             <div className="bg-gradient-to-br from-blue-950/40 via-black to-black border border-blue-500/30 p-10 rounded-[3rem] space-y-8 shadow-[0_0_40px_rgba(59,130,246,0.1)]">
                <div className="flex items-center gap-6">
                   <div className="size-16 bg-blue-600 rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)] foxy-bulge border border-blue-400/50"><Smartphone size={32} /></div>
                   <div className="size-10 text-blue-900 animate-pulse"><Link2 size={32} /></div>
                   <div className="size-16 bg-slate-900 rounded-3xl flex items-center justify-center border border-white/10 foxy-bulge"><Laptop size={32} /></div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black italic tracking-tighter text-white">Quantum Bridge</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">Slave the Android cohort engine to your Windows Master station. Unified command and zero-latency terminal relay.</p>
                </div>
                
                {syncCode ? (
                  <div className="p-10 bg-black rounded-[2rem] border-2 border-blue-500/40 text-center shadow-[0_0_50px_rgba(59,130,246,0.2)]">
                     <span className="text-4xl font-mono font-black text-blue-400 tracking-[0.4em] drop-shadow-[0_0_10px_rgba(59,130,246,1)]">{syncCode}</span>
                  </div>
                ) : (
                  <button 
                    onClick={() => { soundService.playPowerUp(); setSyncCode('FX-' + Math.random().toString(36).substring(2, 6).toUpperCase()); }}
                    className="w-full py-5 bg-blue-600 text-white text-xs font-black uppercase rounded-2xl shadow-[0_10px_30px_rgba(59,130,246,0.4)] active:scale-95 transition-all foxy-bulge border-b-4 border-blue-800"
                  >
                    Initiate Platform Link
                  </button>
                )}
             </div>
          </div>
        )}

        {activeTab === Tab.SCRIPTS && (
          <div className="space-y-6 steam-ingress">
             <Terminal logs={['SYSTEM_ONLINE: V4.5_DOPAMINE_UNIT', 'INGEST_READY: /fanduel_cohort', 'STATUS: 100% NOMINAL']} onCommand={() => soundService.playDigitalClick()} />
             <button 
               onClick={(e) => runScout(e)}
               className="w-full py-8 bg-blue-600/10 border-2 border-blue-600/30 rounded-[3rem] flex flex-col items-center gap-3 group animate-thump foxy-bulge hover:bg-blue-600/20"
             >
                <div className="size-16 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.4)] border border-blue-400">
                  <RefreshCw size={32} className="text-white group-hover:rotate-180 transition-transform duration-500" />
                </div>
                <span className="text-xs font-black uppercase tracking-[0.5em] text-blue-400 group-hover:text-blue-200 transition-colors">Ingest Local Strategy</span>
             </button>
          </div>
        )}

        {/* FIX: Added Tab.SAFETY rendering logic which was previously missing */}
        {activeTab === Tab.SAFETY && (
          <div className="space-y-6 steam-ingress">
             <div className="bg-gradient-to-br from-blue-950/20 to-black border border-blue-500/20 p-8 rounded-[3rem] space-y-8">
                <div className="flex items-center gap-4">
                   <div className="size-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400">
                      <ShieldCheck size={28} />
                   </div>
                   <div>
                      <h3 className="text-xl font-black text-white italic tracking-tighter">Safe Play Core</h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Protection Layer</p>
                   </div>
                </div>
                
                <div className="grid gap-4">
                   {[
                     { label: 'Session Reminders', value: '30 MIN', active: true },
                     { label: 'Max Session Time', value: '120 MIN', active: true },
                     { label: 'Loss Limit Threshold', value: '$200.00', active: false },
                     { label: 'Reality Check Interval', value: '15 MIN', active: true }
                   ].map((item, i) => (
                     <div key={i} className="flex justify-between items-center p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-tight">{item.label}</span>
                        <div className="flex items-center gap-3">
                           <span className={`text-[10px] font-black px-3 py-1 rounded-lg ${item.active ? 'bg-blue-600/20 text-blue-400' : 'bg-slate-800 text-slate-500'}`}>
                              {item.value}
                           </span>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {(activeTab === Tab.PITCH || activeTab === Tab.DOCS) && (
          <div className="steam-ingress">
            {activeTab === Tab.PITCH ? <PitchDeck /> : <Documentation />}
          </div>
        )}

      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-3xl border-t border-blue-500/20 px-6 pb-12 pt-6 flex justify-around items-center z-[1000]">
        {[
          { id: Tab.MARKETS, icon: LayoutDashboard, label: 'Feed' },
          { id: Tab.SCRIPTS, icon: TerminalIcon, label: 'Scripts' },
          { id: Tab.SETTINGS, icon: SettingsIcon, label: 'Bridge' },
          { id: Tab.PITCH, icon: Presentation, label: 'Deck' },
          { id: Tab.SAFETY, icon: HeartHandshake, label: 'Safety' }
        ].map(t => (
          <button 
            key={t.id} 
            onClick={() => handleTabChange(t.id)}
            className={`flex flex-col items-center gap-3 transition-all outline-none foxy-bulge ${activeTab === t.id ? 'text-blue-400 scale-125 drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]' : 'text-slate-600 hover:text-slate-300'}`}
          >
            <t.icon size={22} strokeWidth={activeTab === t.id ? 3 : 2} />
            <span className="text-[9px] font-black uppercase tracking-widest">{t.label}</span>
          </button>
        ))}
      </nav>

      <style>{`
        @keyframes thump {
          0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(59, 130, 246, 0.2); }
          10% { transform: scale(1.05); box-shadow: 0 0 40px rgba(59, 130, 246, 0.5); }
        }
        .animate-thump { animation: thump 1.5s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default App;
