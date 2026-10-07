export type HabitCategory = 'Study' | 'Health' | 'Fitness' | 'Morning' | 'Night' | 'Personal';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Habit {
  id: string;
  name: string;
  category: HabitCategory;
  icon: string;
  target: string;
  frequency?: 'daily' | 'weekdays' | 'weekends' | 'custom';
  notes?: string;
  createdAt: string;
  currentStreak: number;
  longestStreak: number;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  notes?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string; // YYYY-MM-DD
  priority: TaskPriority;
  category: string;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  routineId: string;
  title: string;
  startTime: string; // "08:00"
  endTime: string;   // "09:00"
  category: 'Study' | 'Break' | 'Routine' | 'Exercise' | 'Sleep';
  color: string;     // Hex color
  position: number;
  isStudySession?: boolean;
  plannedMinutes?: number;
}

export interface Routine {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
  activities: Activity[];
}

export interface StudySession {
  id: string;
  activityId?: string;
  activityTitle: string;
  date: string; // YYYY-MM-DD
  startTime?: string;
  endTime?: string;
  plannedMinutes: number;
  actualMinutes: number;
  accuracyPct: number;
  notes?: string;
  rating?: number;
  createdAt: string;
}

export interface DailyReview {
  id: string;
  date: string; // YYYY-MM-DD
  disciplineScore: number;
  studyAccuracy: number;
  habitCompletion: number;
  timetableAdherence: number;
  sleepConsistency: number;
  totalStudyHours: number;
  plannedStudyHours: number;
  completedHabitsCount: number;
  totalHabitsCount: number;
  sleepHours: number;
  bestSession?: string;
  notes?: string;
  createdAt: string;
}

export interface UserSettings {
  theme: 'obsidian' | 'glass' | 'neon';
  accentColor: 'emerald' | 'purple' | 'orange' | 'cyan';
  studyTargetHours: number;
  sleepTargetHours: number;
  defaultRoutineId: string;
  desktopNotifications: boolean;
  soundEnabled: boolean;
  isDemoData: boolean;
}

export interface DateHistoryDetails {
  date: string;
  habits: { habit: Habit; completed: boolean }[];
  tasks: Task[];
  sessions: StudySession[];
  totalStudyHours: number;
  plannedStudyHours: number;
  studyAccuracy: number;
  habitCompletionPct: number;
  taskCompletionPct: number;
  disciplineScore: number;
}
