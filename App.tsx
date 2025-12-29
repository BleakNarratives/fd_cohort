
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  BarChart3, RefreshCw, Database, Search, Target, Globe, Link2, 
  Terminal as TerminalIcon, Settings as SettingsIcon, LayoutDashboard, 
  TrendingUp, Activity, ChevronRight, AlertCircle, Info, ShieldCheck,
  Clock, HeartHandshake, ExternalLink
} from 'lucide-react';
import { BetData, Tab, SafetySettings } from './types';
import { geminiService } from './services/geminiService';
import { VoiceController } from './components/VoiceController';
import Terminal from './components/Terminal';
import StatsCard from './components/StatsCard';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.MARKETS);
  const [bets, setBets] = useState<BetData[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [isScouting, setIsScouting] = useState(false);
  const [scriptLogs, setScriptLogs] = useState<string[]>([]);
  const [sessionTime, setSessionTime] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  
  const [safety] = useState<SafetySettings>({
    sessionWarnings: true,
    warningInterval: 30,
    maxSessionTime: 120
  });

  // Session Timer Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => {
        const next = prev + 1;
        if (safety.sessionWarnings && next % (safety.warningInterval * 60) === 0) {
          setShowWarning(true);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [safety]);

  const runScout = useCallback(async () => {
    setIsScouting(true);
    const result = await geminiService.scoutLiveMarkets();
    if (result.data && result.data.length > 0) {
      setBets(result.data);
      setSources(result.sources);
    }
    setIsScouting(false);
  }, []);

  const handleCommand = useCallback((cmd: string) => {
    setScriptLogs(prev => [
      ...prev, 
      `cohort@analytics:~$ ${cmd}`, 
      `[PROCESS]: Routing call to /storage/emulated/0/root_2025/fanduel_cohort/`,
      `[STATUS]: Command dispatched to local script environment.`
    ]);
  }, []);

  useEffect(() => {
    runScout();
  }, [runScout]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins}m active`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-100 font-sans select-none overflow-hidden relative">
      
      {/* Dynamic Background "Casino" Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#d4af37]/5 blur-[120px] pointer-events-none rounded-full" />

      {/* Professional Header */}
      <header className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-[#1e293b]/60 backdrop-blur-xl sticky top-0 z-[100]">
        <div className="flex items-center gap-3">
          <div className="size-10 bg-gradient-to-br from-[#1d4ed8] to-[#1e40af] rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/40 border border-white/10">
            <BarChart3 size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight">FAN<span className="text-[#1d4ed8]">DUEL</span>_COHORT</h1>
            <div className="text-[9px] font-bold text-slate-400 uppercase flex gap-2">
               <span className="text-emerald-400 flex items-center gap-1"><Activity size={8} /> LIVE_FEED</span>
               <span className="text-slate-500">|</span>
               <span className="text-[#d4af37] flex items-center gap-1"><ShieldCheck size={8} /> DATA_SECURED</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <div className="hidden md:flex flex-col items-end">
              <span className="text-[8px] font-black text-slate-500 uppercase">Session Status</span>
              <span className="text-[10px] font-mono text-blue-400 font-bold">{formatTime(sessionTime)}</span>
           </div>
           <button 
             onClick={runScout} 
             disabled={isScouting}
             className={`p-2.5 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors ${isScouting ? 'animate-spin text-blue-400' : 'text-slate-400'}`}
           >
              <RefreshCw size={18} />
           </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-5 space-y-6 pb-32 no-scrollbar relative z-10">
        
        {/* Realty Check Warning */}
        {showWarning && (
          <div className="bg-[#d4af37]/10 border border-[#d4af37]/30 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
            <AlertCircle size={20} className="text-[#d4af37] shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <p className="text-[11px] font-bold text-[#d4af37] uppercase tracking-wide">Reality Check</p>
              <p className="text-[10px] text-slate-300 leading-relaxed">You have been analyzing for {safety.warningInterval} minutes. Taking short breaks helps maintain objectivity.</p>
              <button 
                onClick={() => setShowWarning(false)}
                className="text-[9px] font-black text-white bg-[#d4af37]/20 px-3 py-1 rounded-md uppercase mt-1 hover:bg-[#d4af37]/30 transition-colors"
              >
                Acknowledge
              </button>
            </div>
          </div>
        )}

        {/* Market Data Tab */}
        {activeTab === Tab.MARKETS && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-2 gap-4">
               <StatsCard 
                 label="Active Markets" 
                 value={bets.length} 
                 icon={<Globe size={16} />} 
               />
               <StatsCard 
                 label="Verified Sources" 
                 value={sources.length} 
                 icon={<ShieldCheck size={16} />} 
               />
            </div>

            <div className="flex justify-between items-center px-1">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                Live Data Ingest
              </h3>
              <div className="h-px flex-1 bg-gradient-to-r from-white/5 to-transparent ml-4" />
            </div>

            {bets.length === 0 && !isScouting && (
              <div className="bg-slate-800/20 border-2 border-dashed border-slate-700/30 p-12 rounded-[2.5rem] text-center space-y-4 backdrop-blur-sm">
                 <div className="size-16 bg-blue-600/5 rounded-full flex items-center justify-center mx-auto border border-blue-500/10">
                    <Search size={28} className="text-slate-600" />
                 </div>
                 <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-300">No active events found</p>
                    <p className="text-xs text-slate-500 px-8">The AI engine is ready to search FanDuel for live market odds and trends.</p>
                 </div>
                 <button onClick={runScout} className="px-8 py-3 bg-[#1d4ed8] rounded-full text-[10px] font-black uppercase hover:bg-blue-600 transition-all shadow-xl shadow-blue-900/40">
                    Refresh Scout
                 </button>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              {bets.map(bet => (
                <div key={bet.id} className="bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-3xl p-6 hover:bg-white/[0.05] transition-all group relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 group-hover:bg-[#d4af37] transition-colors" />
                   <div className="flex justify-between items-start mb-4">
                      <div className="space-y-1">
                         <div className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter group-hover:text-[#d4af37] transition-colors">{bet.type || 'MARKET'}</div>
                         <h4 className="text-lg font-bold text-white tracking-tight leading-tight">{bet.event}</h4>
                      </div>
                      <div className="bg-blue-600/5 px-4 py-2 rounded-xl border border-blue-500/10 text-xs font-mono font-black text-blue-400 group-hover:text-[#d4af37] group-hover:border-[#d4af37]/20 transition-all shadow-inner">
                         {bet.odds > 0 ? `+${bet.odds}` : bet.odds}
                      </div>
                   </div>
                   <div className="flex justify-between items-center pt-5 border-t border-white/5">
                      <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-2">
                        <Activity size={12} className="text-slate-500" /> {bet.marketName}
                      </div>
                      {bet.groundingSource && (
                        <a href={bet.groundingSource} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-blue-400 flex items-center gap-1.5 hover:text-white transition-all">
                           <Link2 size={12} /> Source Verified
                        </a>
                      )}
                   </div>
                </div>
              ))}
            </div>
            
            <VoiceController onTriggerAnalysis={runScout} />
          </div>
        )}

        {/* Responsible Play Tab */}
        {activeTab === Tab.RESPONSIBLE_PLAY && (
          <div className="space-y-6 animate-in fade-in duration-300">
             <div className="bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/10 p-10 rounded-[2.5rem] text-center space-y-4">
                <HeartHandshake size={36} className="mx-auto text-[#d4af37]" />
                <h2 className="text-2xl font-black tracking-tight">Responsible Play</h2>
                <p className="text-xs text-slate-400 leading-relaxed px-4">
                  Analytics tools are designed for objective insight. Maintain balance and stay in control of your strategy.
                </p>
             </div>

             <div className="space-y-4">
                <div className="bg-white/[0.03] border border-white/5 p-6 rounded-3xl space-y-4">
                   <div className="flex items-center gap-3 text-white">
                      <Clock size={18} className="text-blue-400" />
                      <h3 className="text-sm font-bold">Session Health</h3>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">Current Session Time</span>
                      <span className="text-xs font-mono font-bold text-blue-400">{formatTime(sessionTime)}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">Reality Check Threshold</span>
                      <span className="text-xs font-bold text-slate-300">{safety.warningInterval} Minutes</span>
                   </div>
                </div>

                <div className="bg-white/[0.03] border border-white/5 p-6 rounded-3xl space-y-4">
                   <div className="flex items-center gap-3 text-white">
                      <ExternalLink size={18} className="text-emerald-400" />
                      <h3 className="text-sm font-bold">Support Resources</h3>
                   </div>
                   <div className="grid grid-cols-1 gap-2">
                      <a href="https://www.ncpgambling.org" target="_blank" className="p-4 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-center hover:bg-white/10 transition-all">
                         <div className="space-y-0.5">
                            <span className="block text-[11px] font-bold text-slate-200">National Council on Problem Gambling</span>
                            <span className="block text-[9px] text-slate-500">24/7 Confidential Help</span>
                         </div>
                         <ChevronRight size={14} className="text-slate-600" />
                      </a>
                      <a href="tel:18005224700" className="p-4 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-center hover:bg-white/10 transition-all">
                         <div className="space-y-0.5">
                            <span className="block text-[11px] font-bold text-slate-200">1-800-GAMBLER</span>
                            <span className="block text-[9px] text-slate-500">Call or Text Support</span>
                         </div>
                         <ChevronRight size={14} className="text-slate-600" />
                      </a>
                   </div>
                </div>

                <div className="p-6 bg-slate-900/50 rounded-3xl border border-white/5">
                   <p className="text-[10px] text-slate-500 leading-relaxed italic">
                     Disclaimer: FanDuel Cohort is an analytics software platform. Use of this data is at the user's discretion. Odds and predictions provided are for informational purposes only. If you or someone you know has a gambling problem, please call 1-800-GAMBLER.
                   </p>
                </div>
             </div>
          </div>
        )}

        {/* Script Console Tab */}
        {activeTab === Tab.SCRIPTS && (
          <div className="space-y-6 animate-in fade-in duration-300">
             <div className="flex justify-between items-center px-1">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <TerminalIcon size={12} className="text-blue-500" /> Script Execution Log
                </h3>
             </div>
             <Terminal logs={scriptLogs} onCommand={handleCommand} />
             <div className="bg-white/[0.03] border border-white/5 p-5 rounded-3xl space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
                  <Database size={12} /> Root Path: /fanduel_cohort
                </div>
                <div className="grid grid-cols-1 gap-2.5">
                   {[
                     { label: 'Execute Backtest Routine', cmd: 'python backtest.py --market current', desc: 'Strategy validation vs. historical lines.' },
                     { label: 'Deep Sector Analysis', cmd: 'python scout_extended.py --deep', desc: 'Search of alternate/prop markets.' }
                   ].map((item, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleCommand(item.cmd)} 
                      className="p-4 bg-white/5 border border-white/10 rounded-2xl text-left flex justify-between items-center group hover:border-[#d4af37]/30 hover:bg-white/10 transition-all"
                    >
                       <div className="space-y-1">
                          <span className="block text-[11px] font-extrabold text-slate-200">{item.label}</span>
                          <span className="block text-[9px] text-slate-500 font-medium">{item.desc}</span>
                       </div>
                       <ChevronRight size={16} className="text-slate-600 group-hover:text-[#d4af37] group-hover:translate-x-1 transition-all" />
                    </button>
                   ))}
                </div>
             </div>
          </div>
        )}

      </main>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#020617]/95 backdrop-blur-3xl border-t border-white/5 px-8 pb-10 pt-4 flex justify-around items-center z-[1000]">
        {[
          { id: Tab.MARKETS, icon: LayoutDashboard, label: 'Analytics' },
          { id: Tab.SCRIPTS, icon: TerminalIcon, label: 'Scripts' },
          { id: Tab.RESPONSIBLE_PLAY, icon: HeartHandshake, label: 'Safety' },
          { id: Tab.SETTINGS, icon: SettingsIcon, label: 'Config' }
        ].map(t => (
          <button 
            key={t.id} 
            onClick={() => setActiveTab(t.id)}
            className={`flex flex-col items-center gap-2 transition-all outline-none ${activeTab === t.id ? 'text-blue-400 scale-110' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <t.icon size={22} strokeWidth={activeTab === t.id ? 2.5 : 2} className={activeTab === t.id ? (t.id === Tab.RESPONSIBLE_PLAY ? 'text-[#d4af37]' : 'text-blue-400') : ''} />
            <span className="text-[9px] font-black uppercase tracking-wider">{t.label}</span>
          </button>
        ))}
      </nav>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        body { -webkit-tap-highlight-color: transparent; background: #020617; }
        * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .group:hover .shine-effect {
          animation: shine 1s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default App;
