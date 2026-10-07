import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Calendar, CheckCircle2, BookOpen, Clock, Award, CheckSquare, Sparkles } from 'lucide-react';
import { calculateStudyAccuracy, formatHoursAndMinutes } from '../../utils/calculations';
import { formatTime24to12 } from '../../utils/time';

export const HistoryView: React.FC = () => {
  const { habits, tasks, studySessions, dailyReviews, historyDate, setHistoryDate } = useAppStore();

  const selectedReviews = dailyReviews.filter((r) => r.date === historyDate);
  const selectedSessions = studySessions.filter((s) => s.date === historyDate);
  const selectedTasks = tasks.filter((t) => t.dueDate === historyDate || t.completedAt?.startsWith(historyDate));

  const totalStudyMinutes = selectedSessions.reduce((acc, s) => acc + s.actualMinutes, 0);
  const plannedStudyMinutes = selectedSessions.reduce((acc, s) => acc + s.plannedMinutes, 0) || 12 * 60;
  const actualStudyHours = Number((totalStudyMinutes / 60).toFixed(1));
  const plannedStudyHours = Number((plannedStudyMinutes / 60).toFixed(1));

  const accuracyPct = calculateStudyAccuracy(plannedStudyMinutes, totalStudyMinutes);

  const completedTasksCount = selectedTasks.filter((t) => t.completed).length;

  return (
    <div className="p-8 space-y-6 max-w-6xl mx-auto overflow-y-auto max-h-[calc(100vh-4rem)] pb-20">
      {/* Header & Date Picker */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Historical Discipline & Log History
            <Calendar className="w-5 h-5 text-emerald-400" />
          </h1>
          <p className="text-xs text-zinc-400 font-medium mt-1">
            Review past daily performance, logged study sessions, habits, and tasks
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-2 rounded-2xl bg-zinc-900 border border-zinc-800">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <input
              type="date"
              value={historyDate}
              onChange={(e) => setHistoryDate(e.target.value)}
              className="bg-transparent text-xs text-white font-semibold focus:outline-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Date Summary Card Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-emerald-950/30 border border-zinc-800 shadow-xl grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <span className="text-xs text-zinc-400 font-medium">Logged Study Time</span>
          <p className="text-2xl font-extrabold text-white mt-1">{actualStudyHours} / {plannedStudyHours}h</p>
        </div>
        <div>
          <span className="text-xs text-zinc-400 font-medium">Study Accuracy</span>
          <p className="text-2xl font-extrabold text-emerald-400 mt-1">{accuracyPct}%</p>
        </div>
        <div>
          <span className="text-xs text-zinc-400 font-medium">Completed Tasks</span>
          <p className="text-2xl font-extrabold text-purple-400 mt-1">{completedTasksCount} / {selectedTasks.length}</p>
        </div>
        <div>
          <span className="text-xs text-zinc-400 font-medium">Recorded Sessions</span>
          <p className="text-2xl font-extrabold text-amber-400 mt-1">{selectedSessions.length}</p>
        </div>
      </div>

      {/* Historical Logs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Study Sessions Log */}
        <div className="glass-panel p-6 rounded-3xl border border-zinc-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-400" />
              Recorded Focus Sessions
            </h3>
            <span className="text-xs font-mono text-zinc-400">{selectedSessions.length} Sessions</span>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {selectedSessions.length === 0 ? (
              <p className="text-xs text-zinc-500 py-6 text-center">No study sessions recorded for this date</p>
            ) : (
              selectedSessions.map((s) => (
                <div key={s.id} className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-white">{s.activityTitle}</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{s.notes || 'No notes'}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-emerald-400">{formatHoursAndMinutes(s.actualMinutes)}</span>
                    <span className="block text-[10px] text-zinc-500">Accuracy: {s.accuracyPct}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Tasks Completed Log */}
        <div className="glass-panel p-6 rounded-3xl border border-zinc-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-400" />
              Tasks Logged for {historyDate}
            </h3>
            <span className="text-xs font-mono text-zinc-400">{completedTasksCount} Completed</span>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {selectedTasks.length === 0 ? (
              <p className="text-xs text-zinc-500 py-6 text-center">No tasks logged for this date</p>
            ) : (
              selectedTasks.map((t) => (
                <div key={t.id} className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2.5">
                    <CheckCircle2 className={`w-4 h-4 ${t.completed ? 'text-emerald-400' : 'text-zinc-600'}`} />
                    <span className={`font-medium ${t.completed ? 'line-through text-zinc-400' : 'text-white'}`}>{t.title}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-zinc-800 text-zinc-400 border border-zinc-700">
                    {t.priority}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
