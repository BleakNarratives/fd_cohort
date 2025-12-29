
import React, { useState } from 'react';

export const Tooltip: React.FC<{ text: string, children: React.ReactNode }> = ({ text, children }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative inline-block" onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
      {children}
      {visible && (
        <div className="absolute z-[100] bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-800 border border-slate-700 text-[10px] text-slate-200 font-bold uppercase tracking-wider rounded-lg shadow-2xl whitespace-nowrap animate-in fade-in zoom-in duration-200 pointer-events-none">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
        </div>
      )}
    </div>
  );
};
