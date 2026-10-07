import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  accentColor?: string;
  trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  accentColor = 'emerald',
  trend,
}) => {
  return (
    <div className="glass-panel p-5 rounded-3xl border border-zinc-800/80 hover:border-zinc-700/80 transition-all duration-200 shadow-lg flex flex-col justify-between group">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-zinc-400 group-hover:text-zinc-300 transition-colors">
          {title}
        </span>
        <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 group-hover:border-zinc-700 transition-colors">
          {icon}
        </div>
      </div>

      <div>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-extrabold text-white tracking-tight">{value}</span>
          {trend && (
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              {trend}
            </span>
          )}
        </div>
        {subtitle && <p className="text-[11px] text-zinc-500 font-medium mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};
