import initSqlJsModule, { Database, SqlJsStatic } from 'sql.js';
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url';

let dbInstance: Database | null = null;
let initPromise: Promise<Database> | null = null;
let wasmBinaryBuffer: ArrayBuffer | null = null;

const STORAGE_KEY = 'focusforge_sqlite_db';

async function getWasmBinary(): Promise<ArrayBuffer | null> {
  if (wasmBinaryBuffer) return wasmBinaryBuffer;
  try {
    const res = await fetch(sqlWasmUrl);
    if (res.ok) {
      wasmBinaryBuffer = await res.arrayBuffer();
      return wasmBinaryBuffer;
    }
  } catch (e) {
    console.warn('Local WASM buffer fetch failed, using locateFile fallback', e);
  }
  return null;
}

export async function getDatabase(): Promise<Database> {
  if (dbInstance) {
    return dbInstance;
  }
  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    try {
      const initSqlJs: SqlJsStatic = typeof initSqlJsModule === 'function'
        ? initSqlJsModule
        : (initSqlJsModule as any)?.default || (window as any).initSqlJs;

      if (!initSqlJs) {
        throw new Error('Failed to locate initSqlJs initialization function');
      }

      const wasmBinary = await getWasmBinary();
      const initConfig = wasmBinary
        ? { wasmBinary }
        : { locateFile: () => sqlWasmUrl };

      const SQL = await initSqlJs(initConfig);

      // Try loading saved DB binary from localStorage
      const savedDbBase64 = localStorage.getItem(STORAGE_KEY);
      if (savedDbBase64) {
        try {
          const binaryArray = Uint8Array.from(atob(savedDbBase64), (c) => c.charCodeAt(0));
          dbInstance = new SQL.Database(binaryArray);
        } catch (e) {
          console.warn('Failed to load existing SQLite database from local storage, initializing fresh database.', e);
          dbInstance = new SQL.Database();
        }
      } else {
        dbInstance = new SQL.Database();
      }

      // Initialize Schema
      initTables(dbInstance);
      saveDatabaseToDisk();

      return dbInstance;
    } catch (err) {
      console.error('Error during SQLite database initialization:', err);
      initPromise = null;
      throw err;
    }
  })();

  return initPromise;
}

export function saveDatabaseToDisk(): void {
  if (!dbInstance) return;
  try {
    const data = dbInstance.export();
    let binary = '';
    const bytes = new Uint8Array(data);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);
    localStorage.setItem(STORAGE_KEY, base64);
  } catch (err) {
    console.error('Error saving SQLite database to storage:', err);
  }
}

export function exportDatabaseBinary(): Uint8Array | null {
  if (!dbInstance) return null;
  return dbInstance.export();
}

export async function importDatabaseBinary(binaryArray: Uint8Array): Promise<boolean> {
  try {
    const initSqlJs: SqlJsStatic = typeof initSqlJsModule === 'function'
      ? initSqlJsModule
      : (initSqlJsModule as any)?.default || (window as any).initSqlJs;

    const wasmBinary = await getWasmBinary();
    const initConfig = wasmBinary
      ? { wasmBinary }
      : { locateFile: () => sqlWasmUrl };

    const SQL = await initSqlJs(initConfig);

    dbInstance = new SQL.Database(binaryArray);
    saveDatabaseToDisk();
    return true;
  } catch (e) {
    console.error('Failed to import database:', e);
    return false;
  }
}

function initTables(db: Database): void {
  db.run(`
    CREATE TABLE IF NOT EXISTS routines (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      is_active INTEGER DEFAULT 0,
      is_default INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS activities (
      id TEXT PRIMARY KEY,
      routine_id TEXT NOT NULL,
      title TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      category TEXT NOT NULL,
      color TEXT NOT NULL,
      position INTEGER DEFAULT 0,
      is_study_session INTEGER DEFAULT 0,
      planned_minutes INTEGER DEFAULT 0,
      FOREIGN KEY(routine_id) REFERENCES routines(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS habits (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      icon TEXT NOT NULL,
      target TEXT NOT NULL,
      frequency TEXT DEFAULT 'daily',
      notes TEXT,
      created_at TEXT NOT NULL,
      current_streak INTEGER DEFAULT 0,
      longest_streak INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS habit_logs (
      id TEXT PRIMARY KEY,
      habit_id TEXT NOT NULL,
      date TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      notes TEXT,
      FOREIGN KEY(habit_id) REFERENCES habits(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      due_date TEXT NOT NULL,
      priority TEXT NOT NULL,
      category TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      completed_at TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS study_sessions (
      id TEXT PRIMARY KEY,
      activity_id TEXT,
      activity_title TEXT NOT NULL,
      date TEXT NOT NULL,
      start_time TEXT,
      end_time TEXT,
      planned_minutes INTEGER NOT NULL,
      actual_minutes INTEGER NOT NULL,
      accuracy_pct REAL NOT NULL,
      notes TEXT,
      rating INTEGER DEFAULT 5,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS daily_reviews (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL UNIQUE,
      discipline_score REAL NOT NULL,
      study_accuracy REAL NOT NULL,
      habit_completion REAL NOT NULL,
      timetable_adherence REAL NOT NULL,
      sleep_consistency REAL NOT NULL,
      total_study_hours REAL NOT NULL,
      planned_study_hours REAL NOT NULL,
      completed_habits_count INTEGER NOT NULL,
      total_habits_count INTEGER NOT NULL,
      sleep_hours REAL NOT NULL,
      best_session TEXT,
      notes TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
}
