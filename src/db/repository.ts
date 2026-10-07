import { getDatabase, saveDatabaseToDisk } from './sqlite';
import { Routine, Activity, Habit, HabitLog, Task, StudySession, DailyReview, UserSettings } from '../types';

export const DEFAULT_ROUTINE_ID = 'routine_normal_study';

export async function seedDefaultDataIfEmpty() {
  const db = await getDatabase();
  
  // Check if routines exist
  const res = db.exec('SELECT COUNT(*) as cnt FROM routines');
  const count = res.length > 0 && res[0].values.length > 0 ? (res[0].values[0][0] as number) : 0;

  if (count === 0) {
    console.log('Seeding default routines, habits, tasks, and settings into SQLite database...');
    const now = new Date().toISOString();

    // 1. Normal Study Day Routine (Default 12 Hours)
    db.run(
      `INSERT INTO routines (id, name, description, is_active, is_default, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
      [DEFAULT_ROUTINE_ID, '12 Hour Study Routine', 'Default 12-hour high performance study routine', 1, 1, now]
    );

    const normalActivities = [
      { id: 'act_1', title: 'Wake Up & Hydrate', startTime: '08:00', endTime: '08:00', category: 'Routine', color: '#10B981', position: 0, isStudy: 0, plannedMins: 0 },
      { id: 'act_2', title: 'Shower, Exercise & Heavy Breakfast', startTime: '08:00', endTime: '09:00', category: 'Exercise', color: '#F97316', position: 1, isStudy: 0, plannedMins: 60 },
      { id: 'act_3', title: 'Study Session 1 (Core Theory)', startTime: '09:00', endTime: '12:00', category: 'Study', color: '#8B5CF6', position: 2, isStudy: 1, plannedMins: 180 },
      { id: 'act_4', title: 'Lunch & Power Nap', startTime: '12:00', endTime: '14:00', category: 'Break', color: '#059669', position: 3, isStudy: 0, plannedMins: 120 },
      { id: 'act_5', title: 'Study Session 2 (Problem Solving)', startTime: '14:00', endTime: '18:00', category: 'Study', color: '#8B5CF6', position: 4, isStudy: 1, plannedMins: 240 },
      { id: 'act_6', title: 'Walk, Friends, Phone & Dinner', startTime: '18:00', endTime: '20:00', category: 'Break', color: '#3B82F6', position: 5, isStudy: 0, plannedMins: 120 },
      { id: 'act_7', title: 'Study Session 3 (Revision & Practice)', startTime: '20:00', endTime: '23:00', category: 'Study', color: '#8B5CF6', position: 6, isStudy: 1, plannedMins: 180 },
      { id: 'act_8', title: 'Night Refreshment & Wind Down', startTime: '23:00', endTime: '23:30', category: 'Break', color: '#059669', position: 7, isStudy: 0, plannedMins: 30 },
      { id: 'act_9', title: 'Study Session 4 (Late Focus & Recap)', startTime: '23:30', endTime: '01:30', category: 'Study', color: '#8B5CF6', position: 8, isStudy: 1, plannedMins: 120 },
      { id: 'act_10', title: 'Sleep & Recovery', startTime: '01:30', endTime: '08:00', category: 'Sleep', color: '#6366F1', position: 9, isStudy: 0, plannedMins: 390 },
    ];

    for (const act of normalActivities) {
      db.run(
        `INSERT INTO activities (id, routine_id, title, start_time, end_time, category, color, position, is_study_session, planned_minutes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [act.id, DEFAULT_ROUTINE_ID, act.title, act.startTime, act.endTime, act.category, act.color, act.position, act.isStudy, act.plannedMins]
      );
    }

    // 2. Exam Day Routine
    db.run(
      `INSERT INTO routines (id, name, description, is_active, is_default, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
      ['routine_exam', 'Exam Day Routine', 'Intensive revision and mock tests prep', 0, 0, now]
    );

    // 3. College Day Routine
    db.run(
      `INSERT INTO routines (id, name, description, is_active, is_default, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
      ['routine_college', 'College Day Routine', 'Balanced study routine for lecture days', 0, 0, now]
    );

    // 4. Weekend Routine
    db.run(
      `INSERT INTO routines (id, name, description, is_active, is_default, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
      ['routine_weekend', 'Weekend Routine', 'Self-paced project building & recovery', 0, 0, now]
    );

    // Default Habit Templates
    const defaultHabits = [
      { id: 'h_1', name: '30-Min Workout / Cardio', category: 'Fitness', icon: 'Dumbbell', target: '30 mins daily', frequency: 'daily', notes: 'Maintain physical fitness' },
      { id: 'h_2', name: '12-Hour Study Target', category: 'Study', icon: 'BookOpen', target: '12 Hours', frequency: 'daily', notes: 'Hit daily study goal' },
      { id: 'h_3', name: 'Drink 3L Water', category: 'Health', icon: 'Droplets', target: '3 Liters', frequency: 'daily', notes: 'Stay hydrated' },
      { id: 'h_4', name: 'Cold Shower at 8 AM', category: 'Morning', icon: 'Sun', target: 'Daily', frequency: 'daily', notes: 'Fresh start' },
      { id: 'h_5', name: 'Night Journaling & Review', category: 'Night', icon: 'Moon', target: '15 mins', frequency: 'daily', notes: 'Reflect on progress' },
    ];

    for (const h of defaultHabits) {
      db.run(
        `INSERT INTO habits (id, name, category, icon, target, frequency, notes, created_at, current_streak, longest_streak) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [h.id, h.name, h.category, h.icon, h.target, h.frequency, h.notes, now, 0, 0]
      );
    }

    // Default Tasks
    const todayStr = new Date().toISOString().split('T')[0];
    const defaultTasks: Task[] = [
      { id: 't_1', title: 'Complete Chapter 4 Problem Set', description: 'Solve all odd numbered problems', dueDate: todayStr, priority: 'urgent', category: 'Study', completed: false, createdAt: now },
      { id: 't_2', title: 'Review Weekly Study Heatmap', description: 'Analyze performance trends', dueDate: todayStr, priority: 'high', category: 'Personal', completed: false, createdAt: now },
      { id: 't_3', title: 'Prepare Notes for Tomorrow', description: 'Organize study materials for Session 1', dueDate: todayStr, priority: 'medium', category: 'Study', completed: false, createdAt: now },
    ];

    for (const t of defaultTasks) {
      db.run(
        `INSERT INTO tasks (id, title, description, due_date, priority, category, completed, completed_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [t.id, t.title, t.description || '', t.dueDate, t.priority, t.category, t.completed ? 1 : 0, t.completedAt || null, t.createdAt]
      );
    }

    // Default settings
    const defaultSettings: UserSettings = {
      theme: 'obsidian',
      accentColor: 'emerald',
      studyTargetHours: 12,
      sleepTargetHours: 7.5,
      defaultRoutineId: DEFAULT_ROUTINE_ID,
      desktopNotifications: true,
      soundEnabled: true,
      isDemoData: false,
    };

    for (const [k, v] of Object.entries(defaultSettings)) {
      db.run(`INSERT INTO settings (key, value) VALUES (?, ?)`, [k, JSON.stringify(v)]);
    }

    saveDatabaseToDisk();
  }
}

// ----------------------------------------------------
// Routines & Activities Queries
// ----------------------------------------------------
export async function getRoutines(): Promise<Routine[]> {
  const db = await getDatabase();
  const res = db.exec('SELECT * FROM routines ORDER BY created_at ASC');
  if (res.length === 0) return [];

  const routines: Routine[] = [];
  for (const row of res[0].values) {
    const routineId = row[0] as string;
    const activities = await getActivitiesByRoutineId(routineId);
    routines.push({
      id: routineId,
      name: row[1] as string,
      description: row[2] as string,
      isActive: (row[3] as number) === 1,
      isDefault: (row[4] as number) === 1,
      createdAt: row[5] as string,
      activities,
    });
  }
  return routines;
}

export async function getActivitiesByRoutineId(routineId: string): Promise<Activity[]> {
  const db = await getDatabase();
  const res = db.exec('SELECT * FROM activities WHERE routine_id = ? ORDER BY position ASC, start_time ASC', [routineId]);
  if (res.length === 0) return [];

  return res[0].values.map((row) => ({
    id: row[0] as string,
    routineId: row[1] as string,
    title: row[2] as string,
    startTime: row[3] as string,
    endTime: row[4] as string,
    category: row[5] as Activity['category'],
    color: row[6] as string,
    position: row[7] as number,
    isStudySession: (row[8] as number) === 1,
    plannedMinutes: row[9] as number,
  }));
}

export async function setActiveRoutine(routineId: string): Promise<void> {
  const db = await getDatabase();
  db.run('UPDATE routines SET is_active = 0');
  db.run('UPDATE routines SET is_active = 1 WHERE id = ?', [routineId]);
  saveDatabaseToDisk();
}

export async function saveRoutine(routine: Routine): Promise<void> {
  const db = await getDatabase();
  db.run(
    `INSERT OR REPLACE INTO routines (id, name, description, is_active, is_default, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
    [routine.id, routine.name, routine.description, routine.isActive ? 1 : 0, routine.isDefault ? 1 : 0, routine.createdAt]
  );
  saveDatabaseToDisk();
}

export async function deleteRoutine(routineId: string): Promise<void> {
  const db = await getDatabase();
  db.run('DELETE FROM activities WHERE routine_id = ?', [routineId]);
  db.run('DELETE FROM routines WHERE id = ?', [routineId]);
  saveDatabaseToDisk();
}

export async function saveActivity(act: Activity): Promise<void> {
  const db = await getDatabase();
  db.run(
    `INSERT OR REPLACE INTO activities (id, routine_id, title, start_time, end_time, category, color, position, is_study_session, planned_minutes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [act.id, act.routineId, act.title, act.startTime, act.endTime, act.category, act.color, act.position, act.isStudySession ? 1 : 0, act.plannedMinutes || 0]
  );
  saveDatabaseToDisk();
}

export async function deleteActivity(id: string): Promise<void> {
  const db = await getDatabase();
  db.run('DELETE FROM activities WHERE id = ?', [id]);
  saveDatabaseToDisk();
}

// ----------------------------------------------------
// Tasks Repository Queries
// ----------------------------------------------------
export async function getTasks(): Promise<Task[]> {
  const db = await getDatabase();
  const res = db.exec('SELECT * FROM tasks ORDER BY due_date ASC, priority DESC');
  if (res.length === 0) return [];

  return res[0].values.map((row) => ({
    id: row[0] as string,
    title: row[1] as string,
    description: row[2] as string,
    dueDate: row[3] as string,
    priority: row[4] as Task['priority'],
    category: row[5] as string,
    completed: (row[6] as number) === 1,
    completedAt: row[7] as string,
    createdAt: row[8] as string,
  }));
}

export async function saveTask(task: Task): Promise<void> {
  const db = await getDatabase();
  db.run(
    `INSERT OR REPLACE INTO tasks (id, title, description, due_date, priority, category, completed, completed_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [task.id, task.title, task.description || '', task.dueDate, task.priority, task.category, task.completed ? 1 : 0, task.completedAt || null, task.createdAt]
  );
  saveDatabaseToDisk();
}

export async function toggleTaskCompleted(taskId: string, completed: boolean): Promise<void> {
  const db = await getDatabase();
  const now = new Date().toISOString();
  db.run(
    `UPDATE tasks SET completed = ?, completed_at = ? WHERE id = ?`,
    [completed ? 1 : 0, completed ? now : null, taskId]
  );
  saveDatabaseToDisk();
}

export async function deleteTask(taskId: string): Promise<void> {
  const db = await getDatabase();
  db.run('DELETE FROM tasks WHERE id = ?', [taskId]);
  saveDatabaseToDisk();
}

// ----------------------------------------------------
// Habits Repository Queries
// ----------------------------------------------------
export async function getHabits(): Promise<Habit[]> {
  const db = await getDatabase();
  const res = db.exec('SELECT * FROM habits ORDER BY created_at ASC');
  if (res.length === 0) return [];

  const habits: Habit[] = [];
  for (const row of res[0].values) {
    const habitId = row[0] as string;
    const streaks = await recalculateHabitStreak(db, habitId);
    habits.push({
      id: habitId,
      name: row[1] as string,
      category: row[2] as Habit['category'],
      icon: row[3] as string,
      target: row[4] as string,
      frequency: (row[5] as Habit['frequency']) || 'daily',
      notes: row[6] as string,
      createdAt: row[7] as string,
      currentStreak: streaks.currentStreak,
      longestStreak: streaks.longestStreak,
    });
  }
  return habits;
}

export async function saveHabit(habit: Habit): Promise<void> {
  const db = await getDatabase();
  db.run(
    `INSERT OR REPLACE INTO habits (id, name, category, icon, target, frequency, notes, created_at, current_streak, longest_streak) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [habit.id, habit.name, habit.category, habit.icon, habit.target, habit.frequency || 'daily', habit.notes || '', habit.createdAt, habit.currentStreak, habit.longestStreak]
  );
  saveDatabaseToDisk();
}

export async function deleteHabit(habitId: string): Promise<void> {
  const db = await getDatabase();
  db.run('DELETE FROM habit_logs WHERE habit_id = ?', [habitId]);
  db.run('DELETE FROM habits WHERE id = ?', [habitId]);
  saveDatabaseToDisk();
}

export async function getHabitLogsForDate(dateStr: string): Promise<HabitLog[]> {
  const db = await getDatabase();
  const res = db.exec('SELECT * FROM habit_logs WHERE date = ?', [dateStr]);
  if (res.length === 0) return [];

  return res[0].values.map((row) => ({
    id: row[0] as string,
    habitId: row[1] as string,
    date: row[2] as string,
    completed: (row[3] as number) === 1,
    notes: row[4] as string,
  }));
}

export async function getAllHabitLogs(): Promise<HabitLog[]> {
  const db = await getDatabase();
  const res = db.exec('SELECT * FROM habit_logs ORDER BY date DESC');
  if (res.length === 0) return [];

  return res[0].values.map((row) => ({
    id: row[0] as string,
    habitId: row[1] as string,
    date: row[2] as string,
    completed: (row[3] as number) === 1,
    notes: row[4] as string,
  }));
}

export async function toggleHabitLog(habitId: string, dateStr: string, completed: boolean, notes?: string): Promise<void> {
  const db = await getDatabase();
  const logId = `hl_${habitId}_${dateStr}`;
  db.run(
    `INSERT OR REPLACE INTO habit_logs (id, habit_id, date, completed, notes) VALUES (?, ?, ?, ?, ?)`,
    [logId, habitId, dateStr, completed ? 1 : 0, notes || '']
  );

  await recalculateHabitStreak(db, habitId);
  saveDatabaseToDisk();
}

async function recalculateHabitStreak(db: any, habitId: string): Promise<{ currentStreak: number; longestStreak: number }> {
  const res = db.exec('SELECT date, completed FROM habit_logs WHERE habit_id = ? AND completed = 1 ORDER BY date DESC', [habitId]);
  if (res.length === 0 || res[0].values.length === 0) {
    db.run('UPDATE habits SET current_streak = 0 WHERE id = ?', [habitId]);
    return { currentStreak: 0, longestStreak: 0 };
  }

  const completedDatesSet = new Set(res[0].values.map((r: any[]) => r[0] as string));

  const todayStr = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  let currentStreak = 0;
  let startDate = completedDatesSet.has(todayStr) ? new Date(todayStr) : completedDatesSet.has(yesterdayStr) ? new Date(yesterdayStr) : null;

  if (startDate) {
    const cur = new Date(startDate);
    while (true) {
      const dStr = cur.toISOString().split('T')[0];
      if (completedDatesSet.has(dStr)) {
        currentStreak++;
        cur.setDate(cur.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Calculate longest streak across all recorded history
  const sortedDates = Array.from(completedDatesSet).sort();
  let longestStreak = 0;
  let tempStreak = 0;
  let prevDate: Date | null = null;

  for (const dStr of sortedDates) {
    const d = new Date(dStr);
    if (!prevDate) {
      tempStreak = 1;
    } else {
      const diffTime = Math.abs(d.getTime() - prevDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    }
    if (tempStreak > longestStreak) longestStreak = tempStreak;
    prevDate = d;
  }

  db.run('UPDATE habits SET current_streak = ?, longest_streak = MAX(longest_streak, ?) WHERE id = ?', [
    currentStreak,
    longestStreak,
    habitId,
  ]);

  return { currentStreak, longestStreak };
}

// ----------------------------------------------------
// Study Sessions & Daily Reviews Queries
// ----------------------------------------------------
export async function getStudySessions(startDate?: string, endDate?: string): Promise<StudySession[]> {
  const db = await getDatabase();
  let query = 'SELECT * FROM study_sessions';
  const params: any[] = [];

  if (startDate && endDate) {
    query += ' WHERE date >= ? AND date <= ?';
    params.push(startDate, endDate);
  }
  query += ' ORDER BY created_at DESC';

  const res = db.exec(query, params);
  if (res.length === 0) return [];

  return res[0].values.map((row) => ({
    id: row[0] as string,
    activityId: row[1] as string,
    activityTitle: row[2] as string,
    date: row[3] as string,
    startTime: row[4] as string,
    endTime: row[5] as string,
    plannedMinutes: row[6] as number,
    actualMinutes: row[7] as number,
    accuracyPct: row[8] as number,
    notes: row[9] as string,
    rating: row[10] as number,
    createdAt: row[11] as string,
  }));
}

export async function saveStudySession(session: StudySession): Promise<void> {
  const db = await getDatabase();
  db.run(
    `INSERT OR REPLACE INTO study_sessions (id, activity_id, activity_title, date, start_time, end_time, planned_minutes, actual_minutes, accuracy_pct, notes, rating, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      session.id,
      session.activityId || '',
      session.activityTitle,
      session.date,
      session.startTime || '',
      session.endTime || '',
      session.plannedMinutes,
      session.actualMinutes,
      session.accuracyPct,
      session.notes || '',
      session.rating || 5,
      session.createdAt,
    ]
  );
  saveDatabaseToDisk();
}

export async function getDailyReviews(): Promise<DailyReview[]> {
  const db = await getDatabase();
  const res = db.exec('SELECT * FROM daily_reviews ORDER BY date DESC');
  if (res.length === 0) return [];

  return res[0].values.map((row) => ({
    id: row[0] as string,
    date: row[1] as string,
    disciplineScore: row[2] as number,
    studyAccuracy: row[3] as number,
    habitCompletion: row[4] as number,
    timetableAdherence: row[5] as number,
    sleepConsistency: row[6] as number,
    totalStudyHours: row[7] as number,
    plannedStudyHours: row[8] as number,
    completedHabitsCount: row[9] as number,
    totalHabitsCount: row[10] as number,
    sleepHours: row[11] as number,
    bestSession: row[12] as string,
    notes: row[13] as string,
    createdAt: row[14] as string,
  }));
}

export async function saveDailyReview(review: DailyReview): Promise<void> {
  const db = await getDatabase();
  db.run(
    `INSERT OR REPLACE INTO daily_reviews (id, date, discipline_score, study_accuracy, habit_completion, timetable_adherence, sleep_consistency, total_study_hours, planned_study_hours, completed_habits_count, total_habits_count, sleep_hours, best_session, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      review.id,
      review.date,
      review.disciplineScore,
      review.studyAccuracy,
      review.habitCompletion,
      review.timetableAdherence,
      review.sleepConsistency,
      review.totalStudyHours,
      review.plannedStudyHours,
      review.completedHabitsCount,
      review.totalHabitsCount,
      review.sleepHours,
      review.bestSession || '',
      review.notes || '',
      review.createdAt,
    ]
  );
  saveDatabaseToDisk();
}

// ----------------------------------------------------
// Data Management & Clearing
// ----------------------------------------------------
export async function clearDemoData(): Promise<void> {
  const db = await getDatabase();
  db.run('DELETE FROM daily_reviews');
  db.run('DELETE FROM study_sessions');
  db.run('DELETE FROM habit_logs');
  db.run('UPDATE habits SET current_streak = 0, longest_streak = 0');
  db.run(`INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`, ['isDemoData', JSON.stringify(false)]);
  saveDatabaseToDisk();
}

export async function resetAllData(): Promise<void> {
  const db = await getDatabase();
  db.run('DELETE FROM daily_reviews');
  db.run('DELETE FROM study_sessions');
  db.run('DELETE FROM habit_logs');
  db.run('DELETE FROM tasks');
  db.run('DELETE FROM habits');
  db.run('DELETE FROM activities');
  db.run('DELETE FROM routines');

  // Re-seed clean defaults
  await seedDefaultDataIfEmpty();
}

export async function getSettings(): Promise<UserSettings> {
  const db = await getDatabase();
  const res = db.exec('SELECT key, value FROM settings');
  const settingsObj: any = {
    theme: 'obsidian',
    accentColor: 'emerald',
    studyTargetHours: 12,
    sleepTargetHours: 7.5,
    defaultRoutineId: DEFAULT_ROUTINE_ID,
    desktopNotifications: true,
    soundEnabled: true,
    isDemoData: false,
  };

  if (res.length > 0) {
    for (const row of res[0].values) {
      const k = row[0] as string;
      try {
        settingsObj[k] = JSON.parse(row[1] as string);
      } catch (e) {
        settingsObj[k] = row[1];
      }
    }
  }
  return settingsObj;
}

export async function saveSettings(settings: Partial<UserSettings>): Promise<void> {
  const db = await getDatabase();
  for (const [k, v] of Object.entries(settings)) {
    db.run(`INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`, [k, JSON.stringify(v)]);
  }
  saveDatabaseToDisk();
}
