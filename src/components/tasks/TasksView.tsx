import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Task, TaskPriority } from '../../types';
import { CheckSquare, Plus, Trash2, Edit2, Calendar, AlertCircle, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import { getTodayDateString } from '../../utils/time';
import confetti from 'canvas-confetti';

const PRIORITY_STYLES: Record<TaskPriority, { bg: string; text: string; border: string }> = {
  urgent: { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/30' },
  high: { bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-500/30' },
  medium: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30' },
  low: { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30' },
};

export const TasksView: React.FC = () => {
  const { tasks, addTask, updateTask, toggleTask, removeTask } = useAppStore();

  const [activeFilter, setActiveFilter] = useState<'today' | 'upcoming' | 'completed' | 'all'>('today');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form State
  const todayStr = getTodayDateString();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(todayStr);
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [category, setCategory] = useState('Study');

  const filteredTasks = tasks.filter((t) => {
    if (activeFilter === 'today') return t.dueDate === todayStr && !t.completed;
    if (activeFilter === 'upcoming') return t.dueDate > todayStr && !t.completed;
    if (activeFilter === 'completed') return t.completed;
    return true;
  });

  const handleToggle = async (t: Task) => {
    const isNowDone = !t.completed;
    await toggleTask(t.id);
    if (isNowDone) {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    if (editingTask) {
      await updateTask({
        ...editingTask,
        title,
        description,
        dueDate,
        priority,
        category,
      });
    } else {
      const newTask: Task = {
        id: `t_${Date.now()}`,
        title,
        description,
        dueDate,
        priority,
        category,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      await addTask(newTask);
    }

    setShowModal(false);
    setEditingTask(null);
    setTitle('');
    setDescription('');
  };

  const openEdit = (t: Task) => {
    setEditingTask(t);
    setTitle(t.title);
    setDescription(t.description || '');
    setDueDate(t.dueDate);
    setPriority(t.priority);
    setCategory(t.category);
    setShowModal(true);
  };

  return (
    <div className="p-8 space-y-6 max-w-6xl mx-auto overflow-y-auto max-h-[calc(100vh-4rem)] pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Task Management Engine
            <CheckSquare className="w-5 h-5 text-emerald-400" />
          </h1>
          <p className="text-xs text-zinc-400 font-medium mt-1">
            Organize daily focus tasks, priority levels, and study deliverables
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Filter Pills */}
          <div className="flex items-center bg-zinc-900/90 p-1 rounded-2xl border border-zinc-800 space-x-1">
            {(['today', 'upcoming', 'completed', 'all'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                  activeFilter === filter
                    ? 'bg-zinc-800 text-emerald-400 border border-zinc-700 shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setEditingTask(null);
              setTitle('');
              setDescription('');
              setShowModal(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center space-x-1.5 shadow-glow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center glass-panel rounded-3xl border border-zinc-800/80">
            <CheckCircle2 className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-zinc-300">No tasks found</p>
            <p className="text-xs text-zinc-500 mt-1">Create a new task to stay on top of your routine</p>
          </div>
        ) : (
          filteredTasks.map((t) => {
            const pStyle = PRIORITY_STYLES[t.priority] || PRIORITY_STYLES.medium;
            return (
              <div
                key={t.id}
                className={`p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between group ${
                  t.completed
                    ? 'bg-zinc-900/40 border-zinc-800/60 opacity-60'
                    : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 shadow-md'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <button
                    onClick={() => handleToggle(t)}
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                      t.completed
                        ? 'bg-emerald-500 border-emerald-400 text-black shadow-glow'
                        : 'bg-zinc-900 border-zinc-700 text-transparent hover:border-zinc-500'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 fill-current" />
                  </button>

                  <div>
                    <h3 className={`text-sm font-bold transition-colors ${t.completed ? 'line-through text-zinc-400' : 'text-white'}`}>
                      {t.title}
                    </h3>
                    {t.description && <p className="text-xs text-zinc-400 mt-0.5">{t.description}</p>}
                    <div className="flex items-center space-x-2 mt-1.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${pStyle.bg} ${pStyle.text} ${pStyle.border}`}>
                        {t.priority}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-800 text-zinc-400 border border-zinc-700">
                        {t.category}
                      </span>
                      <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {t.dueDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(t)}
                    className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => removeTask(t.id)}
                    className="p-1.5 rounded-lg bg-zinc-800 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#09090B] border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">
              {editingTask ? 'Edit Task' : 'Create New Focus Task'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Finish Calculus Chapter 3"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Details, link, or sub-tasks"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Study, Project, Personal"
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-semibold text-xs hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-500 text-black font-extrabold text-xs hover:bg-emerald-400 shadow-glow"
                >
                  {editingTask ? 'Update Task' : 'Save Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
