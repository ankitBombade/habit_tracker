import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { DisciplineScoreRing } from './DisciplineScoreRing';
import { StatCard } from './StatCard';
import { StreakCard } from './StreakCard';
import { TimelineWidget } from './TimelineWidget';
import { BookOpen, CheckCircle2, CheckSquare, Clock, Moon, Target, Zap, Activity as ActivityIcon, ArrowRight } from 'lucide-react';
import { calculateDisciplineScore, calculateStudyAccuracy } from '../../utils/calculations';
import { getTodayDateString } from '../../utils/time';

export const DashboardView: React.FC = () => {
  const {
    routines,
    activeRoutineId,
    habits,
    todayHabitLogs,
    toggleHabitToday,
    tasks,
    toggleTask,
    studySessions,
    settings,
    setActiveTab,
  } = useAppStore();

  const activeRoutine = routines.find((r) => r.id === activeRoutineId) || routines[0];
  const activities = activeRoutine ? activeRoutine.activities : [];

  const todayStr = getTodayDateString();
  const todaySessions = studySessions.filter((s) => s.date === todayStr);

  // 1. Planned Study Hours calculated dynamically from active routine study blocks
  const plannedStudyMinutesFromRoutine = activities
    .filter((a) => a.isStudySession || a.category === 'Study')
    .reduce((acc, a) => acc + (a.plannedMinutes || 0), 0);

  const plannedStudyMinutes = plannedStudyMinutesFromRoutine > 0 ? plannedStudyMinutesFromRoutine : (settings.studyTargetHours || 12) * 60;
  const plannedStudyHours = Number((plannedStudyMinutes / 60).toFixed(1));

  // 2. Actual Study Hours calculated dynamically from recorded database study sessions
  const actualStudyMinutes = todaySessions.reduce((acc, s) => acc + s.actualMinutes, 0);
  const actualStudyHours = Number((actualStudyMinutes / 60).toFixed(1));
  const remainingStudyHours = Math.max(0, Number((plannedStudyHours - actualStudyHours).toFixed(1)));

  // 3. Study Accuracy Formula: Actual / Planned * 100 (Safe division by zero prevention)
  const studyAccuracy = plannedStudyMinutes > 0 ? calculateStudyAccuracy(plannedStudyMinutes, actualStudyMinutes) : 0;

  // 4. Habit Completion % calculated dynamically from today's real habit logs
  const completedHabitsCount = habits.filter((h) => !!todayHabitLogs[h.id]).length;
  const totalHabitsCount = habits.length;
  const habitCompletionPct = totalHabitsCount > 0 ? Number(((completedHabitsCount / totalHabitsCount) * 100).toFixed(1)) : 0;

  // 5. Real Streak Calculation (Max streak among all active habits)
  const currentStreak = habits.length > 0 ? Math.max(...habits.map((h) => h.currentStreak || 0)) : 0;
  const longestStreak = habits.length > 0 ? Math.max(...habits.map((h) => h.longestStreak || 0)) : 0;

  const timetableAdherence = activities.length > 0 ? Math.min(100, Math.round((todaySessions.length / Math.max(1, activities.filter(a => a.isStudySession).length)) * 100)) : 100;
  const sleepHours = settings.sleepTargetHours || 7.5;
  const sleepConsistency = 90;

  // 6. Overall Daily Discipline Score (40% study, 25% habits, 20% timetable, 15% sleep)
  const disciplineScore = calculateDisciplineScore(studyAccuracy, habitCompletionPct, timetableAdherence, sleepConsistency);

  // Today's pending tasks
  const todayTasks = tasks.filter((t) => t.dueDate === todayStr || !t.completed).slice(0, 4);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto max-h-[calc(100vh-4rem)] pb-16">
      {/* Top Banner Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            FocusForge Command Center
            <Zap className="w-5 h-5 text-emerald-400 fill-emerald-400" />
          </h1>
          <p className="text-xs text-zinc-400 font-medium mt-1">
            Tracking active routine: <span className="text-emerald-400 font-semibold">{activeRoutine?.name || '12 Hour Study Routine'}</span>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('routine_editor')}
            className="px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
          >
            Switch Routine
          </button>
        </div>
      </div>

      {/* Main Hero Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DisciplineScoreRing
          score={disciplineScore}
          studyAccuracy={studyAccuracy}
          habitCompletion={habitCompletionPct}
          timetableAdherence={timetableAdherence}
          sleepConsistency={sleepConsistency}
        />

        <StreakCard
          currentStreak={currentStreak}
          longestStreak={longestStreak}
          studyStreak={currentStreak}
          exerciseStreak={currentStreak}
          wakeupStreak={currentStreak}
        />

        <TimelineWidget activities={activities} />
      </div>

      {/* Primary KPI Cards Grid */}
      <div>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-zinc-400 mb-4">
          Today's Key Performance Indicators
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard
            title="Planned Study"
            value={`${plannedStudyHours}h`}
            subtitle="Routine Target"
            icon={<Target className="w-4 h-4 text-purple-400" />}
          />
          <StatCard
            title="Completed Study"
            value={`${actualStudyHours}h`}
            subtitle="Recorded Sessions"
            icon={<BookOpen className="w-4 h-4 text-emerald-400" />}
            trend={actualStudyHours > 0 ? `+${actualStudyHours}h` : undefined}
          />
          <StatCard
            title="Remaining Study"
            value={`${remainingStudyHours}h`}
            subtitle="To Hit Goal"
            icon={<Clock className="w-4 h-4 text-amber-400" />}
          />
          <StatCard
            title="Today's Accuracy"
            value={`${studyAccuracy}%`}
            subtitle="Actual / Planned"
            icon={<ActivityIcon className="w-4 h-4 text-blue-400" />}
          />
          <StatCard
            title="Habit Consistency"
            value={`${habitCompletionPct}%`}
            subtitle={`${completedHabitsCount}/${totalHabitsCount} Habits Done`}
            icon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          />
          <StatCard
            title="Sleep Target"
            value={`${sleepHours}h`}
            subtitle="Optimal Recovery"
            icon={<Moon className="w-4 h-4 text-indigo-400" />}
          />
        </div>
      </div>

      {/* Today's Tasks & Today's Habits Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today Tasks Widget */}
        <div className="glass-panel p-6 rounded-3xl border border-zinc-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckSquare className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white">Today's Focus Tasks</h3>
            </div>
            <button
              onClick={() => setActiveTab('tasks')}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center space-x-1"
            >
              <span>View All Tasks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {todayTasks.length === 0 ? (
              <p className="text-xs text-zinc-500 py-4 text-center">No tasks scheduled for today</p>
            ) : (
              todayTasks.map((t) => (
                <div
                  key={t.id}
                  className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-2.5">
                    <button
                      onClick={() => toggleTask(t.id)}
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                        t.completed
                          ? 'bg-emerald-500 border-emerald-400 text-black'
                          : 'bg-zinc-800 border-zinc-700 text-transparent hover:border-zinc-500'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                    </button>
                    <span className={`font-medium ${t.completed ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                      {t.title}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-zinc-800 text-zinc-400 border border-zinc-700">
                    {t.priority}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Today Habits Widget */}
        <div className="glass-panel p-6 rounded-3xl border border-zinc-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Today's Habits Checklist</h3>
            </div>
            <button
              onClick={() => setActiveTab('habits')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
            >
              <span>View Habit Grid</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {habits.slice(0, 4).map((h) => {
              const isDone = !!todayHabitLogs[h.id];
              return (
                <div
                  key={h.id}
                  className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-2.5">
                    <button
                      onClick={() => toggleHabitToday(h.id)}
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                        isDone
                          ? 'bg-emerald-500 border-emerald-400 text-black'
                          : 'bg-zinc-800 border-zinc-700 text-transparent hover:border-zinc-500'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                    </button>
                    <span className={`font-medium ${isDone ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                      {h.name}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-orange-400">{h.currentStreak}d streak</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
