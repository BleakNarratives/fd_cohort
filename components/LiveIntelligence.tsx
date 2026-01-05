
import React from 'react';
import { ShieldAlert, TrendingUp, Globe, Activity, Skull } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';

export const LiveIntelligence: React.FC = () => {
  const alerts = [
    { type: 'MARKET_RELATIONS', text: 'Fairbanks protocol engaged. Scouting relations-driven betting surges.', status: 'INFO' },
    { type: 'WEATHER_CARNAGE', text: 'High-impact wind at MetLife. Scouting under markets for passing props.', status: 'ALPHA' },
    { type: 'SQUAD_DECRYPTION', text: 'Late-scratch suspected. Line movement detected on alternative spreads.', status: 'CRITICAL' }
  ];

  return (
    <div className="bg-white border border-blue-900/10 rounded-[2.5rem] p-10 space-y-8 relative overflow-hidden shadow-sm">
      <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
        <Globe size={200} />
      </div>

      <div className="flex justify-between items-center border-b border-slate-100 pb-8">
        <div className="flex items-center gap-4">
          <Activity size={24} className="text-[#004fb6]" />
          <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-900">Neural Intelligence Feed</h3>
        </div>
        <div className="px-5 py-2 bg-blue-50 border border-blue-100 rounded-full text-[10px] font-black text-[#004fb6] uppercase tracking-widest flex items-center gap-2">
           Stable Pulse • v9.0
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-5">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tactical Directives</h4>
          {alerts.map((alert, i) => (
            <div key={i} className="bg-slate-50 border border-slate-100 p-6 rounded-3xl flex items-start gap-4 hover:bg-white hover:border-[#004fb6]/30 transition-all group">
              <div className={`p-3 rounded-xl ${alert.status === 'CRITICAL' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-[#004fb6]'}`}>
                <ShieldAlert size={20} />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase mb-1 opacity-60 text-slate-500">{alert.type}</div>
                <div className="text-sm font-semibold text-slate-800 leading-snug">{alert.text}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50/50 rounded-[2.5rem] p-10 border border-blue-100 flex flex-col justify-center items-center text-center space-y-6 shadow-inner">
           <div className="size-24 bg-white rounded-full flex items-center justify-center border-2 border-blue-100 shadow-xl">
              <TrendingUp size={40} className="text-[#004fb6]" />
           </div>
           <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Calculated Alpha</div>
              <div className="text-5xl font-black text-[#004fb6] tracking-tighter"><AnimatedCounter value={92} prefix="+" />%</div>
           </div>
           <p className="text-xs text-slate-500 font-bold max-w-[180px] uppercase leading-relaxed tracking-wider">Probability favors strategic capital expansion.</p>
        </div>
      </div>
    </div>
  );
};
