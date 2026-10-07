import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  CheckCircle2,
  Timer,
  BarChart3,
  History,
  Sliders,
  Settings,
  Flame,
  Search,
  Zap,
} from 'lucide-react';
import { useAppStore, TabType } from '../../store/useAppStore';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, setCommandPaletteOpen, habits, tasks } = useAppStore();

  const pendingTasksCount = tasks.filter((t) => !t.completed).length;

  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'timetable', label: 'Daily Timetable', icon: <Calendar className="w-5 h-5" /> },
    { id: 'tasks', label: 'Tasks Engine', icon: <CheckSquare className="w-5 h-5" />, badge: pendingTasksCount },
    { id: 'habits', label: 'Habit Tracker', icon: <CheckCircle2 className="w-5 h-5" />, badge: habits.length },
    { id: 'timer', label: 'Study Timer', icon: <Timer className="w-5 h-5" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'history', label: 'History & Logs', icon: <History className="w-5 h-5" /> },
    { id: 'routine_editor', label: 'Routine Editor', icon: <Sliders className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-64 bg-[#09090B]/90 border-r border-zinc-800/80 flex flex-col justify-between p-4 select-none z-20">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 pt-1">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center shadow-glow">
              <Zap className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                FocusForge
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                  PRO
                </span>
              </h1>
              <p className="text-[11px] text-zinc-400 font-medium">Personal Productivity</p>
            </div>
          </div>
        </div>

        {/* Raycast Quick Search Button */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all duration-200 group text-xs"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 group-hover:text-emerald-400 transition-colors" />
            <span>Quick search...</span>
          </div>
          <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[10px] font-mono text-zinc-400">
            Ctrl+K
          </kbd>
        </button>

        {/* Main Navigation */}
        <nav className="space-y-1">
          <div className="px-3 text-[10px] font-semibold tracking-wider text-zinc-400 uppercase mb-2">
            Navigation
          </div>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-xs transition-all duration-200 ${
                  isActive
                    ? 'bg-zinc-800/90 text-white border border-zinc-700/80 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={isActive ? 'text-emerald-400' : 'text-zinc-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 text-[10px] rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Local SQLite Badge */}
      <div className="pt-4 border-t border-zinc-800/80">
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-900/50 border border-zinc-800/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-bold text-white text-xs">
              FF
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-200">High Performer</p>
              <p className="text-[10px] text-zinc-400">Offline SQLite Sync</p>
            </div>
          </div>
          <div className="flex items-center text-orange-400 text-xs font-bold gap-1 flame-animated">
            <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
          </div>
        </div>
      </div>
    </aside>
  );
};
