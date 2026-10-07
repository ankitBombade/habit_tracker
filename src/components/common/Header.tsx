import React, { useState, useEffect } from 'react';
import { Clock, Play, FileCheck, Bell, Database } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { getGreeting } from '../../utils/time';

export const Header: React.FC = () => {
  const { setActiveTab, setDailyReviewModalOpen, timerState } = useAppStore();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formattedDate = time.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <header className="h-16 px-6 border-b border-zinc-800/80 bg-[#09090B]/80 backdrop-blur-md flex items-center justify-between z-10">
      {/* Greeting & Date */}
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          {getGreeting()}
        </h2>
        <p className="text-xs text-zinc-400 font-medium">{formattedDate}</p>
      </div>

      {/* Live Clock & Action Buttons */}
      <div className="flex items-center space-x-4">
        {/* Live Clock Card */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-200 font-mono text-xs font-semibold shadow-inner">
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          <span>{formattedTime}</span>
        </div>

        {/* Quick Focus Timer Button */}
        <button
          onClick={() => setActiveTab('timer')}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 shadow-glow ${
            timerState.isRunning
              ? 'bg-purple-600 hover:bg-purple-500 text-white animate-pulse'
              : 'bg-emerald-500 hover:bg-emerald-400 text-black font-bold'
          }`}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{timerState.isRunning ? 'Focusing...' : 'Deep Work'}</span>
        </button>

        {/* End of Day Review Modal Trigger */}
        <button
          onClick={() => setDailyReviewModalOpen(true)}
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 text-xs font-semibold transition-all duration-200"
        >
          <FileCheck className="w-3.5 h-3.5 text-purple-400" />
          <span>Daily Review</span>
        </button>

        {/* SQLite Local Storage Status Badge */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
          <Database className="w-3 h-3" />
          <span>SQLite Local</span>
        </div>
      </div>
    </header>
  );
};
