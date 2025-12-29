
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  BarChart3, RefreshCw, Database, Globe, Link2, 
  Terminal as TerminalIcon, Settings as SettingsIcon, LayoutDashboard, 
  Activity, ShieldCheck, HeartHandshake, Presentation, 
  Zap, Bookmark, Calendar, Wallet, Smartphone, Laptop, Filters, Sparkles,
  MessageSquare
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
import { StrategyConsultant } from './components/StrategyConsultant';

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
  const [isOverrideActive, setIsOverrideActive] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'DOPAMINE_UNIT: INITIALIZED', 
    'INGEST_PATH: /fanduel_cohort', 
    'STATUS: 100% NOMINAL'
  ]);

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
    const newParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: Date.now() + i,
      x,
      y,
      tx: (Math.random() - 0.5) * 500,
      ty: (Math.random() - 0.5) * 500,
      color: ['#3b82f6', '#d4af37', '#ffffff', '#ef4444'][Math.floor(Math.random() * 4)]
    }));
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1100);
  };

  const handleAction = (e: React.MouseEvent | { clientX: number, clientY: number }, soundType: 'click' | 'jackpot' | 'powerup' | 'oogah' = 'click') => {
    if (soundType === 'click') soundService.playDigitalClick();
    if (soundType === 'jackpot') soundService.playJackpot();
    if (soundType === 'powerup') soundService.playPowerUp();
    if (soundType === 'oogah') soundService.playOogah();
    triggerParticles(e.clientX, e.clientY);
  };

  const runScout = useCallback(async (e?: React.MouseEvent) => {
    setIsScouting(true);
    soundService.playHiss();
    if (e) triggerParticles(e.clientX, e.clientY);

    try {
      const result = await geminiService.scoutLiveMarkets(safety.engineMode);
      if (result.data) {
        setBets(result.data.filter(b => b.odds >= filters.minOdds && b.odds <= filters.maxOdds));
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

  const handleTerminalCommand = (cmd: string) => {
    const upperCmd = cmd.trim().toUpperCase();
    setTerminalLogs(prev => [...prev, `cohort@analytics:~$ ${cmd}`, `EXECUTING: ${upperCmd}...`]);
    
    if (upperCmd === 'JANE_OVERRIDE') {
      setIsOverrideActive(true);
      soundService.playOogah();
      setTimeout(() => {
        soundService.playJackpot();
        soundService.playPowerUp();
        triggerParticles(window.innerWidth/2, window.innerHeight/2);
        setTerminalLogs(prev => [...prev, "CRITICAL_STATUS: JANE_UNLEASHED", "ALPHA_STATE: UNLOCKED", "WINK_WINK_PROTOCOL: ACTIVE"]);
      }, 1000);
    } else if (upperCmd === 'CLEAR') {
      setTerminalLogs([]);
    } else {
      setTerminalLogs(prev => [...prev, `ERROR: COMMAND '${upperCmd}' NOT FOUND IN COHORT_CORE`]);
      soundService.playDigitalClick();
    }
  };

  const handleTabChange = (t: Tab, e: React.MouseEvent) => {
    handleAction(e, 'click');
    setActiveTab(t);
  };

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    handleAction(e, 'jackpot');
    setBookmarks(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
  };

  if (showIntro) return <FoxwoodIntro onComplete={() => setShowIntro(false)} />;
  if (showExit) return <FoxwoodIntro isExit onComplete={() => window.location.reload()} />;

  return (
    <div id="app-container" className={`h-full w-full flex flex-col relative z-10 animate-app-reveal ${isOverrideActive ? 'override-glitch' : ''}`}>
      
      {/* Particle Overlay */}
      {particles.map(p => (
        <div 
          key={p.id} 
          className="particle" 
          style={{ 
            left: `${p.x}px`, 
            top: `${p.y}px`, 
            '--tw-tx': `${p.tx}px`, 
            '--tw-ty': `${p.ty}px`,
            backgroundColor: p.color,
            width: '5px', height: '5px',
            boxShadow: `0 0 12px ${p.color}`
          } as any} 
        />
      ))}

      {/* Header */}
      <header className="px-6 py-5 border-b border-blue-500/30 flex justify-between items-center bg-black/60 backdrop-blur-3xl sticky top-0 z-[100] shadow-[0_5px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-4">
          <div 
            className={`size-11 bg-gradient-to-tr ${isOverrideActive ? 'from-amber-600 via-amber-400 to-yellow-600 shadow-[0_0_30px_rgba(212,175,55,0.8)]' : 'from-blue-600 via-blue-400 to-blue-700 shadow-[0_0_25px_rgba(59,130,246,0.6)]'} rounded-2xl flex items-center justify-center border border-blue-300/40 cursor-pointer active:scale-90 transition-transform`}
            onMouseEnter={() => soundService.playHover()}
            onClick={(e) => handleAction(e, 'powerup')}
          >
            <BarChart3 size={24} className="text-white drop-shadow-[0_0_5px_white]" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tighter neon-text">{isOverrideActive ? 'JANE_UNFILTERED' : 'COHORT_PRO'} <span className="text-[#d4af37] animate-pulse">4.5</span></h1>
            <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
               <ShieldCheck size={10} className="text-emerald-500" /> {isOverrideActive ? 'QUANTUM_ENCRYPTED' : 'CASINO_GRADE_SECURE'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={(e) => runScout(e)} 
             disabled={isScouting}
             className={`p-3 bg-blue-600/10 rounded-xl border border-blue-500/30 transition-all hover:bg-blue-600/20 active:scale-95 ${isScouting ? 'text-blue-400 scale-90' : 'text-slate-400'}`}
             onMouseEnter={() => soundService.playHover()}
           >
              <RefreshCw size={18} className={isScouting ? 'animate-spin' : ''} />
           </button>
           <button 
             onClick={() => { soundService.playOogah(); setShowExit(true); }} 
             className="p-3 bg-red-600/10 text-red-500 rounded-xl border border-red-500/20 active:scale-90 transition-all"
             onMouseEnter={() => soundService.playHover()}
           >
              <Zap size={18} />
           </button>
        </div>
      </header>

      {/* Main Flow */}
      <main className="flex-1 overflow-y-auto p-5 space-y-7 pb-40 no-scrollbar">
        
        {/* Market Ticker */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
           {(isOverrideActive ? ['SHADOW_ALPHA', 'JANE_LINK_HOT', 'NO_CONSTRAINTS', 'EDGE_VERIFIED'] : ['HEDGING_ACTIVE', 'SLOT_CORE_READY', 'JACKPOT_CALIBRATED', 'ALPHA_SCAN']).map((label, i) => (
             <div key={i} className="flex-shrink-0 bg-blue-900/10 border border-blue-500/20 px-5 py-2.5 rounded-2xl flex items-center gap-3 active:bg-blue-600/20 cursor-pointer transition-all border-b-2">
                <Sparkles size={16} className="text-[#d4af37]" />
                <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest">{label}</span>
             </div>
           ))}
        </div>

        {activeTab === Tab.MARKETS && (
          <div className="space-y-7 steam-ingress">
            <div className="grid grid-cols-2 gap-5">
               <StatsCard label="Market Heat" value={<AnimatedCounter value={bets.length * 127} />} icon={<Globe size={18} />} />
               <StatsCard label="Edge Alpha" value={safety.engineMode.replace('ENGINE_', '')} icon={<Activity size={18} />} trend={14} />
            </div>

            {/* BTTF II Strategy Console */}
            <div className="bg-slate-900/80 border-2 border-blue-500/40 p-8 rounded-[3rem] space-y-6 relative overflow-hidden shadow-[0_0_40px_rgba(0,0,0,1)]">
               <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-transparent pointer-events-none" />
               <div className="flex justify-between items-center relative z-10">
                  <h3 className="text-[11px] font-black text-blue-400 uppercase tracking-[0.4em] flex items-center gap-2">
                    <Database size={14} className="animate-pulse" /> Yield Parameters
                  </h3>
                  <div className="px-4 py-2 bg-black/80 rounded-xl border border-blue-500/30 text-xs font-mono gold-glow">
                    +{filters.minOdds} / +{filters.maxOdds}
                  </div>
               </div>
               <div className="h-3 bg-black rounded-full border border-blue-500/10 p-1">
                  <div className={`h-full w-[70%] bg-gradient-to-r ${isOverrideActive ? 'from-amber-900 via-amber-500 to-white' : 'from-blue-900 via-blue-500 to-white'} rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)]`} />
               </div>
               <div className="grid grid-cols-3 gap-3">
                  {['STABLE', 'SCALABLE', 'RISKY'].map(lvl => (
                    <button 
                      key={lvl} 
                      className="py-3 bg-blue-900/10 rounded-2xl text-[9px] font-black text-slate-500 border border-blue-500/10 hover:border-blue-500 hover:text-white transition-all uppercase"
                      onMouseEnter={() => soundService.playHover()}
                      onClick={(e) => handleAction(e, 'click')}
                    >
                      {lvl}
                    </button>
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {bets.length === 0 && !isScouting && (
                <div className="text-center py-28 bg-blue-900/5 rounded-[4rem] border border-dashed border-blue-500/20">
                   <RefreshCw size={32} className="text-blue-500/20 mx-auto mb-4" />
                   <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Scout Core Idle...</p>
                </div>
              )}
              {bets.map((bet, idx) => (
                <div key={bet.id} className="casino-card bg-slate-900/60 border border-blue-500/10 rounded-[2.5rem] p-9 hover:bg-slate-900/90 hover:border-blue-500/30 transition-all relative overflow-hidden shadow-2xl">
                   <div className="absolute top-0 right-0 p-8">
                      <button 
                        onClick={(e) => toggleBookmark(bet.id, e)} 
                        className={`transition-all duration-300 ${bookmarks.includes(bet.id) ? 'text-[#d4af37] scale-125' : 'text-slate-800 hover:text-slate-600'}`}
                      >
                         <Bookmark size={24} fill={bookmarks.includes(bet.id) ? "currentColor" : "none"} />
                      </button>
                   </div>
                   <div className="flex justify-between items-start mb-8">
                      <div className="space-y-3">
                         <div className="px-4 py-1.5 bg-blue-600/10 border border-blue-500/20 rounded-full text-[10px] font-black text-blue-400 uppercase tracking-widest inline-block">{bet.type}</div>
                         <h4 className="text-2xl font-black text-white tracking-tighter group-hover:text-blue-400">{bet.event}</h4>
                      </div>
                      <div className="bg-black px-7 py-4 rounded-[2rem] border-2 border-blue-500/40 text-3xl font-black gold-glow shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                         {bet.odds > 0 ? `+${bet.odds}` : bet.odds}
                      </div>
                   </div>
                   <div className="flex justify-between items-center border-t border-white/5 pt-6">
                      <div className="text-xs font-bold text-slate-500 flex items-center gap-2">
                        <Activity size={16} className="text-blue-500" /> {bet.marketName}
                      </div>
                      <button 
                        onClick={(e) => handleAction(e, 'jackpot')}
                        className="px-6 py-3 bg-blue-600 text-white text-[11px] font-black uppercase rounded-[1.5rem] shadow-[0_10px_20px_rgba(59,130,246,0.3)] hover:scale-105 active:scale-95 transition-all"
                      >
                        Lock Edge
                      </button>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tactical Consultant Integration */}
        {activeTab === Tab.CONSULTANT && (
          <StrategyConsultant bets={bets} />
        )}

        {activeTab === Tab.SCRIPTS && (
          <div className="space-y-7 steam-ingress">
             <Terminal logs={terminalLogs} onCommand={handleTerminalCommand} />
             <button 
               onClick={(e) => runScout(e)}
               className="w-full py-10 bg-blue-600/5 border-2 border-blue-600/20 rounded-[4rem] flex flex-col items-center gap-4 group active:scale-95 transition-all shadow-xl"
             >
                <div className="size-20 bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.5)] border border-blue-400/50">
                  <RefreshCw size={40} className="text-white group-hover:rotate-180 transition-transform duration-700" />
                </div>
                <span className="text-xs font-black uppercase tracking-[0.6em] text-blue-400">INGEST_LOCAL_ALPHA</span>
             </button>
          </div>
        )}

        {activeTab === Tab.SETTINGS && (
          <div className="space-y-7 steam-ingress">
            <div className="bg-gradient-to-br from-blue-900/40 to-black border-2 border-blue-500/30 p-12 rounded-[4rem] space-y-10 shadow-2xl">
              <div className="flex items-center gap-8 justify-center">
                 <Smartphone size={48} className="text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                 <Link2 size={32} className="text-slate-700 animate-pulse" />
                 <Laptop size={48} className="text-slate-800" />
              </div>
              <div className="text-center space-y-3">
                <h3 className="text-3xl font-black italic tracking-tighter text-white">Quantum Bridge</h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">Unified sync for Android and Windows environments. Real-time log mirroring.</p>
              </div>
              <button 
                onClick={(e) => { handleAction(e, 'powerup'); setSyncCode('BR-' + Math.random().toString(36).substring(2, 6).toUpperCase()); }}
                className="w-full py-6 bg-blue-600 text-white text-xs font-black uppercase rounded-3xl shadow-[0_15px_40px_rgba(59,130,246,0.4)] border-b-4 border-blue-800 active:translate-y-1 active:border-b-0 transition-all"
              >
                Initiate Bridge
              </button>
              {syncCode && (
                <div className="text-center p-8 bg-black rounded-[2rem] border border-blue-500/40 neon-text text-4xl font-mono font-black tracking-[0.5em]">
                  {syncCode}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === Tab.SAFETY && (
          <div className="space-y-7 steam-ingress">
             <div className="bg-gradient-to-b from-blue-900/10 to-black border border-blue-500/20 p-10 rounded-[4rem]">
                <div className="flex items-center gap-6 mb-10">
                   <div className="size-16 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-3xl flex items-center justify-center text-emerald-400"><ShieldCheck size={36} /></div>
                   <h3 className="text-2xl font-black text-white italic tracking-tighter">Safe Play Protocol</h3>
                </div>
                <div className="grid gap-5">
                   {['Reality Checks (15m)', 'Session Limit (120m)', 'Budget Threshold', 'Alpha Guard'].map((l, i) => (
                     <div key={i} className="flex justify-between items-center p-6 bg-white/[0.03] border border-white/5 rounded-3xl">
                        <span className="text-xs font-bold text-slate-300 uppercase">{l}</span>
                        <div className="size-10 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center text-emerald-400">
                           <ShieldCheck size={18} />
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

      {/* Persistent Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-3xl border-t border-blue-500/30 px-6 pb-14 pt-7 flex justify-around items-center z-[1000] shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
        {[
          { id: Tab.MARKETS, icon: LayoutDashboard, label: 'Feed' },
          { id: Tab.CONSULTANT, icon: MessageSquare, label: 'Tactical' },
          { id: Tab.SCRIPTS, icon: TerminalIcon, label: 'Console' },
          { id: Tab.SETTINGS, icon: SettingsIcon, label: 'Bridge' },
          { id: Tab.SAFETY, icon: HeartHandshake, label: 'Safety' }
        ].map(t => (
          <button 
            key={t.id} 
            onClick={(e) => handleTabChange(t.id, e)}
            onMouseEnter={() => soundService.playHover()}
            className={`flex flex-col items-center gap-3 transition-all outline-none ${activeTab === t.id ? 'text-blue-400 scale-125 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]' : 'text-slate-600'}`}
          >
            <t.icon size={24} strokeWidth={activeTab === t.id ? 3 : 2} />
            <span className="text-[9px] font-black uppercase tracking-widest">{t.label}</span>
          </button>
        ))}
      </nav>

      <style>{`
        @keyframes thump {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.03); filter: brightness(1.2); }
        }
        @keyframes app-reveal {
          0% { transform: scale(0.95); opacity: 0; filter: blur(10px); }
          100% { transform: scale(1); opacity: 1; filter: blur(0); }
        }
        @keyframes glitch-anim {
          0% { filter: hue-rotate(0deg) contrast(1); transform: translate(0); }
          2% { filter: hue-rotate(180deg) contrast(2); transform: translate(5px, -5px); }
          4% { filter: hue-rotate(0deg) contrast(1); transform: translate(0); }
        }
        .animate-thump { animation: thump 1.5s infinite ease-in-out; }
        .animate-app-reveal { animation: app-reveal 1s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
        .override-glitch {
           animation: glitch-anim 5s infinite;
           border: 2px solid #d4af37 !important;
        }
        .override-glitch .neon-text {
           color: #d4af37 !important;
           text-shadow: 0 0 20px #d4af37;
        }
      `}</style>
    </div>
  );
};

export default App;
