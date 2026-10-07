import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Play, Pause, RotateCcw, CheckCircle2, Sparkles, BookOpen, Star } from 'lucide-react';
import { calculateStudyAccuracy, formatHoursAndMinutes } from '../../utils/calculations';
import { getTodayDateString } from '../../utils/time';
import confetti from 'canvas-confetti';

export const StudyTimerView: React.FC = () => {
  const { timerState, startTimer, pauseTimer, resumeTimer, resetTimer, tickTimer, addStudySession } = useAppStore();

  const [showFinishModal, setShowFinishModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [sessionNotes, setSessionNotes] = useState('');

  // Ticking effect when timer is active
  useEffect(() => {
    let interval: any = null;
    if (timerState.isRunning && !timerState.isPaused) {
      interval = setInterval(() => {
        tickTimer();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerState.isRunning, timerState.isPaused, tickTimer]);

  const totalPlannedSeconds = (timerState.plannedMinutes || 180) * 60;
  const elapsed = timerState.elapsedSeconds;
  const progressPct = Math.min(100, (elapsed / totalPlannedSeconds) * 100);

  const hours = Math.floor(elapsed / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const seconds = elapsed % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  const handleFinishSession = async () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });

    const actualMins = Math.max(1, Math.round(elapsed / 60));
    const accuracyPct = calculateStudyAccuracy(timerState.plannedMinutes, actualMins);

    await addStudySession({
      id: `ss_${Date.now()}`,
      activityId: timerState.activityId,
      activityTitle: timerState.activityTitle || 'Study Session',
      date: getTodayDateString(),
      plannedMinutes: timerState.plannedMinutes,
      actualMinutes: actualMins,
      accuracyPct,
      notes: sessionNotes,
      rating,
      createdAt: new Date().toISOString(),
    });

    resetTimer();
    setShowFinishModal(false);
    setSessionNotes('');
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-6rem)]">
      {/* Title Header */}
      <div className="text-center space-y-1">
        <span className="px-3 py-1 rounded-full bg-purple-500/15 text-purple-400 font-extrabold text-[11px] uppercase tracking-widest border border-purple-500/30 inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          DEEP WORK FOCUS MODE
        </span>
        <h1 className="text-2xl font-extrabold text-white">{timerState.activityTitle}</h1>
        <p className="text-xs text-zinc-400 font-medium">
          Planned Duration: <strong className="text-zinc-200">{formatHoursAndMinutes(timerState.plannedMinutes)}</strong>
        </p>
      </div>

      {/* Main Focus Clock Ring */}
      <div className="relative w-80 h-80 flex items-center justify-center glass-panel rounded-full border border-zinc-800 shadow-2xl">
        <svg className="w-full h-full transform -rotate-90 p-4" viewBox="0 0 240 240">
          <circle cx="120" cy="120" r="100" stroke="currentColor" strokeWidth="10" className="text-zinc-800/80" fill="transparent" />
          <circle
            cx="120"
            cy="120"
            r="100"
            stroke="url(#timerGradient)"
            strokeWidth="10"
            strokeDasharray={2 * Math.PI * 100}
            strokeDashoffset={2 * Math.PI * 100 - (progressPct / 100) * 2 * Math.PI * 100}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-300"
          />
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
        </svg>

        {/* Digital Stopwatch Display */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-5xl font-mono font-extrabold text-white tracking-tight">
            {pad(hours)}:{pad(minutes)}:{pad(seconds)}
          </span>
          <span className="text-xs font-semibold text-emerald-400 tracking-wider mt-2 uppercase">
            {timerState.isRunning && !timerState.isPaused ? 'Active Focus Session' : timerState.isPaused ? 'Paused' : 'Ready'}
          </span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center space-x-4">
        {!timerState.isRunning && !timerState.isPaused ? (
          <button
            onClick={() => startTimer(timerState.activityTitle, timerState.plannedMinutes, timerState.activityId)}
            className="px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm shadow-glow flex items-center space-x-2 transition-all scale-105"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Start Session</span>
          </button>
        ) : timerState.isRunning ? (
          <button
            onClick={pauseTimer}
            className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm shadow-glow flex items-center space-x-2 transition-all"
          >
            <Pause className="w-5 h-5 fill-current" />
            <span>Pause Timer</span>
          </button>
        ) : (
          <button
            onClick={resumeTimer}
            className="px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm shadow-glow flex items-center space-x-2 transition-all"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Resume</span>
          </button>
        )}

        {(timerState.isRunning || timerState.isPaused) && (
          <button
            onClick={() => setShowFinishModal(true)}
            className="px-8 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-sm shadow-glow-purple flex items-center space-x-2 transition-all"
          >
            <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
            <span>Finish & Log</span>
          </button>
        )}

        <button
          onClick={resetTimer}
          className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
          title="Reset Timer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Post Session Modal */}
      {showFinishModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#09090B] border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Session Completed!
            </h3>

            <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs space-y-1">
              <div className="flex justify-between text-zinc-400">
                <span>Planned Duration:</span>
                <span className="font-bold text-white">{formatHoursAndMinutes(timerState.plannedMinutes)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Actual Duration Logged:</span>
                <span className="font-bold text-emerald-400">{formatHoursAndMinutes(Math.round(elapsed / 60))}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Focus Rating</label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className={`p-2 rounded-xl border transition-all ${
                      rating >= s ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' : 'bg-zinc-900 border-zinc-800 text-zinc-600'
                    }`}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Session Notes & Topics Covered</label>
              <textarea
                rows={3}
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                placeholder="What topics or problems did you solve during this session?"
              />
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setShowFinishModal(false)}
                className="w-1/2 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-semibold text-xs hover:bg-zinc-700"
              >
                Cancel
              </button>
              <button
                onClick={handleFinishSession}
                className="w-1/2 py-2.5 rounded-xl bg-emerald-500 text-black font-extrabold text-xs hover:bg-emerald-400 shadow-glow"
              >
                Save to Database
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
