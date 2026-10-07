import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Activity, Routine } from '../../types';
import { Plus, Trash2, Edit2, Sliders, Check, Copy, Sparkles, Clock } from 'lucide-react';
import { calculateDurationMinutes, formatTime24to12 } from '../../utils/time';
import { formatHoursAndMinutes } from '../../utils/calculations';

export const RoutineEditorView: React.FC = () => {
  const { routines, activeRoutineId, switchRoutine, updateActivity, removeActivity, addRoutine, removeRoutine } = useAppStore();

  const activeRoutine = routines.find((r) => r.id === activeRoutineId) || routines[0];
  const activities = activeRoutine ? activeRoutine.activities : [];

  const [routineName, setRoutineName] = useState('');
  const [routineDesc, setRoutineDesc] = useState('');
  const [showNewRoutineModal, setShowNewRoutineModal] = useState(false);

  // Edit Modal State
  const [editingAct, setEditingAct] = useState<Activity | null>(null);

  const handleCreateRoutine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!routineName) return;

    const newId = `routine_${Date.now()}`;
    const newRoutine: Routine = {
      id: newId,
      name: routineName,
      description: routineDesc || 'Custom routine',
      isActive: false,
      isDefault: false,
      createdAt: new Date().toISOString(),
      activities: [],
    };

    await addRoutine(newRoutine);
    await switchRoutine(newId);
    setShowNewRoutineModal(false);
    setRoutineName('');
    setRoutineDesc('');
  };

  const handleSaveEditedActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAct) return;

    const plannedMinutes = calculateDurationMinutes(editingAct.startTime, editingAct.endTime);
    await updateActivity({
      ...editingAct,
      plannedMinutes,
      isStudySession: editingAct.category === 'Study',
    });

    setEditingAct(null);
  };

  return (
    <div className="p-8 space-y-6 max-w-6xl mx-auto overflow-y-auto max-h-[calc(100vh-4rem)] pb-20">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Routine Architecture Editor
            <Sliders className="w-5 h-5 text-emerald-400" />
          </h1>
          <p className="text-xs text-zinc-400 font-medium mt-1">
            Create, reorder, and configure multiple routines for college, exams, and weekends
          </p>
        </div>

        <button
          onClick={() => setShowNewRoutineModal(true)}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center space-x-1.5 shadow-glow transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Routine</span>
        </button>
      </div>

      {/* Routine Selector Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {routines.map((r) => {
          const isActive = r.id === activeRoutineId;
          return (
            <button
              key={r.id}
              onClick={() => switchRoutine(r.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center space-x-2 border transition-all ${
                isActive
                  ? 'bg-zinc-800 text-emerald-400 border-zinc-700 shadow-md'
                  : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              <span>{r.name}</span>
              {isActive && <Check className="w-3.5 h-3.5" />}
            </button>
          );
        })}
      </div>

      {/* Active Routine Activity Editor List */}
      <div className="space-y-3">
        {activities.map((act) => {
          const duration = calculateDurationMinutes(act.startTime, act.endTime);
          return (
            <div
              key={act.id}
              className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between group hover:border-zinc-700 transition-all"
            >
              <div className="flex items-center space-x-3">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: act.color }} />
                <div>
                  <h3 className="text-sm font-bold text-white">{act.title}</h3>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                    {act.category} • {formatHoursAndMinutes(duration)}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-xs font-mono font-bold text-zinc-300">
                  {formatTime24to12(act.startTime)} - {formatTime24to12(act.endTime)}
                </span>

                <button
                  onClick={() => setEditingAct(act)}
                  className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => removeActivity(act.id)}
                  className="p-1.5 rounded-lg bg-zinc-800 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Activity Modal */}
      {editingAct && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#09090B] border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Edit Activity Configuration</h3>
            <form onSubmit={handleSaveEditedActivity} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingAct.title}
                  onChange={(e) => setEditingAct({ ...editingAct, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={editingAct.startTime}
                    onChange={(e) => setEditingAct({ ...editingAct, startTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">End Time</label>
                  <input
                    type="time"
                    value={editingAct.endTime}
                    onChange={(e) => setEditingAct({ ...editingAct, endTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Category</label>
                  <select
                    value={editingAct.category}
                    onChange={(e) => setEditingAct({ ...editingAct, category: e.target.value as any })}
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
                    value={editingAct.color}
                    onChange={(e) => setEditingAct({ ...editingAct, color: e.target.value })}
                    className="w-full h-9 rounded-xl bg-zinc-900 border border-zinc-800 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingAct(null)}
                  className="w-1/2 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-semibold text-xs hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-500 text-black font-extrabold text-xs hover:bg-emerald-400 shadow-glow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Routine Modal */}
      {showNewRoutineModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#09090B] border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Create New Routine Schedule</h3>
            <form onSubmit={handleCreateRoutine} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Routine Name</label>
                <input
                  type="text"
                  required
                  value={routineName}
                  onChange={(e) => setRoutineName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. College Exam Blitz"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={routineDesc}
                  onChange={(e) => setRoutineDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Focus goal or routine description"
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewRoutineModal(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-semibold text-xs hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-500 text-black font-extrabold text-xs hover:bg-emerald-400 shadow-glow"
                >
                  Create Routine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
