import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Activity, Routine } from '../../types';
import { formatTime24to12, isCurrentTimeInBlock, calculateDurationMinutes } from '../../utils/time';
import { formatHoursAndMinutes } from '../../utils/calculations';
import { Clock, Play, Plus, Edit2, Trash2, Copy, Check, Sparkles, MoveUp, MoveDown } from 'lucide-react';

export const TimetableMode: React.FC = () => {
  const { routines, activeRoutineId, switchRoutine, updateActivity, removeActivity, setActiveTab, startTimer, addRoutine } = useAppStore();

  const activeRoutine = routines.find((r) => r.id === activeRoutineId) || routines[0];
  const activities = activeRoutine ? activeRoutine.activities : [];

  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New activity form state
  const [newTitle, setNewTitle] = useState('');
  const [newStart, setNewStart] = useState('09:00');
  const [newEnd, setNewEnd] = useState('12:00');
  const [newCategory, setNewCategory] = useState<Activity['category']>('Study');
  const [newColor, setNewColor] = useState('#8B5CF6');

  // Total Planned Study Hours in this routine
  const totalStudyMinutes = activities
    .filter((a) => a.isStudySession || a.category === 'Study')
    .reduce((acc, a) => acc + calculateDurationMinutes(a.startTime, a.endTime), 0);

  const handleDuplicateRoutine = async () => {
    if (!activeRoutine) return;
    const newId = `routine_${Date.now()}`;
    const duplicated: Routine = {
      id: newId,
      name: `${activeRoutine.name} (Copy)`,
      description: activeRoutine.description,
      isActive: false,
      isDefault: false,
      createdAt: new Date().toISOString(),
      activities: activeRoutine.activities.map((a) => ({ ...a, id: `act_${Math.random().toString(36).substring(2, 9)}`, routineId: newId })),
    };
    await addRoutine(duplicated);
    await switchRoutine(newId);
  };

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const plannedMins = calculateDurationMinutes(newStart, newEnd);
    const act: Activity = {
      id: `act_${Date.now()}`,
      routineId: activeRoutine.id,
      title: newTitle,
      startTime: newStart,
      endTime: newEnd,
      category: newCategory,
      color: newColor,
      position: activities.length,
      isStudySession: newCategory === 'Study',
      plannedMinutes: plannedMins,
    };

    await updateActivity(act);
    setShowAddModal(false);
    setNewTitle('');
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= activities.length) return;

    const actA = { ...activities[index], position: newIdx };
    const actB = { ...activities[newIdx], position: index };

    await updateActivity(actA);
    await updateActivity(actB);
  };

  return (
    <div className="p-8 space-y-6 max-w-6xl mx-auto overflow-y-auto max-h-[calc(100vh-4rem)] pb-20">
      {/* Top Header & Multi-Routine Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Daily Timetable Engine
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </h1>
          <p className="text-xs text-zinc-400 font-medium mt-1">
            Total Planned Study Time: <span className="text-emerald-400 font-bold">{formatHoursAndMinutes(totalStudyMinutes)}</span>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Routine Switcher Pills */}
          <div className="flex items-center bg-zinc-900/90 p-1 rounded-2xl border border-zinc-800 space-x-1">
            {routines.map((r) => {
              const isActive = r.id === activeRoutineId;
              return (
                <button
                  key={r.id}
                  onClick={() => switchRoutine(r.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-zinc-800 text-emerald-400 border border-zinc-700 shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {r.name}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleDuplicateRoutine}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
            title="Duplicate Routine"
          >
            <Copy className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center space-x-1.5 shadow-glow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Activity</span>
          </button>
        </div>
      </div>

      {/* Routine Description Banner */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
        <div>
          <span className="font-semibold text-white">{activeRoutine?.name}</span>: {activeRoutine?.description}
        </div>
        <div className="text-zinc-500 font-mono text-[11px]">
          {activities.length} Scheduled Blocks
        </div>
      </div>

      {/* Timeline Activities Grid */}
      <div className="space-y-3 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-zinc-800">
        {activities.map((act, index) => {
          const isCurrent = isCurrentTimeInBlock(act.startTime, act.endTime);
          const duration = calculateDurationMinutes(act.startTime, act.endTime);

          return (
            <div
              key={act.id}
              className={`relative pl-14 transition-all duration-200 group`}
            >
              {/* Timeline Marker Circle */}
              <div
                className={`absolute left-3.5 top-5 -translate-x-1/2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  isCurrent
                    ? 'bg-emerald-500 border-emerald-400 shadow-glow animate-pulse'
                    : 'bg-zinc-900 border-zinc-700'
                }`}
                style={{ borderColor: isCurrent ? undefined : act.color }}
              >
                {isCurrent && <span className="w-2 h-2 rounded-full bg-black" />}
              </div>

              {/* Activity Card */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-gradient-to-r from-zinc-900 via-zinc-900 to-emerald-950/40 border-emerald-500/50 shadow-glow'
                    : 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-black"
                      style={{ backgroundColor: act.color }}
                    >
                      {act.category}
                    </span>
                    <h3 className="text-base font-bold text-white">{act.title}</h3>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase tracking-widest border border-emerald-500/30">
                        NOW ACTIVE
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    {/* Time & Duration badge */}
                    <div className="text-right">
                      <p className="text-xs font-mono font-bold text-zinc-200">
                        {formatTime24to12(act.startTime)} - {formatTime24to12(act.endTime)}
                      </p>
                      <p className="text-[10px] text-zinc-500 font-medium">{formatHoursAndMinutes(duration)}</p>
                    </div>

                    {/* Quick Focus Button if Study Session */}
                    {act.isStudySession && (
                      <button
                        onClick={() => {
                          startTimer(act.title, act.plannedMinutes || duration, act.id);
                          setActiveTab('timer');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center space-x-1 transition-all"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Focus</span>
                      </button>
                    )}

                    {/* Move Up/Down & Delete Action controls */}
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleMove(index, 'up')}
                        disabled={index === 0}
                        className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMove(index, 'down')}
                        disabled={index === activities.length - 1}
                        className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removeActivity(act.id)}
                        className="p-1 rounded bg-zinc-800 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add Activity */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#09090B] border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Add New Activity Block</h3>
            <form onSubmit={handleCreateActivity} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Study Session 5 (Problem Solving)"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={newStart}
                    onChange={(e) => setNewStart(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">End Time</label>
                  <input
                    type="time"
                    value={newEnd}
                    onChange={(e) => setNewEnd(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Study">Study</option>
                    <option value="Exercise">Exercise</option>
                    <option value="Break">Break</option>
                    <option value="Routine">Routine</option>
                    <option value="Sleep">Sleep</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Color Tag</label>
                  <input
                    type="color"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="w-full h-9 rounded-xl bg-zinc-900 border border-zinc-800 cursor-pointer"
                  />
                </div>
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
                  Create Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
