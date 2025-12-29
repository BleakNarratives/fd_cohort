
import React from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  trend?: number;
  icon: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, trend, icon }) => (
  <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl hover:bg-slate-800/50 transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-slate-800 rounded-lg text-emerald-400">
        {icon}
      </div>
      {trend !== undefined && (
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trend >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
          {trend >= 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <div className="text-slate-400 text-sm font-medium mb-1">{label}</div>
    <div className="text-2xl font-bold text-white">{value}</div>
  </div>
);

export default StatsCard;
