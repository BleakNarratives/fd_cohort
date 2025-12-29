
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  Activity, BarChart3, Terminal as TerminalIcon, Shield, Layers, Zap, TrendingUp, AlertCircle, FileText, Settings as SettingsIcon, Download, Globe, RefreshCw, Clock, ToggleLeft, ToggleRight, Github, Code, Copy, CheckCircle, Maximize2, Minimize2, DollarSign, Timer, LogOut, Bell, HandMetal
} from 'lucide-react';
import { BetData, Tab, AnalyticsSummary, SessionSettings } from './types';
import { geminiService } from './services/geminiService';
import Terminal from './components/Terminal';
import StatsCard from './components/StatsCard';

const REFRESH_INTERVAL = 60;

const INITIAL_DATA: BetData[] = [
  { id: '1', timestamp: new Date().toISOString(), event: 'Lakers vs Nuggets', odds: 1.91, stake: 500, potentialReturn: 955, status: 'WON', type: 'Spread' },
  { id: '2', timestamp: new Date().toISOString(), event: 'Man City vs Arsenal', odds: 2.10, stake: 250, potentialReturn: 525, status: 'LOST', type: 'Moneyline' },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);
  const [bets, setBets] = useState<BetData[]>(INITIAL_DATA);
  const [terminalLogs, setTerminalLogs] = useState<string[]>(["Core initialized.", "Path: /storage/emulated/0/root_2025/fanduel_cohort", "Ready for commands..."]);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString());
  const [isHudMode, setIsHudMode] = useState(false);
  
  // Responsible Gaming & Session State
  const [sessionStartTime] = useState<number>(Date.now());
  const [sessionElapsedMinutes, setSessionElapsedMinutes] = useState(0);
  const [showWarning, setShowWarning] = useState<string | null>(null);
  const [settings, setSettings] = useState<SessionSettings>(() => {
    const saved = localStorage.getItem('janebot_settings');
    return saved ? JSON.parse(saved) : {
      maxSessionMinutes: 30,
      stopLossLimit: 1000,
      alertsEnabled: true
    };
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sync settings to localStorage
  useEffect(() => {
    localStorage.setItem('janebot_settings', JSON.stringify(settings));
  }, [settings]);

  // Handle URL parameters for PWA shortcuts
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    const action = params.get('action');
    
    if (tab === 'terminal') setActiveTab(Tab.TERMINAL);
    if (tab === 'dashboard') {
      setActiveTab(Tab.DASHBOARD);
      if (action === 'analyze') handleRunCommand('analyze');
    }
  }, []);

  const stats: AnalyticsSummary = React.useMemo(() => {
    const wonBets = bets.filter(b => b.status === 'WON');
    const totalStake = bets.reduce((acc, b) => acc + b.stake, 0);
    const totalReturn = wonBets.reduce((acc, b) => acc + b.potentialReturn, 0);
    const profit = totalReturn - totalStake;
    return {
      totalStake,
      totalReturn,
      winRate: (wonBets.length / (bets.filter(b => b.status !== 'PENDING').length || 1)) * 100,
      profit,
      roi: (profit / (totalStake || 1)) * 100
    };
  }, [bets]);

  // Session Monitor Logic
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - sessionStartTime) / 60000);
      setSessionElapsedMinutes(elapsed);

      if (settings.alertsEnabled) {
        if (elapsed >= settings.maxSessionMinutes) {
          setShowWarning(`SESSION LIMIT: You have reached your ${settings.maxSessionMinutes} minute limit. It is time to walk away.`);
        }
        if (stats.profit <= -settings.stopLossLimit) {
          setShowWarning(`LOSS LIMIT: You have hit your $${settings.stopLossLimit} stop-loss limit. Shutdown procedure recommended.`);
        }
      }
    }, 10000); 
    return () => clearInterval(interval);
  }, [sessionStartTime, settings, stats.profit]);

  const handleSyncLiveOdds = useCallback(async (isAuto = false) => {
    if (isSyncing) return;
    setIsSyncing(true);
    setTerminalLogs(prev => [...prev, `${isAuto ? '[Auto]' : '[Manual]'} Syncing live markets...`]);
    
    try {
      const result = await geminiService.fetchRealTimeMarkets();
      const newBets: BetData[] = result.data.map((item: any, index: number) => ({
        id: `live-${Date.now()}-${index}`,
        timestamp: item.timestamp || new Date().toISOString(),
        event: item.event,
        odds: item.odds,
        stake: 0,
        potentialReturn: 0,
        status: 'PENDING',
        type: item.type
      }));
      
      setBets(prev => [...newBets, ...prev.filter(b => b.status !== 'PENDING').slice(0, 10)]);
      setLastUpdated(new Date().toLocaleTimeString());
      setCountdown(REFRESH_INTERVAL);
      setTerminalLogs(prev => [...prev, `Sync complete. ${newBets.length} markets live.`]);

      if (isAuto) {
        const analysis = await geminiService.analyzeStrategy(newBets, "Background Pulse Check");
        setAiAnalysis(analysis);
      }
    } catch (err) {
      setTerminalLogs(prev => [...prev, `Sync Error: ${err}`]);
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing]);

  useEffect(() => {
    if (autoSync) {
      timerRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            handleSyncLiveOdds(true);
            return REFRESH_INTERVAL;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [autoSync, handleSyncLiveOdds]);

  const handleRunCommand = useCallback(async (cmd: string) => {
    setTerminalLogs(prev => [...prev, `> ${cmd}`]);
    if (cmd.startsWith('analyze')) {
      setIsAnalyzing(true);
      try {
        const result = await geminiService.analyzeStrategy(bets, "Manual User Command");
        setAiAnalysis(result);
        setTerminalLogs(prev => [...prev, "Analysis updated."]);
      } catch (err) {
        setTerminalLogs(prev => [...prev, `Analysis Error: ${err}`]);
      } finally {
        setIsAnalyzing(false);
      }
    } else if (cmd === 'clear') {
      setTerminalLogs(["Terminal reset."]);
    } else {
      setTerminalLogs(prev => [...prev, `Command '${cmd}' recognized.`]);
    }
  }, [bets]);

  const handlePlaceBet = (bet: BetData) => {
    // Simulated FanDuel Endpoint Communication
    const stake = 100; // default tactical unit
    setTerminalLogs(prev => [...prev, `FAN-DIRECT: Sending $${stake} request to FanDuel endpoint for ${bet.event}...`]);
    
    setBets(prev => prev.map(b => b.id === bet.id ? { 
      ...b, 
      status: 'PENDING', 
      stake, 
      potentialReturn: stake * b.odds 
    } : b));

    // Simulation of network success and eventual result
    setTimeout(() => {
      setTerminalLogs(prev => [...prev, `FAN-DIRECT: Bet confirmed. Slip ID: FD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`]);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#020617] text-slate-100 selection:bg-emerald-500/30">
      {/* Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-6 animate-in zoom-in duration-300">
          <div className="bg-slate-900 border-2 border-red-500/50 p-8 rounded-[2.5rem] max-w-lg w-full shadow-[0_0_50px_rgba(239,68,68,0.2)] text-center space-y-8">
            <div className="bg-red-500/10 p-6 rounded-full w-fit mx-auto">
              <AlertCircle size={64} className="text-red-500 animate-bounce" />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-black uppercase tracking-tighter text-red-500">Call It & Walk Away</h3>
              <p className="text-slate-400 text-lg font-medium">{showWarning}</p>
            </div>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setShowWarning(null)}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-red-500/20"
              >
                Acknowledge Warning
              </button>
              <button 
                onClick={() => window.location.href = 'https://www.fanduel.com/responsible-gaming'}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-4 rounded-2xl font-bold text-sm uppercase transition-all"
              >
                FanDuel Help Resources
              </button>
            </div>
            <p className="text-[10px] text-slate-600 uppercase font-bold tracking-[0.2em]">JaneBot Responsible Intelligence Protocol</p>
          </div>
        </div>
      )}

      {/* Sidebar */}
      {!isHudMode && (
        <nav className="w-full md:w-64 bg-slate-900 border-b md:border-r border-slate-800 flex flex-col p-4 animate-in slide-in-from-left duration-300">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="bg-emerald-500 p-2 rounded-lg shadow-lg shadow-emerald-500/20">
              <Zap className="text-white size-5 fill-white" />
            </div>
            <h1 className="font-bold text-xl tracking-tight">COHORT PRO</h1>
          </div>

          <div className="space-y-1 flex-1">
            <button onClick={() => setActiveTab(Tab.DASHBOARD)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === Tab.DASHBOARD ? 'bg-slate-800 text-white shadow-inner' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}>
              <Activity size={18} /> Dashboard
            </button>
            <button onClick={() => setActiveTab(Tab.TERMINAL)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === Tab.TERMINAL ? 'bg-slate-800 text-white shadow-inner' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}>
              <TerminalIcon size={18} /> Terminal
            </button>
            <button onClick={() => setActiveTab(Tab.DEPLOYMENT)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === Tab.DEPLOYMENT ? 'bg-slate-800 text-white shadow-inner' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}>
              <Github size={18} /> Repository
            </button>
            <button onClick={() => setActiveTab(Tab.SETTINGS)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === Tab.SETTINGS ? 'bg-slate-800 text-white shadow-inner' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}>
              <SettingsIcon size={18} /> Monitor Menu
            </button>
          </div>

          <div className="mt-auto pt-4 border-t border-slate-800 space-y-4">
             <div className="px-4 py-3 bg-slate-950/50 rounded-xl border border-slate-800/50 space-y-2">
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-black uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Timer size={10} /> Session Time</span>
                  <span className={sessionElapsedMinutes >= settings.maxSessionMinutes ? 'text-red-500' : 'text-emerald-500'}>{sessionElapsedMinutes}m</span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                   <div 
                    className={`h-full transition-all duration-1000 ${sessionElapsedMinutes >= settings.maxSessionMinutes ? 'bg-red-500' : 'bg-emerald-500'}`} 
                    style={{ width: `${Math.min(100, (sessionElapsedMinutes / settings.maxSessionMinutes) * 100)}%` }}
                   />
                </div>
             </div>
            <div className="flex items-center gap-3 px-4 py-2 text-[10px] font-mono text-slate-500">
              <Shield size={12} className="text-emerald-500" /> SYSTEM ACTIVE
            </div>
          </div>
        </nav>
      )}

      {/* Main Area */}
      <main className={`flex-1 overflow-y-auto ${isHudMode ? 'p-2' : 'p-4 md:p-8'} space-y-8 transition-all duration-300`}>
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className={`font-bold transition-all ${isHudMode ? 'text-lg' : 'text-2xl'}`}>
              {activeTab === Tab.SETTINGS ? 'Monitor Configuration' : 
               activeTab === Tab.DEPLOYMENT ? 'Secure Sync Hub' : 'Tactical Briefing'}
            </h2>
            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
              <Clock size={10} /> LAST UPDATE: {lastUpdated}
            </div>
          </div>
          
          <div className="flex gap-2">
            {!isHudMode && activeTab === Tab.DASHBOARD && (
              <button 
                onClick={() => setIsHudMode(true)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-400 p-2 rounded-lg border border-slate-700"
              >
                <Maximize2 size={18} />
              </button>
            )}
            {activeTab === Tab.DASHBOARD && (
              <>
                <button 
                  onClick={() => handleSyncLiveOdds(false)}
                  disabled={isSyncing}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold border border-slate-800"
                >
                  <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
                  {isSyncing ? 'Syncing' : `Sync (${countdown}s)`}
                </button>
                <button 
                  onClick={() => handleRunCommand('analyze')}
                  disabled={isAnalyzing}
                  className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold shadow-lg shadow-emerald-500/20"
                >
                  <Zap size={16} /> Briefing
                </button>
              </>
            )}
          </div>
        </header>

        {activeTab === Tab.DASHBOARD && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatsCard label="Net Stake" value={`$${stats.totalStake}`} icon={<TrendingUp size={16} />} />
                <StatsCard label="Net Profit" value={`$${stats.profit.toFixed(2)}`} icon={<DollarSign size={16} />} trend={stats.roi} />
                <StatsCard label="Win Rate" value={`${stats.winRate.toFixed(1)}%`} icon={<Activity size={16} />} />
                <StatsCard label="Session Status" value={sessionElapsedMinutes > settings.maxSessionMinutes ? "REST" : "PLAYING"} icon={<HandMetal size={16} />} />
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 flex justify-between items-center">
                  <h3 className="font-bold flex items-center gap-2 text-xs uppercase tracking-widest text-emerald-400">
                    <Layers size={14} /> FAN-DIRECT COHORT FEED
                  </h3>
                </div>
                <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scroll">
                  <table className="w-full text-left">
                    <thead className="sticky top-0 bg-slate-900 z-10 border-b border-slate-800">
                      <tr className="text-slate-500 text-[10px] uppercase tracking-widest font-black">
                        <th className="px-6 py-4">Event</th>
                        <th className="px-6 py-4 text-center">Odds</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-right">Endpoint Control</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/30">
                      {bets.map(bet => (
                        <tr key={bet.id} className="hover:bg-slate-800/20 transition-all group">
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-100 text-sm group-hover:text-emerald-400 transition-colors">{bet.event}</div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase">{bet.type}</div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-emerald-400 font-mono font-bold text-xs bg-emerald-500/5 px-2 py-1 rounded border border-emerald-500/10">
                              {bet.odds.toFixed(2)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                             <span className={`text-[9px] font-black px-2 py-1 rounded-md uppercase ${
                              bet.status === 'WON' ? 'bg-emerald-500/10 text-emerald-400' :
                              bet.status === 'LOST' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'
                            }`}>
                              {bet.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => handlePlaceBet(bet)}
                              disabled={bet.status !== 'PENDING' && bet.status !== 'WON' && bet.status !== 'LOST'}
                              className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/20"
                            >
                              One-Click Bet
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col h-full shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-black text-white flex items-center gap-2 uppercase tracking-[0.2em] text-xs">
                    <Shield size={14} className="text-emerald-500" /> GEMINI PULSE
                  </h3>
                  {isAnalyzing && <RefreshCw size={14} className="animate-spin text-emerald-500" />}
                </div>
                <div className="flex-1 space-y-4 text-sm leading-relaxed text-slate-300 font-light overflow-y-auto max-h-[600px] pr-2 custom-scroll">
                  {aiAnalysis ? (
                    aiAnalysis.split('\n').map((line, i) => (
                      <p key={i} className={line.startsWith('**') ? 'text-emerald-400 font-bold mt-4' : ''}>
                        {line.replace(/\*\*/g, '')}
                      </p>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-600 text-center space-y-4">
                      <Zap size={32} className="opacity-10 animate-pulse" />
                      <p className="text-xs font-mono uppercase tracking-[0.3em]">Awaiting Analysis Stream...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === Tab.SETTINGS && (
          <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-8">
            <div className="bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] shadow-3xl space-y-8">
              <div className="space-y-2">
                <h3 className="text-2xl font-black uppercase tracking-tighter">Tactical Monitor Menu</h3>
                <p className="text-slate-400 text-sm">Configure your responsible gaming thresholds and system warnings.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest text-slate-500 px-1">
                    <label className="flex items-center gap-2"><Timer size={14} /> Session Time Cap</label>
                    <span className="text-emerald-500">{settings.maxSessionMinutes} Minutes</span>
                  </div>
                  <input 
                    type="range" min="1" max="120" step="5"
                    value={settings.maxSessionMinutes}
                    onChange={(e) => setSettings({...settings, maxSessionMinutes: parseInt(e.target.value)})}
                    className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-full appearance-none cursor-pointer"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest text-slate-500 px-1">
                    <label className="flex items-center gap-2"><DollarSign size={14} /> Stop-Loss Limit</label>
                    <span className="text-red-500">${settings.stopLossLimit}</span>
                  </div>
                  <input 
                    type="range" min="100" max="5000" step="100"
                    value={settings.stopLossLimit}
                    onChange={(e) => setSettings({...settings, stopLossLimit: parseInt(e.target.value)})}
                    className="w-full accent-red-500 h-2 bg-slate-800 rounded-full appearance-none cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm flex items-center gap-2"><Bell size={14} className="text-emerald-500" /> Active Warnings</h4>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Enable JaneBot monitoring</p>
                  </div>
                  <button 
                    onClick={() => setSettings({...settings, alertsEnabled: !settings.alertsEnabled})}
                    className="text-emerald-500 transition-transform active:scale-95"
                  >
                    {settings.alertsEnabled ? <ToggleRight size={40} /> : <ToggleLeft size={40} className="text-slate-600" />}
                  </button>
                </div>
              </div>

              <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center gap-4">
                <Shield size={24} className="text-emerald-500" />
                <p className="text-xs text-slate-400 font-medium">
                  Settings are stored locally on this device. JaneBot will trigger an override overlay when thresholds are exceeded.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === Tab.TERMINAL && (
          <Terminal onCommand={handleRunCommand} logs={terminalLogs} />
        )}
      </main>

      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .shadow-glow { box-shadow: 0 0 15px rgba(16, 185, 129, 0.4); }
      `}</style>
    </div>
  );
};

export default App;
