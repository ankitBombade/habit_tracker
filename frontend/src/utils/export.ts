import * as XLSX from 'xlsx';
import { DailyReview, Habit, StudySession } from '../types';
import { exportDatabaseBinary, importDatabaseBinary, getDatabase } from '../db/sqlite';

export function exportDataToExcel(reviews: DailyReview[], habits: Habit[], sessions: StudySession[]) {
  const wb = XLSX.utils.book_new();

  // Daily Reviews Sheet
  const reviewsData = reviews.map((r) => ({
    Date: r.date,
    'Discipline Score (%)': r.disciplineScore,
    'Study Accuracy (%)': r.studyAccuracy,
    'Habit Completion (%)': r.habitCompletion,
    'Timetable Adherence (%)': r.timetableAdherence,
    'Sleep Consistency (%)': r.sleepConsistency,
    'Total Study Hours': r.totalStudyHours,
    'Planned Study Hours': r.plannedStudyHours,
    'Sleep Hours': r.sleepHours,
    Notes: r.notes || '',
  }));
  const wsReviews = XLSX.utils.json_to_sheet(reviewsData);
  XLSX.utils.book_append_sheet(wb, wsReviews, 'Daily Reviews');

  // Study Sessions Sheet
  const sessionsData = sessions.map((s) => ({
    Date: s.date,
    Session: s.activityTitle,
    'Planned (Mins)': s.plannedMinutes,
    'Actual (Mins)': s.actualMinutes,
    'Accuracy (%)': s.accuracyPct,
    Rating: s.rating || 5,
    Notes: s.notes || '',
  }));
  const wsSessions = XLSX.utils.json_to_sheet(sessionsData);
  XLSX.utils.book_append_sheet(wb, wsSessions, 'Study Sessions');

  // Habits Sheet
  const habitsData = habits.map((h) => ({
    Habit: h.name,
    Category: h.category,
    Target: h.target,
    'Current Streak': h.currentStreak,
    'Longest Streak': h.longestStreak,
    Notes: h.notes || '',
  }));
  const wsHabits = XLSX.utils.json_to_sheet(habitsData);
  XLSX.utils.book_append_sheet(wb, wsHabits, 'Habits');

  // Generate file & trigger download
  XLSX.writeFile(wb, `FocusForge_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
}

export function downloadSqliteBackup() {
  const binary = exportDatabaseBinary();
  if (!binary) return;
  const blob = new Blob([binary], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `focusforge_backup_${new Date().toISOString().split('T')[0]}.sqlite`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function uploadSqliteBackup(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      if (e.target?.result) {
        const arrayBuffer = e.target.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        const success = await importDatabaseBinary(uint8Array);
        resolve(success);
      } else {
        resolve(false);
      }
    };
    reader.onerror = () => resolve(false);
    reader.readAsArrayBuffer(file);
  });
}
