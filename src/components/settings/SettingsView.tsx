import React, { useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Settings, Database, FileSpreadsheet, Upload, Download, Trash2, RefreshCw, Sparkles, AlertTriangle } from 'lucide-react';
import { exportDataToExcel, downloadSqliteBackup, uploadSqliteBackup } from '../../utils/export';

export const SettingsView: React.FC = () => {
  const { settings, updateUserSettings, clearDemoData, resetAllData, dailyReviews, habits, studySessions } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportExcel = () => {
    exportDataToExcel(dailyReviews, habits, studySessions);
  };

  const handleBackupSqlite = () => {
    downloadSqliteBackup();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const success = await uploadSqliteBackup(file);
    if (success) {
      alert('SQLite Database restored successfully! Reloading application data...');
      window.location.reload();
    } else {
      alert('Failed to restore SQLite database. Please check file format.');
    }
  };

  const handleClearDemoData = async () => {
    if (confirm('Are you sure you want to clear demo history logs? This will reset past sample reviews, sessions, and streaks so you can track strictly real personal data.')) {
      await clearDemoData();
      alert('Demo data cleared! FocusForge is now operating strictly on real user data.');
    }
  };

  const handleResetAllData = async () => {
    if (confirm('WARNING: Are you sure you want to reset all data? This will clear all custom tasks, logs, and sessions, re-seeding clean routine templates.')) {
      await resetAllData();
      alert('All data reset to clean initial templates!');
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto overflow-y-auto max-h-[calc(100vh-4rem)] pb-20">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          Application Preferences & Data Management
          <Settings className="w-5 h-5 text-emerald-400" />
        </h1>
        <p className="text-xs text-zinc-400 font-medium mt-1">
          Configure study targets, theme preferences, and manage real user database storage
        </p>
      </div>

      {/* Target Setup Card */}
      <div className="glass-panel p-6 rounded-3xl border border-zinc-800/80 space-y-5">
        <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
          Daily Goal Configuration
          <Sparkles className="w-4 h-4 text-emerald-400" />
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800">
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Daily Planned Study Target</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="1"
                max="24"
                value={settings.studyTargetHours}
                onChange={(e) => updateUserSettings({ studyTargetHours: parseInt(e.target.value) || 12 })}
                className="w-24 px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-sm font-bold text-white text-center focus:outline-none focus:border-emerald-500"
              />
              <span className="text-xs text-zinc-400 font-medium">Hours / Day (Default 12 Hours)</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800">
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Sleep Target Goal</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                step="0.5"
                min="4"
                max="12"
                value={settings.sleepTargetHours}
                onChange={(e) => updateUserSettings({ sleepTargetHours: parseFloat(e.target.value) || 7.5 })}
                className="w-24 px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-sm font-bold text-white text-center focus:outline-none focus:border-emerald-500"
              />
              <span className="text-xs text-zinc-400 font-medium">Hours / Night (Default 7.5 Hours)</span>
            </div>
          </div>
        </div>
      </div>

      {/* PHASE 1 — Data Management Section */}
      <div className="glass-panel p-6 rounded-3xl border border-zinc-800/80 space-y-5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Real Data Management & Storage</h3>
            <p className="text-xs text-zinc-400 font-medium">Manage SQLite database state and switch to 100% real user mode</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleClearDemoData}
            className="p-4 rounded-2xl bg-amber-950/20 hover:bg-amber-950/40 border border-amber-500/40 flex items-center space-x-3 text-left transition-all group"
          >
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Clear Demo Data</span>
              <span className="text-[11px] text-zinc-400">Remove sample history logs to start tracking real personal metrics</span>
            </div>
          </button>

          <button
            onClick={handleResetAllData}
            className="p-4 rounded-2xl bg-red-950/20 hover:bg-red-950/40 border border-red-500/40 flex items-center space-x-3 text-left transition-all group"
          >
            <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 group-hover:scale-110 transition-transform">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Reset All Data</span>
              <span className="text-[11px] text-zinc-400">Wipe all tasks and logs, restoring clean 12h routine baseline</span>
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-zinc-800/80">
          <button
            onClick={handleExportExcel}
            className="p-4 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 flex flex-col items-center text-center space-y-2 group transition-all"
          >
            <FileSpreadsheet className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
            <div>
              <span className="text-xs font-bold text-white block">Export to Excel</span>
              <span className="text-[10px] text-zinc-500 font-medium">Download .xlsx spreadsheet</span>
            </div>
          </button>

          <button
            onClick={handleBackupSqlite}
            className="p-4 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 flex flex-col items-center text-center space-y-2 group transition-all"
          >
            <Download className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
            <div>
              <span className="text-xs font-bold text-white block">Backup SQLite Database</span>
              <span className="text-[10px] text-zinc-500 font-medium">Download binary .sqlite file</span>
            </div>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-4 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 flex flex-col items-center text-center space-y-2 group transition-all"
          >
            <Upload className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
            <div>
              <span className="text-xs font-bold text-white block">Import Backup</span>
              <span className="text-[10px] text-zinc-500 font-medium">Restore from .sqlite file</span>
            </div>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".sqlite,.db"
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};
