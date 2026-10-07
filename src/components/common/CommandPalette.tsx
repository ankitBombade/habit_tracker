import React, { useState, useEffect } from 'react';
import { Search, LayoutDashboard, Calendar, CheckSquare, CheckCircle2, Timer, BarChart3, History, Sliders, Settings, X } from 'lucide-react';
import { useAppStore, TabType } from '../../store/useAppStore';

export const CommandPalette: React.FC = () => {
  const { commandPaletteOpen, setCommandPaletteOpen, setActiveTab, habits, tasks, toggleHabitToday, toggleTask } = useAppStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const actions = [
    { id: 'dashboard', title: 'Go to Dashboard', category: 'Navigation', icon: <LayoutDashboard className="w-4 h-4 text-emerald-400" />, action: () => setActiveTab('dashboard') },
    { id: 'timetable', title: 'View Daily Timetable Schedule', category: 'Navigation', icon: <Calendar className="w-4 h-4 text-purple-400" />, action: () => setActiveTab('timetable') },
    { id: 'tasks', title: 'Open Tasks Engine', category: 'Navigation', icon: <CheckSquare className="w-4 h-4 text-blue-400" />, action: () => setActiveTab('tasks') },
    { id: 'habits', title: 'Open Habit Tracker', category: 'Navigation', icon: <CheckCircle2 className="w-4 h-4 text-orange-400" />, action: () => setActiveTab('habits') },
    { id: 'timer', title: 'Start Deep Work Study Timer', category: 'Action', icon: <Timer className="w-4 h-4 text-emerald-400" />, action: () => setActiveTab('timer') },
    { id: 'analytics', title: 'View Analytics & Performance Charts', category: 'Navigation', icon: <BarChart3 className="w-4 h-4 text-indigo-400" />, action: () => setActiveTab('analytics') },
    { id: 'history', title: 'Open History & Calendar Logs', category: 'Navigation', icon: <History className="w-4 h-4 text-amber-400" />, action: () => setActiveTab('history') },
    { id: 'routine_editor', title: 'Edit Routines & Activities', category: 'Navigation', icon: <Sliders className="w-4 h-4 text-pink-400" />, action: () => setActiveTab('routine_editor') },
    { id: 'settings', title: 'Application Settings & SQLite Backup', category: 'Navigation', icon: <Settings className="w-4 h-4 text-zinc-400" />, action: () => setActiveTab('settings') },
  ];

  const habitActions = habits.map((h) => ({
    id: `habit_${h.id}`,
    title: `Toggle Habit: ${h.name}`,
    category: 'Habits',
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    action: () => toggleHabitToday(h.id),
  }));

  const taskActions = tasks.filter((t) => !t.completed).map((t) => ({
    id: `task_${t.id}`,
    title: `Complete Task: ${t.title}`,
    category: 'Tasks',
    icon: <CheckSquare className="w-4 h-4 text-blue-400" />,
    action: () => toggleTask(t.id),
  }));

  const allCommands = [...actions, ...taskActions, ...habitActions].filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()) || c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-start justify-center pt-24 animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-[#09090B] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden glass-panel">
        <div className="flex items-center px-4 py-3 border-b border-zinc-800/80">
          <Search className="w-4 h-4 text-zinc-400 mr-3" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command, habit, or task title..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {allCommands.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-500">No commands found.</div>
          ) : (
            allCommands.map((cmd) => (
              <button
                key={cmd.id}
                onClick={() => {
                  cmd.action();
                  setCommandPaletteOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-zinc-800/80 text-left transition-colors text-xs group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 group-hover:border-zinc-700">
                    {cmd.icon}
                  </div>
                  <span className="text-zinc-200 font-medium group-hover:text-white">{cmd.title}</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                  {cmd.category}
                </span>
              </button>
            ))
          )}
        </div>

        <div className="px-4 py-2 bg-zinc-900/60 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
          <span>FocusForge Quick Command Palette</span>
          <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400 font-mono text-[10px]">
            ESC to close
          </kbd>
        </div>
      </div>
    </div>
  );
};
