import React from 'react';
import { Flame, Trophy, BookOpen, Dumbbell, Sun } from 'lucide-react';

interface StreakProps {
  currentStreak: number;
  longestStreak: number;
  studyStreak: number;
  exerciseStreak: number;
  wakeupStreak: number;
}

export const StreakCard: React.FC<StreakProps> = ({
  currentStreak,
  longestStreak,
  studyStreak,
  exerciseStreak,
  wakeupStreak,
}) => {
  return (
    <div className="glass-panel p-6 rounded-3xl border border-zinc-800/80 shadow-2xl relative overflow-hidden space-y-5">
      {/* Flame Ambient Background */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-400 flex items-center justify-center shadow-glow-orange flame-animated">
            <Flame className="w-5 h-5 text-black fill-black" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Streak Engine</h3>
            <p className="text-[11px] text-zinc-400 font-medium">Consistency momentum</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-semibold text-zinc-400 block">Longest Record</span>
          <span className="text-sm font-bold text-amber-400 flex items-center gap-1 justify-end">
            <Trophy className="w-3.5 h-3.5" />
            {longestStreak} Days
          </span>
        </div>
      </div>

      {/* Main Flame Hero Indicator */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-950/40 via-zinc-900 to-zinc-900 border border-orange-500/30 flex items-center justify-between">
        <div>
          <span className="text-xs font-medium text-orange-300">Active Discipline Streak</span>
          <p className="text-3xl font-black text-white mt-0.5 flex items-baseline gap-1.5">
            {currentStreak}
            <span className="text-sm font-bold text-orange-400 uppercase tracking-wider">Days</span>
          </p>
        </div>
        <div className="w-12 h-12 flex items-center justify-center flame-animated">
          <Flame className="w-10 h-10 fill-orange-500 text-orange-500" />
        </div>
      </div>

      {/* Categorized Sub-Streaks */}
      <div className="grid grid-cols-3 gap-2.5 pt-2">
        <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-zinc-400">
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            <span>Study</span>
          </div>
          <p className="text-base font-bold text-white mt-1">{studyStreak}d</p>
        </div>

        <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-zinc-400">
            <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
            <span>Exercise</span>
          </div>
          <p className="text-base font-bold text-white mt-1">{exerciseStreak}d</p>
        </div>

        <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-zinc-400">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>Wake-up</span>
          </div>
          <p className="text-base font-bold text-white mt-1">{wakeupStreak}d</p>
        </div>
      </div>
    </div>
  );
};
