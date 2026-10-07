import React, { useState } from 'react';
import { X, Award, CheckCircle2, AlertCircle, Save, Sparkles, BookOpen, Moon } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { calculateDisciplineScore, calculateStudyAccuracy } from '../../utils/calculations';
import { getTodayDateString } from '../../utils/time';
import confetti from 'canvas-confetti';

export const DailyReviewModal: React.FC = () => {
  const {
    dailyReviewModalOpen,
    setDailyReviewModalOpen,
    habits,
    todayHabitLogs,
    studySessions,
    recordDailyReview,
  } = useAppStore();

  const todayStr = getTodayDateString();

  // Calculate today's stats
  const completedHabitsCount = habits.filter((h) => !!todayHabitLogs[h.id]).length;
  const habitCompletionPct = habits.length > 0 ? (completedHabitsCount / habits.length) * 100 : 100;

  // Study hours today
  const todaySessions = studySessions.filter((s) => s.date === todayStr);
  const actualMinutes = todaySessions.reduce((acc, s) => acc + s.actualMinutes, 0);
  const plannedMinutes = 12 * 60; // Default 12 hours
  const actualHours = Number((actualMinutes / 60).toFixed(1));

  const studyAccuracy = calculateStudyAccuracy(plannedMinutes, actualMinutes);
  const timetableAdherence = 88; // Default 88%
  const [sleepHours, setSleepHours] = useState(7.5);
  const sleepConsistency = Math.min(100, (sleepHours / 7.5) * 100);

  const disciplineScore = calculateDisciplineScore(
    studyAccuracy,
    habitCompletionPct,
    timetableAdherence,
    sleepConsistency
  );

  const [bestSession, setBestSession] = useState('Study Session 2 (Problem Solving)');
  const [notes, setNotes] = useState('');

  if (!dailyReviewModalOpen) return null;

  const handleSaveReview = async () => {
    // Trigger celebration confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    await recordDailyReview({
      id: `rev_${todayStr}`,
      date: todayStr,
      disciplineScore,
      studyAccuracy,
      habitCompletion: Number(habitCompletionPct.toFixed(1)),
      timetableAdherence,
      sleepConsistency: Number(sleepConsistency.toFixed(1)),
      totalStudyHours: actualHours,
      plannedStudyHours: 12,
      completedHabitsCount,
      totalHabitsCount: habits.length,
      sleepHours,
      bestSession,
      notes,
      createdAt: new Date().toISOString(),
    });

    setDailyReviewModalOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#09090B] border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-6 glass-panel relative animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => setDailyReviewModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Title */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-emerald-400 flex items-center justify-center shadow-glow-purple">
            <Award className="w-6 h-6 text-white stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Daily Review & Reflection
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </h3>
            <p className="text-xs text-zinc-400 font-medium">Record today's metrics & lock in discipline score</p>
          </div>
        </div>

        {/* Discipline Score Highlight Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-zinc-900 to-purple-950/60 border border-emerald-500/30 flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Today's Discipline Score</p>
            <p className="text-3xl font-extrabold text-white mt-1 flex items-baseline gap-1">
              {disciplineScore}%
              <span className="text-xs font-normal text-emerald-400 font-medium">High Performance</span>
            </p>
          </div>
          <div className="text-right text-xs space-y-1">
            <div className="text-zinc-400">Study Accuracy: <span className="text-emerald-400 font-semibold">{studyAccuracy}%</span></div>
            <div className="text-zinc-400">Habit Completion: <span className="text-purple-400 font-semibold">{habitCompletionPct.toFixed(0)}%</span></div>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
            <p className="text-[11px] text-zinc-400 font-medium">Total Study Hours</p>
            <p className="text-lg font-bold text-white mt-1">{actualHours} / 12 Hours</p>
          </div>
          <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
            <p className="text-[11px] text-zinc-400 font-medium">Habits Done</p>
            <p className="text-lg font-bold text-emerald-400 mt-1">{completedHabitsCount} / {habits.length}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
            <p className="text-[11px] text-zinc-400 font-medium">Sleep Target</p>
            <div className="flex items-center space-x-2 mt-1">
              <input
                type="number"
                step="0.5"
                min="3"
                max="12"
                value={sleepHours}
                onChange={(e) => setSleepHours(parseFloat(e.target.value) || 7.5)}
                className="w-16 px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-xs font-bold text-white text-center focus:outline-none focus:border-emerald-500"
              />
              <span className="text-xs text-zinc-400 font-medium">Hours</span>
            </div>
          </div>
        </div>

        {/* Habits Breakdown */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-zinc-300">Habits Summary</p>
          <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto pr-1">
            {habits.map((h) => {
              const done = !!todayHabitLogs[h.id];
              return (
                <div
                  key={h.id}
                  className={`flex items-center justify-between p-2 rounded-xl border text-xs ${
                    done
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400'
                  }`}
                >
                  <span className="font-medium truncate">{h.name}</span>
                  {done ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 text-zinc-600 shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Best Study Session & Reflection Notes */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Best Study Session Today</label>
            <input
              type="text"
              value={bestSession}
              onChange={(e) => setBestSession(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              placeholder="e.g. Study Session 2 (Problem Solving)"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Daily Reflection & Takeaways</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              placeholder="What went well today? What can be improved for tomorrow's 12-hour routine?"
            />
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleSaveReview}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-black font-extrabold text-sm tracking-wide shadow-glow flex items-center justify-center space-x-2 transition-all duration-200"
        >
          <Save className="w-4 h-4 fill-current" />
          <span>Save Today's Review & Lock Discipline Score</span>
        </button>
      </div>
    </div>
  );
};
