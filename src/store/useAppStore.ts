import { create } from 'zustand';
import {
  Routine,
  Activity,
  Habit,
  HabitLog,
  Task,
  StudySession,
  DailyReview,
  UserSettings,
} from '../types';
import {
  seedDefaultDataIfEmpty,
  getRoutines,
  setActiveRoutine,
  saveRoutine as dbSaveRoutine,
  deleteRoutine as dbDeleteRoutine,
  saveActivity as dbSaveActivity,
  deleteActivity as dbDeleteActivity,
  getHabits,
  saveHabit as dbSaveHabit,
  deleteHabit as dbDeleteHabit,
  getHabitLogsForDate,
  toggleHabitLog,
  getTasks,
  saveTask as dbSaveTask,
  toggleTaskCompleted as dbToggleTaskCompleted,
  deleteTask as dbDeleteTask,
  getStudySessions,
  saveStudySession,
  getDailyReviews,
  saveDailyReview as dbSaveDailyReview,
  clearDemoData as dbClearDemoData,
  resetAllData as dbResetAllData,
  getSettings,
  saveSettings as dbSaveSettings,
  DEFAULT_ROUTINE_ID,
} from '../db/repository';
import { getTodayDateString } from '../utils/time';

export type TabType =
  | 'dashboard'
  | 'timetable'
  | 'tasks'
  | 'habits'
  | 'timer'
  | 'analytics'
  | 'history'
  | 'routine_editor'
  | 'settings';

interface AppState {
  activeTab: TabType;
  routines: Routine[];
  activeRoutineId: string;
  habits: Habit[];
  todayHabitLogs: Record<string, boolean>;
  tasks: Task[];
  studySessions: StudySession[];
  dailyReviews: DailyReview[];
  settings: UserSettings;
  isInitialized: boolean;
  historyDate: string;

  // Timer State
  timerState: {
    isRunning: boolean;
    isPaused: boolean;
    elapsedSeconds: number;
    plannedMinutes: number;
    activityTitle: string;
    activityId?: string;
  };

  // UI Modals
  commandPaletteOpen: boolean;
  dailyReviewModalOpen: boolean;

  // Store Actions
  loadInitialData: () => Promise<void>;
  setActiveTab: (tab: TabType) => void;
  setHistoryDate: (date: string) => void;
  switchRoutine: (id: string) => Promise<void>;
  saveRoutine: (routine: Routine) => Promise<void>;
  removeRoutine: (id: string) => Promise<void>;
  updateActivity: (act: Activity) => Promise<void>;
  removeActivity: (id: string) => Promise<void>;

  // Habit Actions
  toggleHabitToday: (habitId: string, notes?: string) => Promise<void>;
  addHabit: (habit: Habit) => Promise<void>;
  removeHabit: (habitId: string) => Promise<void>;

  // Task Actions
  addTask: (task: Task) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  toggleTask: (taskId: string) => Promise<void>;
  removeTask: (taskId: string) => Promise<void>;

  // Timer & Session Actions
  addStudySession: (session: StudySession) => Promise<void>;
  recordDailyReview: (review: DailyReview) => Promise<void>;
  updateUserSettings: (newSettings: Partial<UserSettings>) => Promise<void>;

  // Data Management Actions
  clearDemoData: () => Promise<void>;
  resetAllData: () => Promise<void>;

  // Timer Controls
  startTimer: (title: string, plannedMins: number, activityId?: string) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  tickTimer: () => void;

  setCommandPaletteOpen: (open: boolean) => void;
  setDailyReviewModalOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  activeTab: 'dashboard',
  routines: [],
  activeRoutineId: DEFAULT_ROUTINE_ID,
  habits: [],
  todayHabitLogs: {},
  tasks: [],
  studySessions: [],
  dailyReviews: [],
  settings: {
    theme: 'obsidian',
    accentColor: 'emerald',
    studyTargetHours: 12,
    sleepTargetHours: 7.5,
    defaultRoutineId: DEFAULT_ROUTINE_ID,
    desktopNotifications: true,
    soundEnabled: true,
    isDemoData: false,
  },
  isInitialized: false,
  historyDate: getTodayDateString(),

  timerState: {
    isRunning: false,
    isPaused: false,
    elapsedSeconds: 0,
    plannedMinutes: 180,
    activityTitle: 'Study Session 1',
  },

  commandPaletteOpen: false,
  dailyReviewModalOpen: false,

  loadInitialData: async () => {
    try {
      await seedDefaultDataIfEmpty();
      const routines = await getRoutines();
      const habits = await getHabits();
      const tasks = await getTasks();
      const today = getTodayDateString();
      const logs = await getHabitLogsForDate(today);
      const studySessions = await getStudySessions();
      const dailyReviews = await getDailyReviews();
      const settings = await getSettings();

      const activeRoutine = routines.find((r) => r.isActive) || routines[0];
      const activeId = activeRoutine ? activeRoutine.id : DEFAULT_ROUTINE_ID;

      const logMap: Record<string, boolean> = {};
      logs.forEach((l) => {
        logMap[l.habitId] = l.completed;
      });

      set({
        routines,
        activeRoutineId: activeId,
        habits,
        todayHabitLogs: logMap,
        tasks,
        studySessions,
        dailyReviews,
        settings,
        isInitialized: true,
      });
    } catch (e) {
      console.error('Failed loading database into Zustand store:', e);
    }
  },

  setActiveTab: (tab: TabType) => set({ activeTab: tab }),
  setHistoryDate: (date: string) => set({ historyDate: date }),

  switchRoutine: async (id: string) => {
    await setActiveRoutine(id);
    const routines = await getRoutines();
    set({ routines, activeRoutineId: id });
  },

  saveRoutine: async (routine: Routine) => {
    await dbSaveRoutine(routine);
    for (const act of routine.activities) {
      await dbSaveActivity(act);
    }
    const routines = await getRoutines();
    set({ routines });
  },

  removeRoutine: async (id: string) => {
    await dbDeleteRoutine(id);
    const routines = await getRoutines();
    set({ routines });
  },

  updateActivity: async (act: Activity) => {
    await dbSaveActivity(act);
    const routines = await getRoutines();
    set({ routines });
  },

  removeActivity: async (id: string) => {
    await dbDeleteActivity(id);
    const routines = await getRoutines();
    set({ routines });
  },

  // Habit Actions
  toggleHabitToday: async (habitId: string, notes?: string) => {
    const today = getTodayDateString();
    const currentStatus = !!get().todayHabitLogs[habitId];
    const newStatus = !currentStatus;

    await toggleHabitLog(habitId, today, newStatus, notes);
    const updatedHabits = await getHabits();

    set((state) => ({
      habits: updatedHabits,
      todayHabitLogs: {
        ...state.todayHabitLogs,
        [habitId]: newStatus,
      },
    }));
  },

  addHabit: async (habit: Habit) => {
    await dbSaveHabit(habit);
    const habits = await getHabits();
    set({ habits });
  },

  removeHabit: async (habitId: string) => {
    await dbDeleteHabit(habitId);
    const habits = await getHabits();
    set({ habits });
  },

  // Task Actions
  addTask: async (task: Task) => {
    await dbSaveTask(task);
    const tasks = await getTasks();
    set({ tasks });
  },

  updateTask: async (task: Task) => {
    await dbSaveTask(task);
    const tasks = await getTasks();
    set({ tasks });
  },

  toggleTask: async (taskId: string) => {
    const task = get().tasks.find((t) => t.id === taskId);
    if (!task) return;
    const newStatus = !task.completed;
    await dbToggleTaskCompleted(taskId, newStatus);
    const tasks = await getTasks();
    set({ tasks });
  },

  removeTask: async (taskId: string) => {
    await dbDeleteTask(taskId);
    const tasks = await getTasks();
    set({ tasks });
  },

  // Study Sessions & Reviews
  addStudySession: async (session: StudySession) => {
    await saveStudySession(session);
    const studySessions = await getStudySessions();
    set({ studySessions });
  },

  recordDailyReview: async (review: DailyReview) => {
    await dbSaveDailyReview(review);
    const dailyReviews = await getDailyReviews();
    set({ dailyReviews });
  },

  updateUserSettings: async (newSettings: Partial<UserSettings>) => {
    await dbSaveSettings(newSettings);
    const settings = await getSettings();
    set({ settings });
  },

  // Data Management
  clearDemoData: async () => {
    await dbClearDemoData();
    const habits = await getHabits();
    const studySessions = await getStudySessions();
    const dailyReviews = await getDailyReviews();
    const today = getTodayDateString();
    const logs = await getHabitLogsForDate(today);

    const logMap: Record<string, boolean> = {};
    logs.forEach((l) => {
      logMap[l.habitId] = l.completed;
    });

    set({
      habits,
      studySessions,
      dailyReviews,
      todayHabitLogs: logMap,
    });
  },

  resetAllData: async () => {
    await dbResetAllData();
    await get().loadInitialData();
  },

  // Timer Controls
  startTimer: (title: string, plannedMins: number, activityId?: string) => {
    set({
      timerState: {
        isRunning: true,
        isPaused: false,
        elapsedSeconds: 0,
        plannedMinutes: plannedMins,
        activityTitle: title,
        activityId,
      },
    });
  },

  pauseTimer: () => {
    set((state) => ({
      timerState: { ...state.timerState, isPaused: true, isRunning: false },
    }));
  },

  resumeTimer: () => {
    set((state) => ({
      timerState: { ...state.timerState, isPaused: false, isRunning: true },
    }));
  },

  resetTimer: () => {
    set({
      timerState: {
        isRunning: false,
        isPaused: false,
        elapsedSeconds: 0,
        plannedMinutes: 180,
        activityTitle: 'Study Session 1',
      },
    });
  },

  tickTimer: () => {
    const { timerState } = get();
    if (timerState.isRunning && !timerState.isPaused) {
      set({
        timerState: {
          ...timerState,
          elapsedSeconds: timerState.elapsedSeconds + 1,
        },
      });
    }
  },

  setCommandPaletteOpen: (open: boolean) => set({ commandPaletteOpen: open }),
  setDailyReviewModalOpen: (open: boolean) => set({ dailyReviewModalOpen: open }),
}));
