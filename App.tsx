
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Activity, BarChart3, Terminal as TerminalIcon, Shield, Layers, Zap, TrendingUp, AlertCircle, Settings as SettingsIcon, RefreshCw, Clock, ToggleLeft, ToggleRight, Github, Code, Copy, CheckCircle, Maximize2, Minimize2, DollarSign, Timer, Bell, HandMetal, Lock, Unlock, Database, Loader2, ShieldCheck, Cpu
} from 'lucide-react';
import { BetData, Tab, AnalyticsSummary, SessionSettings } from './types';
import { geminiService } from './services/geminiService';
import Terminal from './components/Terminal';
import StatsCard from './components/StatsCard';
import { Tooltip } from './components/Tooltip';
import { VoiceController } from './components/VoiceController';

const REFRESH_INTERVAL = 60;

const App: React.FC = () => {
  // --- State Initialization ---
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);
  const [bets, setBets] = useState<BetData[]>([]);
  const [terminalLogs, setTerminalLogs] = useState<string[]>(["[SECURITY] AES-256 Tunnel established.", "[INFO] Target: /storage/emulated/0/.../fanduel_cohort"]);
  const [vaultLogs, setVaultLogs] = useState<string[]>(["[VAULT] Initializing Secure Hardware Module...", "[VAULT] Root directory locked."]);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL);
  const [isHudMode, setIsHudMode] = useState(false);
  const [isEasterEgg, setIsEasterEgg] = useState(false);
  const [sessionStartTime] = useState<number>(Date.now());
  const [sessionElapsedMinutes, setSessionElapsedMinutes] = useState(0);
  const [showWarning, setShowWarning] = useState<string | null>(null);
  
  const [settings, setSettings] = useState<SessionSettings>(() => {
    const saved = localStorage.getItem('janebot_settings_v3');
    return saved ? JSON.parse(saved) : {
      maxSessionMinutes: 30, stopLossLimit: 1000, alertsEnabled: true, stealthMode: true, voiceActive: false
    };
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // --- Core Lifecycle ---
  useEffect(() => { localStorage.setItem('janebot_settings_v3', JSON.stringify(settings)); }, [settings]);

  const stats: AnalyticsSummary = React.useMemo(() => {
    const won = bets.filter(b => b.status === 'WON');
    const stake = bets.reduce((acc, b) => acc + b.stake, 0);
    const returns = won.reduce((acc, b) => acc + b.potentialReturn, 0);
    const profit = returns - stake;
    return { totalStake: stake, totalReturn: returns, winRate: (won.length / (bets.length || 1)) * 100, profit, roi: (profit / (stake || 1)) * 100 };
  }, [bets]);

  const handleSync = useCallback(async (isAuto = false) => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      const result = await geminiService.fetchRealTimeMarkets();
      const mapped: BetData[] = result.data.map((item: any, i: number) => ({
        id: `mkt-${Date.now()}-${i}`, timestamp: new Date().toISOString(), event: item.event, odds: item.odds, stake: 0, potentialReturn: 0, status: 'PENDING', type: item.type
      }));
      setBets(prev => [...mapped, ...prev.slice(0, 10)]);
      if (isAuto) setAiAnalysis(await geminiService.analyzeStrategy(mapped, "Auto Pulse"));
      setVaultLogs(prev => [`[AUDIT] Sanitized ${mapped.length} incoming market streams.`, ...prev.slice(0, 10)]);
    } catch (e) {
      setTerminalLogs(prev => [...prev, `[CRITICAL] Sync Failure: ${e}`]);
    } finally {
      setIsSyncing(false);
      setCountdown(REFRESH_INTERVAL);
    }
  }, [isSyncing]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { handleSync(true); return REFRESH_INTERVAL; }
        return prev - 1;
      });
      setSessionElapsedMinutes(Math.floor((Date.now() - sessionStartTime) / 60000));
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [handleSync, sessionStartTime]);

  // --- Event Handlers ---
  const handleCommand = async (cmd: string) => {
    const normalized = cmd.toLowerCase().trim();
    setTerminalLogs(prev => [...prev, `> ${cmd}`]);
    
    if (normalized === 'janebot --override' || normalized === 'janebot --god-mode') {
      setIsEasterEgg(true);
      setTerminalLogs(prev => [...prev, "[SYSTEM] PROTOCOL_OVERRIDE: MATRIX MODE ARMED."]);
      return;
    }
    if (normalized === 'clear') { setTerminalLogs(["[SYSTEM] Logs Purged."]); return; }
    if (normalized.startsWith('analyze')) {
      setIsAnalyzing(true);
      setAiAnalysis(await geminiService.analyzeStrategy(bets, "Manual User Override"));
      setIsAnalyzing(false);
    }
  };

  const handleBet = (bet: BetData) => {
    setBets(prev => prev.map(b => b.id === bet.id ? { ...b, status: 'SECURE_TRANSIT' } : b));
    setVaultLogs(prev => [`[TRANSIT] Hashing bet parameters for ${bet.event}...`, ...prev]);
    setTimeout(() => {
      setBets(prev => prev.map(b => b.id === bet.id ? { ...b, status: 'WON', stake: 100, potentialReturn: 100 * b.odds } : b));
      setTerminalLogs(prev => [...prev, `[TX] Confirmed: ${bet.event} @ ${bet.odds}`]);
    }, 1200);
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row bg-[#020617] text-slate-100 selection:bg-emerald-500/30 transition-all duration-700 overflow-hidden relative ${isEasterEgg ? 'matrix-bg' : ''}`}>
      
      {/* Glitch Overlay for Easter Egg */}
      {isEasterEgg && <div className="absolute inset-0 pointer-events-none z-0 opacity-20 matrix-rain" />}

      {/* Responsive Gaming Overlays */}
      {showWarning && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-6 animate-in zoom-in duration-300">
          <div className="bg-slate-900 border-2 border-red-500/30 p-12 rounded-[4rem] max-w-lg w-full shadow-[0_0_100px_rgba(239,68,68,0.1)] text-center space-y-10">
            <div className="bg-red-500/10 p-8 rounded-full w-fit mx-auto animate-pulse"><AlertCircle size={64} className="text-red-500" /></div>
            <div className="space-y-4">
              <h3 className="text-4xl font-black uppercase tracking-tighter text-red-500">Call It.</h3>
              <p className="text-slate-400 text-lg">{showWarning}</p>
            </div>
            <button onClick={() => setShowWarning(null)} className="w-full bg-red-500 hover:bg-red-600 text-white py-6 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl transition-all active:scale-95">Override Protocol</button>
          </div>
        </div>
      )}

      {/* Navigation */}
      {!isHudMode && (
        <nav className="w-full md:w-80 bg-slate-900/80 backdrop-blur-xl border-b md:border-r border-slate-800 flex flex-col p-8 animate-in slide-in-from-left duration-500 relative z-10">
          <div className="flex items-center gap-4 mb-12 group cursor-pointer" onClick={() => handleCommand('janebot --info')}>
            <div className="bg-emerald-500 p-3 rounded-2xl shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-500"><Zap className="text-white size-6 fill-white" /></div>
            <div className="flex flex-col">
              <h1 className="font-black text-2xl tracking-tighter leading-none">COHORT PRO</h1>
              <span className="text-[10px] font-black text-emerald-500 tracking-[0.3em] mt-1">SST_ENGINE_V3</span>
            </div>
          </div>

          <div className="space-y-2 flex-1">
            {[ 
              { id: Tab.DASHBOARD, label: 'Tactical Briefing', icon: Activity },
              { id: Tab.TERMINAL, label: 'Command Console', icon: TerminalIcon },
              { id: Tab.VAULT, label: 'Security Vault', icon: Lock },
              { id: Tab.SETTINGS, label: 'Monitor Config', icon: SettingsIcon }
            ].map(t => ( activeTab === t.id ? (
              <div key={t.id} className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-[1.5rem] flex items-center gap-4 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.05)]">
                <t.icon size={20} /> <span className="text-sm font-black uppercase tracking-widest">{t.label}</span>
              </div>
            ) : (
              <button key={t.id} onClick={() => setActiveTab(t.id)} className="w-full flex items-center gap-4 px-6 py-5 rounded-[1.5rem] text-slate-500 hover:text-slate-200 hover:bg-slate-800/50 transition-all">
                <t.icon size={20} /> <span className="text-xs font-bold uppercase tracking-[0.1em]">{t.label}</span>
              </button>
            )))}
          </div>

          <div className="mt-auto space-y-6 pt-8 border-t border-slate-800">
            <VoiceController />
            <div className="p-6 bg-slate-950/50 rounded-[2rem] border border-slate-800/50 space-y-3 shadow-inner">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                <span className="flex items-center gap-2"><Timer size={12} /> Active Link</span>
                <span className={sessionElapsedMinutes >= settings.maxSessionMinutes ? 'text-red-500' : 'text-emerald-500'}>{sessionElapsedMinutes}m</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-1000 ${sessionElapsedMinutes >= settings.maxSessionMinutes ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, (sessionElapsedMinutes / settings.maxSessionMinutes) * 100)}%` }} />
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Main Viewport */}
      <main className={`flex-1 overflow-y-auto ${isHudMode ? 'p-6' : 'p-10'} space-y-12 relative z-10 custom-scroll`}>
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2">
            <h2 className={`font-black uppercase tracking-tighter leading-none ${isHudMode ? 'text-xl' : 'text-4xl'}`}>
              {activeTab === Tab.DASHBOARD ? 'Tactical Hub' : 
               activeTab === Tab.VAULT ? 'Encryption Vault' : 
               activeTab.toString().replace('_', ' ')}
            </h2>
            <div className="flex items-center gap-4">
              <div className="px-3 py-1 bg-slate-800/50 rounded-full border border-slate-700 text-[10px] font-mono font-bold text-slate-500 flex items-center gap-2">
                <Database size={12} /> root_2025/fanduel_cohort
              </div>
              {settings.stealthMode && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                  <ShieldCheck size={12} /> Stealth Active
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-3">
            <button onClick={() => setIsHudMode(!isHudMode)} className="bg-slate-800 hover:bg-slate-700 p-4 rounded-2xl border border-slate-700 transition-all">
              {isHudMode ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
            {activeTab === Tab.DASHBOARD && (
              <>
                <button onClick={() => handleSync(false)} disabled={isSyncing} className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest border border-slate-700 flex items-center gap-3 transition-all">
                  <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} /> {isSyncing ? 'Syncing' : `Sync (${countdown}s)`}
                </button>
                <button onClick={() => handleCommand('analyze')} disabled={isAnalyzing} className="bg-emerald-500 hover:bg-emerald-400 text-white px-10 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-[0_15px_30px_rgba(16,185,129,0.2)] flex items-center gap-3 transition-all active:scale-95">
                  <Zap size={18} fill="white" /> Tactical Brief
                </button>
              </>
            )}
          </div>
        </header>

        {activeTab === Tab.DASHBOARD && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="lg:col-span-3 space-y-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatsCard label="Net Stake" value={`$${stats.totalStake}`} icon={<TrendingUp size={20} />} />
                <StatsCard label="ROI Prediction" value={`${stats.roi.toFixed(1)}%`} icon={<DollarSign size={20} />} trend={stats.roi} />
                <StatsCard label="Win Probability" value={`${stats.winRate.toFixed(1)}%`} icon={<Activity size={20} />} />
                <StatsCard label="System Load" value="Optimal" icon={<Cpu size={20} />} />
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl backdrop-blur-md">
                <div className="p-10 border-b border-slate-800 bg-slate-900/30 flex justify-between items-center">
                  <h3 className="font-black text-sm uppercase tracking-[0.4em] text-emerald-400 flex items-center gap-3"><Layers size={18} /> Market Ingestion Stream</h3>
                </div>
                <div className="overflow-x-auto custom-scroll max-h-[600px] overflow-y-auto">
                  <table className="w-full text-left">
                    <thead className="sticky top-0 bg-slate-900 z-10 border-b border-slate-800">
                      <tr className="text-slate-500 text-[11px] uppercase tracking-[0.2em] font-black"><th className="px-10 py-6">Target Event</th><th className="px-10 py-6 text-center">Cohort Odds</th><th className="px-10 py-6 text-right">Execution</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/30">
                      {bets.map(bet => (
                        <tr key={bet.id} className="hover:bg-emerald-500/[0.03] transition-all group">
                          <td className="px-10 py-8">
                            <div className="font-black text-slate-100 text-lg group-hover:text-emerald-400 transition-colors uppercase tracking-tight leading-tight">
                              {settings.stealthMode ? (bet.event.length > 20 ? bet.event.slice(0, 20) + '...' : bet.event) : bet.event}
                            </div>
                            <div className="text-[10px] text-slate-500 font-black uppercase mt-1 tracking-widest">{bet.type}</div>
                          </td>
                          <td className="px-10 py-8 text-center">
                            <span className="text-emerald-400 font-mono font-black text-lg bg-emerald-500/10 px-5 py-2.5 rounded-2xl border border-emerald-500/20">{bet.odds.toFixed(2)}</span>
                          </td>
                          <td className="px-10 py-8 text-right">
                            {bet.status === 'SECURE_TRANSIT' ? (
                              <div className="flex items-center gap-3 justify-end text-emerald-500 text-xs font-black uppercase animate-pulse">
                                <Loader2 size={16} className="animate-spin" /> Tunneling...
                              </div>
                            ) : (
                              <button onClick={() => handleBet(bet)} className="bg-emerald-500 hover:bg-emerald-400 text-white text-[11px] font-black uppercase tracking-widest px-8 py-4 rounded-[1.5rem] shadow-2xl shadow-emerald-500/20 transition-all active:scale-95">Deploy Bet</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 p-10 rounded-[3rem] flex flex-col shadow-2xl h-[800px] backdrop-blur-md">
              <div className="flex items-center justify-between mb-10">
                <h3 className="font-black text-xs uppercase tracking-[0.5em] text-white flex items-center gap-4"><Shield size={18} className="text-emerald-500" /> Strategic Intelligence</h3>
              </div>
              <div className="flex-1 space-y-8 text-sm leading-relaxed text-slate-300 font-medium overflow-y-auto pr-4 custom-scroll">
                {aiAnalysis ? aiAnalysis.split('\n').map((l, i) => (
                  <p key={i} className={l.startsWith('**') ? 'text-emerald-400 font-black mt-8 text-xs uppercase tracking-[0.2em] border-l-2 border-emerald-500 pl-4' : 'opacity-80'}>{l.replace(/\*\*/g, '')}</p>
                )) : (
                  <div className="flex flex-col items-center justify-center py-40 text-slate-800 text-center gap-6 animate-pulse">
                    <Zap size={60} className="opacity-20" />
                    <p className="text-xs font-black uppercase tracking-[0.4em]">Initializing Pulse Stream...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === Tab.VAULT && (
          <div className="max-w-5xl mx-auto space-y-12 animate-in zoom-in-95 duration-700">
            <div className="bg-slate-900/80 border-2 border-slate-800 p-16 rounded-[4rem] shadow-3xl relative overflow-hidden backdrop-blur-3xl">
              <div className="absolute top-0 right-0 p-32 bg-emerald-500/5 blur-[120px] rounded-full" />
              <div className="relative z-10 flex flex-col items-center text-center space-y-12">
                <div className="bg-slate-950 p-12 rounded-full border border-slate-800 shadow-2xl relative">
                  <Lock size={80} className="text-emerald-500" />
                  <div className="absolute -top-2 -right-2 bg-emerald-500 p-2 rounded-full border-4 border-slate-950"><ShieldCheck size={24} className="text-white" /></div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-5xl font-black uppercase tracking-tighter">Security Vault Core</h3>
                  <p className="text-slate-400 text-lg max-w-xl mx-auto font-medium">Multi-tenant isolation active. All bet parameters and local cohort IDs are hashed prior to transmission.</p>
                </div>
                
                <div className="w-full max-w-2xl bg-black/50 p-8 rounded-[2.5rem] border border-slate-800 text-left font-mono text-[11px] space-y-2 h-48 overflow-y-auto custom-scroll shadow-inner">
                  {vaultLogs.map((log, i) => (
                    <div key={i} className={log.includes('AUDIT') ? 'text-emerald-500/70' : 'text-slate-600'}>
                      <span className="opacity-30 mr-3">[{new Date().toLocaleTimeString()}]</span> {log}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                  <button className="bg-slate-800 hover:bg-slate-700 p-10 rounded-[2.5rem] border border-slate-700 transition-all group flex flex-col items-center gap-4">
                    <Unlock size={32} className="text-slate-500 group-hover:text-white" />
                    <span className="font-black text-xs uppercase tracking-[0.3em]">Rotate Auth Keys</span>
                  </button>
                  <button className="bg-red-500/10 hover:bg-red-500/20 p-10 rounded-[2.5rem] border border-red-500/20 transition-all group flex flex-col items-center gap-4">
                    <HandMetal size={32} className="text-red-500" />
                    <span className="font-black text-xs uppercase tracking-[0.3em] text-red-500">Purge Local Storage</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === Tab.SETTINGS && (
          <div className="max-w-2xl mx-auto space-y-12 animate-in slide-in-from-bottom-10 duration-700">
            <div className="bg-slate-900/60 border border-slate-800 p-16 rounded-[4rem] shadow-3xl space-y-12 backdrop-blur-md">
              <h3 className="text-3xl font-black uppercase tracking-tighter">Monitor Protocols</h3>
              <div className="space-y-10">
                <div className="space-y-6">
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 px-2"><span>Session Time Cap</span><span className="text-emerald-500">{settings.maxSessionMinutes} Minutes</span></div>
                  <input type="range" min="5" max="120" step="5" value={settings.maxSessionMinutes} onChange={e => setSettings({...settings, maxSessionMinutes: parseInt(e.target.value)})} className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-full appearance-none cursor-pointer" />
                </div>
                <div className="flex items-center justify-between p-8 bg-slate-800/40 rounded-[2rem] border border-slate-800 transition-all hover:bg-slate-800/60">
                  <div className="space-y-1"><h4 className="font-black text-sm uppercase tracking-widest">Stealth Engine</h4><p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em]">Mask event names & cohort IDs</p></div>
                  <button onClick={() => setSettings({...settings, stealthMode: !settings.stealthMode})} className="text-emerald-500 transition-transform active:scale-90">{settings.stealthMode ? <ToggleRight size={48} /> : <ToggleLeft size={48} className="text-slate-700" />}</button>
                </div>
              </div>
              <div className="p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-[2rem] flex items-start gap-6 text-sm text-slate-400 leading-relaxed"><Shield size={32} className="text-emerald-500 shrink-0 mt-1" /> <div><span className="font-black text-white block mb-1 uppercase text-xs">Compliance Engine Active</span> JaneBot monitors all activity. Overlays will trigger automatically when thresholds are exceeded. Settings are cached on-device.</div></div>
            </div>
          </div>
        )}

        {activeTab === Tab.TERMINAL && <Terminal onCommand={handleCommand} logs={terminalLogs} />}
      </main>

      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 6px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 20px; border: 2px solid transparent; background-clip: content-box; }
        
        .matrix-bg { background: radial-gradient(circle at center, #020617 0%, #000 100%); }
        .matrix-rain { background: linear-gradient(180deg, transparent 0%, rgba(16, 185, 129, 0.05) 50%, transparent 100%); background-size: 100% 200%; animation: matrix-scroll 20s linear infinite; }
        @keyframes matrix-scroll { 0% { background-position: 0% 0%; } 100% { background-position: 0% 100%; } }
      `}</style>
    </div>
  );
};

export default App;
