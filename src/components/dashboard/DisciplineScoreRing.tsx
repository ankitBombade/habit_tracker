import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  score: number;
  studyAccuracy: number;
  habitCompletion: number;
  timetableAdherence: number;
  sleepConsistency: number;
}

export const DisciplineScoreRing: React.FC<Props> = ({
  score,
  studyAccuracy,
  habitCompletion,
  timetableAdherence,
  sleepConsistency,
}) => {
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="glass-panel p-6 rounded-3xl relative overflow-hidden flex flex-col items-center justify-between border border-zinc-800/80 shadow-2xl">
      {/* Background radial ambient glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">Daily Discipline Score</h3>
          <p className="text-[11px] text-zinc-400 font-medium">Weighted performance index</p>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          Target 90%+
        </span>
      </div>

      {/* SVG Ring Container */}
      <div className="relative w-44 h-44 flex items-center justify-center my-2">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
          {/* Track Circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            className="text-zinc-800/80"
            fill="transparent"
          />
          {/* Animated Progress Circle */}
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            stroke="url(#scoreGradient)"
            strokeWidth="12"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            strokeLinecap="round"
            fill="transparent"
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Score Label */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-4xl font-extrabold text-white tracking-tighter"
          >
            {score}%
          </motion.span>
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mt-0.5">
            DISCIPLINE
          </span>
        </div>
      </div>

      {/* Formula Breakdown Pills */}
      <div className="w-full grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-zinc-800/80 text-[11px]">
        <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-zinc-400">Study (40%)</span>
          <span className="font-bold text-emerald-400">{studyAccuracy}%</span>
        </div>
        <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-zinc-400">Habits (25%)</span>
          <span className="font-bold text-purple-400">{habitCompletion}%</span>
        </div>
        <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-zinc-400">Timetable (20%)</span>
          <span className="font-bold text-blue-400">{timetableAdherence}%</span>
        </div>
        <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-zinc-400">Sleep (15%)</span>
          <span className="font-bold text-indigo-400">{sleepConsistency}%</span>
        </div>
      </div>
    </div>
  );
};
