
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  RefreshCw, LayoutDashboard, Activity, Zap, Shield, Target, ShieldCheck, 
  Terminal as TerminalIcon, Link2, Crown, TrendingUp, Cpu, 
  Database, HardDrive, Smartphone, Radio, Settings, AlertTriangle,
  Coins, Spade, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Menu, FolderOpen,
  ExternalLink, Club, Heart, Diamond, Anchor, Sword, Info
} from 'lucide-react';
import { BetData, Tab, PsychState, BiometricTelemetry, Brand } from './types';
import { geminiService } from './services/geminiService';
import { soundService } from './services/soundService';
import { KingsCouncilIntro } from './components/KingsCouncilIntro';
import { FairbanksTitleCard } from './components/FairbanksTitleCard';
import { WarningOverlay } from './components/WarningOverlay';
import { KnowledgeBase } from './components/KnowledgeBase';
import Terminal from './components/Terminal';
import StatsCard from './components/StatsCard';
import { StrategyConsultant } from './components/StrategyConsultant';
import { MarketIntel } from './components/MarketIntel';

const App: React.FC = () => {
  const [bootState, setBootState] = useState<'FAIRBANKS_INTRO' | 'WARNING' | 'KINGS_INTRO' | 'SWIPE_TRANSITION' | 'READY' | 'FAIRBANKS_OUTRO'>('FAIRBANKS_INTRO');
  const [currentBrand, setCurrentBrand] = useState<Brand>(Brand.KINGS_COUNCIL);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.ALPHA_FLOW);
  const [showSidePanel, setShowSidePanel] = useState<null | 'LEFT' | 'RIGHT' | 'TOP' | 'BOTTOM'>(null);
  
  const [bets, setBets] = useState<BetData[]>([]);
  const [isScraping, setIsScraping] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>(['FAIRBANKS_IMPERIAL_BRIDGE_ACTIVE', 'COHORT_READY', 'MARKET_INTEL_LOADED']);

  const runFireflyScraper = useCallback(async () => {
    if (isScraping) return;
    setIsScraping(true);
    soundService.playDataCrunch();
    try {
      const result = await geminiService.scoutGlobalAlpha();
      setBets(result);
      if (result.length > 0) soundService.playJackpot();
    } catch (e) {
      console.error(e);
    } finally {
      setIsScraping(false);
    }
  }, [isScraping]);

  const handleIntroComplete = () => {
    setBootState('SWIPE_TRANSITION');
    setTimeout(() => setBootState('READY'), 1200);
  };

  if (bootState === 'FAIRBANKS_INTRO') return <FairbanksTitleCard mode="INTRO" onComplete={() => setBootState('WARNING')} />;
  if (bootState === 'WARNING') return <WarningOverlay onAccept={() => setBootState('KINGS_INTRO')} />;
  if (bootState === 'KINGS_INTRO') return <KingsCouncilIntro onComplete={handleIntroComplete} />;
  if (bootState === 'FAIRBANKS_OUTRO') return <FairbanksTitleCard mode="OUTRO" onComplete={() => window.close()} />;

  return (
    <div className={`min-h-screen w-full relative overflow-hidden flex flex-col transition-all duration-1000 ${currentBrand === Brand.FANDUEL_COHORT ? 'bg-[#000d1a]' : currentBrand === Brand.TITAN_UNIVERSAL ? 'bg-[#0f0f0f]' : 'bg-[#020400]'}`}>
      
      {/* 1800s Royal Casino Swipe Transition */}
      {bootState === 'SWIPE_TRANSITION' && (
        <div className="fixed inset-0 z-[40000] pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className="swipe-card flex items-center justify-center border-y border-[#f9e29c]/20" 
              style={{ 
                top: `${i * 20}vh`, 
                animationDelay: `${i * 0.08}s`,
                background: `linear-gradient(${i % 2 ? '135deg' : '225deg'}, #4d3a0d 0%, #d4af37 50%, #4d3a0d 100%)`
              }}
            >
              <div className="flex gap-24 opacity-20">
                {[Crown, Spade, Club, Diamond, Heart, Sword].map((Icon, idx) => (
                   <Icon key={idx} size={80} className="text-black/80" strokeWidth={1} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edge Swipe Activators */}
      <div className="absolute top-0 left-0 w-full h-8 z-[500] cursor-ns-resize hover:bg-[#d4af37]/10 transition-all flex items-center justify-center" onClick={() => setShowSidePanel('TOP')}>
         <ChevronDown size={14} className="text-[#d4af37] opacity-40" />
      </div>
      <div className="absolute bottom-0 left-0 w-full h-8 z-[500] cursor-ns-resize hover:bg-[#d4af37]/10 transition-all flex items-center justify-center" onClick={() => setShowSidePanel('BOTTOM')}>
         <ChevronUp size={14} className="text-[#d4af37] opacity-40" />
      </div>

      {/* Main Content */}
      <header className="px-12 py-8 border-b border-[#d4af37]/20 flex justify-between items-center bg-black/40 backdrop-blur-3xl z-10">
        <div className="flex items-center gap-12">
          <button onClick={() => setShowSidePanel('LEFT')} className="size-16 bg-[#d4af37] rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.3)] transition-all hover:scale-110 active:scale-95 group">
            <Menu size={32} className="text-black group-hover:rotate-90 transition-transform" />
          </button>
          <div>
            <div className="flex items-baseline gap-4">
               <h1 className="font-monarch text-3xl font-black text-white tracking-tighter uppercase">{currentBrand.replace('_', ' ')}</h1>
               <div className="px-3 py-1 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-lg text-[8px] font-tech text-[#d4af37] font-black tracking-widest uppercase">IMPERIAL EDITION</div>
            </div>
            <div className="text-[10px] font-tech text-[#f5e600] font-black uppercase tracking-[0.3em] mt-1 opacity-60">FAIRBANKS_IMPERIAL_LOGISTICS_NODE_4</div>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <button onClick={() => setBootState('FAIRBANKS_OUTRO')} className="px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 font-tech text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">TERMINATE_VAULT</button>
          <button onClick={runFireflyScraper} className="px-10 py-5 bg-[#d4af37] text-black font-monarch font-black text-xs uppercase tracking-widest rounded-xl flex items-center gap-4 hover:brightness-125 transition-all shadow-lg">
             {isScraping ? <div className="size-5 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <RefreshCw size={20} />}
             {isScraping ? 'SCRUTINIZING...' : 'SCRUTINIZE_ALPHA'}
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-[1600px] mx-auto w-full p-10 space-y-20 pb-64 relative z-10 overflow-y-auto no-scrollbar">
          <nav className="flex gap-4 p-2 bg-black/60 border border-white/5 rounded-[2rem] w-fit mx-auto sticky top-0 z-50 backdrop-blur-md shadow-2xl">
            {[Tab.ALPHA_FLOW, Tab.NEURAL_COMMAND, Tab.MARKET_INTEL, Tab.COHORT_ENGINE, Tab.ASSETS].map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`px-10 py-5 rounded-2xl font-monarch text-[11px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === tab ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/30' : 'text-slate-500 hover:text-white'}`}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </nav>

          {activeTab === Tab.ALPHA_FLOW && (
            <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12">
               <StatsCard suit="spades" label="Imperial Risk" value="12%" icon={<Shield size={26} />} />
               <StatsCard suit="hearts" label="Monarch Focus" value="98%" icon={<Activity size={26} />} trend={+2} />
               <StatsCard suit="diamonds" label="Market Conquests" value={bets.length} icon={<Target size={26} />} trend={+14} />
               <StatsCard suit="clubs" label="Sovereign Luck" value="EXALTED" icon={<Zap size={26} />} />
               
               <div className="col-span-full neon-card p-14 rounded-[4rem] bg-black/40 border-2 border-[#d4af37]/30 space-y-12 shadow-[inset_0_0_80px_rgba(212,175,55,0.05)]">
                  <div className="flex justify-between items-center">
                    <h2 className="font-monarch text-4xl font-black text-white uppercase tracking-tighter">Imperial Market Headers</h2>
                    <div className="flex items-center gap-4 text-[10px] font-tech text-[#d4af37]/60 font-black uppercase tracking-[0.5em]">
                       <span className="size-2 bg-[#d4af37] rounded-full animate-pulse" /> FEED: SOVEREIGN_ALPHA_LINK
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {bets.map(bet => (
                      <div key={bet.id} className="p-12 bg-white/5 border border-white/5 rounded-[2.5rem] hover:border-[#d4af37]/40 transition-all group relative overflow-hidden royal-glow">
                        <div className="flex justify-between items-start mb-8">
                           <span className="text-[10px] font-tech font-black text-[#d4af37] uppercase tracking-widest bg-[#d4af37]/10 px-6 py-2 rounded-xl border border-[#d4af37]/30">{bet.type}</span>
                           <div className="text-6xl font-monarch font-black text-white">{bet.odds}</div>
                        </div>
                        <h4 className="font-monarch text-2xl text-white uppercase tracking-tight mb-10 leading-snug">{bet.event}</h4>
                        <div className="flex justify-between items-center border-t border-white/10 pt-10">
                           <div className="text-[10px] font-tech text-slate-500 uppercase font-black tracking-widest">{bet.marketName}</div>
                           <button className="px-10 py-4 bg-[#d4af37] text-black font-monarch font-black text-[11px] rounded-xl hover:brightness-125 transition-all shadow-xl uppercase">Conquer</button>
                        </div>
                        {bet.sources && bet.sources.length > 0 && (
                          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-3">
                             {bet.sources.map((s, idx) => (
                               <a key={idx} href={s.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-[#d4af37]/5 border border-[#d4af37]/20 rounded-xl text-[9px] font-tech text-[#d4af37] font-black uppercase hover:bg-[#d4af37]/20 transition-all">
                                 <ExternalLink size={12} /> ARCHIVE_{idx + 1}
                               </a>
                             ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          )}

          {activeTab === Tab.NEURAL_COMMAND && <StrategyConsultant bets={bets} biometrics={{heartRateSim: 72, stressFactor: 12, focusIndex: 98, sessionDuration: 0}} psychState={PsychState.OPTIMAL} />}
          {activeTab === Tab.MARKET_INTEL && <MarketIntel />}
          {activeTab === Tab.COHORT_ENGINE && <Terminal logs={terminalLogs} onCommand={c => setTerminalLogs(p => [...p, c])} />}
          {activeTab === Tab.ASSETS && <KnowledgeBase />}
      </main>

      <div className="fixed bottom-0 left-0 w-full h-14 bg-black/95 backdrop-blur-3xl border-t border-[#d4af37]/20 z-50 flex items-center overflow-hidden px-12 cursor-pointer hover:bg-white/5 transition-all" onClick={() => setShowSidePanel('BOTTOM')}>
         <div className="flex items-center gap-12 animate-ticker whitespace-nowrap">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 text-[10px] font-tech text-slate-500 uppercase tracking-widest font-black">
                 <Crown size={14} className="text-[#d4af37]" />
                 <span>IMPERIAL_BRIDGE_NODE_{i}: STABLE</span>
                 <span className="text-[#d4af37] font-black">EDGE: {(Math.random() * 12).toFixed(2)}%</span>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default App;
