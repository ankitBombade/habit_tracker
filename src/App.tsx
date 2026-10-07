import React, { useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { CommandPalette } from './components/common/CommandPalette';
import { DailyReviewModal } from './components/common/DailyReviewModal';
import { DashboardView } from './components/dashboard/DashboardView';
import { TimetableMode } from './components/timetable/TimetableMode';
import { TasksView } from './components/tasks/TasksView';
import { HabitTrackerView } from './components/habits/HabitTrackerView';
import { StudyTimerView } from './components/timer/StudyTimerView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { HistoryView } from './components/history/HistoryView';
import { RoutineEditorView } from './components/routine/RoutineEditorView';
import { SettingsView } from './components/settings/SettingsView';

export const App: React.FC = () => {
  const { activeTab, loadInitialData, isInitialized } = useAppStore();

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  if (!isInitialized) {
    return (
      <div className="h-screen w-screen bg-[#09090B] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center animate-spin">
          <div className="w-6 h-6 rounded-full border-2 border-emerald-400 border-t-transparent" />
        </div>
        <p className="text-xs font-semibold text-zinc-400">Loading FocusForge SQLite Engine...</p>
      </div>
    );
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'timetable':
        return <TimetableMode />;
      case 'tasks':
        return <TasksView />;
      case 'habits':
        return <HabitTrackerView />;
      case 'timer':
        return <StudyTimerView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'history':
        return <HistoryView />;
      case 'routine_editor':
        return <RoutineEditorView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#09090B] text-zinc-100 overflow-hidden font-sans select-none">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gradient-to-b from-[#09090B] via-[#09090B] to-[#0D0D11]">
        <Header />
        <main className="flex-1 overflow-hidden relative">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Modals */}
      <CommandPalette />
      <DailyReviewModal />
    </div>
  );
};

export default App;
