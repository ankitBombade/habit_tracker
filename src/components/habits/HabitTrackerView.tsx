import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Habit, HabitCategory } from '../../types';
import {
  CheckCircle2,
  Plus,
  Flame,
  Dumbbell,
  BookOpen,
  Droplets,
  Sun,
  Moon,
  Smile,
  Trash2,
  Filter,
  Calendar,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const CATEGORY_COLORS: Record<HabitCategory, string> = {
  Study: '#8B5CF6',
  Health: '#10B981',
  Fitness: '#F97316',
  Morning: '#3B82F6',
  Night: '#6366F1',
  Personal: '#EC4899',
};

export const HabitTrackerView: React.FC = () => {
  const { habits, todayHabitLogs, toggleHabitToday, addHabit, removeHabit } = useAppStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<HabitCategory>('Study');
  const [target, setTarget] = useState('Daily Target');
  const [icon, setIcon] = useState('BookOpen');
  const [notes, setNotes] = useState('');

  const filteredHabits = habits.filter(
    (h) => selectedCategory === 'All' || h.category === selectedCategory
  );

  const completedTodayCount = habits.filter((h) => !!todayHabitLogs[h.id]).length;
  const completionPct = habits.length > 0 ? Math.round((completedTodayCount / habits.length) * 100) : 0;

  const handleToggle = async (habitId: string) => {
    const isNowDone = !todayHabitLogs[habitId];
    await toggleHabitToday(habitId);

    if (isNowDone) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
  };

  const handleCreateHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newHabit: Habit = {
      id: `h_${Date.now()}`,
      name,
      category,
      icon,
      target,
      notes,
      createdAt: new Date().toISOString(),
      currentStreak: 0,
      longestStreak: 0,
    };

    await addHabit(newHabit);
    setShowAddModal(false);
    setName('');
    setNotes('');
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto max-h-[calc(100vh-4rem)] pb-20">
      {/* Top Header & Metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Habit & Discipline Engine
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </h1>
          <p className="text-xs text-zinc-400 font-medium mt-1">
            Build consistency with daily habit streaks and unlimited custom habits
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Mode Switcher */}
          <div className="flex items-center bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs font-semibold">
            {(['daily', 'weekly', 'monthly'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 rounded-lg capitalize transition-all ${
                  viewMode === mode
                    ? 'bg-zinc-800 text-emerald-400 border border-zinc-700'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center space-x-1.5 shadow-glow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Habit</span>
          </button>
        </div>
      </div>

      {/* Completion Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-purple-950/40 border border-zinc-800 flex items-center justify-between shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg">
            {completionPct}%
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Daily Habit Completion Progress</h3>
            <p className="text-xs text-zinc-400 font-medium mt-0.5">
              {completedTodayCount} of {habits.length} habits completed today
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
          {['All', 'Study', 'Health', 'Fitness', 'Morning', 'Night', 'Personal'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-black font-bold shadow-glow'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Habit Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHabits.map((h) => {
          const isDone = !!todayHabitLogs[h.id];
          const color = CATEGORY_COLORS[h.category] || '#10B981';

          return (
            <div
              key={h.id}
              className={`p-5 rounded-3xl border transition-all duration-200 relative overflow-hidden group ${
                isDone
                  ? 'bg-gradient-to-r from-zinc-900 via-zinc-900 to-emerald-950/30 border-emerald-500/40 shadow-glow'
                  : 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700/80'
              }`}
            >
              {/* Category tag */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-black"
                  style={{ backgroundColor: color }}
                >
                  {h.category}
                </span>

                <div className="flex items-center space-x-2">
                  {/* Streak badge */}
                  <div className="flex items-center space-x-1 text-orange-400 font-bold text-xs flame-animated">
                    <Flame className="w-3.5 h-3.5 fill-orange-500" />
                    <span>{h.currentStreak}d</span>
                  </div>

                  <button
                    onClick={() => removeHabit(h.id)}
                    className="p-1 rounded bg-zinc-800 text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Title & Checkbox */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className={`text-base font-bold transition-colors ${isDone ? 'text-emerald-300 line-through' : 'text-white'}`}>
                    {h.name}
                  </h3>
                  <p className="text-xs text-zinc-400 font-medium mt-1">{h.target}</p>
                </div>

                <button
                  onClick={() => handleToggle(h.id)}
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center border-2 transition-all ${
                    isDone
                      ? 'bg-emerald-500 border-emerald-400 text-black shadow-glow scale-105'
                      : 'bg-zinc-900 border-zinc-700 text-transparent hover:border-zinc-500'
                  }`}
                >
                  <CheckCircle2 className={`w-5 h-5 ${isDone ? 'stroke-[2.5]' : ''}`} />
                </button>
              </div>

              {/* Habit Notes & Longest streak */}
              <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
                <span className="truncate max-w-[180px]">{h.notes || 'Daily discipline target'}</span>
                <span>Best: <strong className="text-zinc-300">{h.longestStreak}d</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Habit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#09090B] border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Create New Habit</h3>
            <form onSubmit={handleCreateHabit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Habit Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Solve 5 LeetCode Problems"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as HabitCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Study">Study</option>
                    <option value="Health">Health</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Morning">Morning</option>
                    <option value="Night">Night</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Target / Goal</label>
                  <input
                    type="text"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. 45 mins daily"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Notes / Motivation</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Why is this habit critical for your routine?"
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-semibold text-xs hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-500 text-black font-extrabold text-xs hover:bg-emerald-400 shadow-glow"
                >
                  Save Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
