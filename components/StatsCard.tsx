
import React from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  trend?: number;
  icon: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, trend, icon }) => (
  <div className="bg-white/[0.03] backdrop-blur-md border border-white/5 p-5 rounded-3xl hover:border-[#d4af37]/20 hover:bg-white/[0.06] transition-all border-b-2 border-b-white/5 shadow-xl group">
    <div className="flex justify-between items-start mb-3">
      <div className="size-8 bg-blue-600/5 rounded-lg flex items-center justify-center text-blue-400 border border-blue-500/10 group-hover:text-[#d4af37] group-hover:border-[#d4af37]/20 transition-colors">
        {icon}
      </div>
      {trend !== undefined && (
        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${trend >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
          {trend >= 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1 group-hover:text-slate-400 transition-colors">{label}</div>
    <div className="text-2xl font-black text-white tracking-tighter group-hover:text-[#d4af37] transition-colors">{value}</div>
  </div>
);

export default StatsCard;
