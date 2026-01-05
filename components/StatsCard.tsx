
import React from 'react';
import { Spade, Heart, Diamond, Club } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string | number;
  trend?: number;
  icon: React.ReactNode;
  suit?: 'spades' | 'hearts' | 'diamonds' | 'clubs';
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, trend, icon, suit = 'spades' }) => {
  const SuitIcon = {
    spades: Spade,
    hearts: Heart,
    diamonds: Diamond,
    clubs: Club
  }[suit];

  return (
    <div className="neon-card p-8 rounded-2xl relative overflow-hidden group perspective-1000">
      {/* Background Suit Stencil */}
      <div className="absolute -bottom-4 -right-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
        <SuitIcon size={120} strokeWidth={1} />
      </div>

      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className="size-14 bg-[#00f51d]/5 rounded-xl flex items-center justify-center text-[#00f51d] border border-[#00f51d]/20 group-hover:bg-[#00f51d]/10 transition-colors">
          {icon}
        </div>
        {trend !== undefined && (
          <span className={`text-[10px] font-tech font-black px-3 py-1.5 rounded-lg border ${
            trend >= 0 ? 'bg-[#00f51d]/10 text-[#00f51d] border-[#00f51d]/30' : 'bg-red-500/10 text-red-500 border-red-500/30'
          }`}>
            {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}%
          </span>
        )}
      </div>

      <div className="relative z-10">
        <div className="text-[#00f51d]/50 text-[9px] font-tech font-bold uppercase tracking-[0.5em] mb-2">{label}</div>
        <div className="text-5xl font-dk font-black text-white tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">{value}</div>
      </div>
      
      <div className="mt-8 pt-4 border-t border-[#00f51d]/10 flex items-center justify-between">
         <div className="h-1 w-1/3 bg-[#00f51d] rounded-full shadow-[0_0_100px_#00f51d]" />
         <SuitIcon size={14} className="text-[#00f51d]/20" />
      </div>
    </div>
  );
};

export default StatsCard;
