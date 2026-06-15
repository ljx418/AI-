import { openDB } from 'idb';

const DB_NAME = 'ai-courseware-db';
const DB_VERSION = 1;

const STORES = {
  PROGRESS: 'progress',
  QUIZZES: 'quizzes',
  CODE: 'code',
  SETTINGS: 'settings',
};

// Initialize the database
async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Progress store for tracking lesson completion
      if (!db.objectStoreNames.contains(STORES.PROGRESS)) {
        const progressStore = db.createObjectStore(STORES.PROGRESS, { keyPath: 'lessonId' });
        progressStore.createIndex('week', 'week');
        progressStore.createIndex('completedAt', 'completedAt');
      }

      // Quiz results store
      if (!db.objectStoreNames.contains(STORES.QUIZZES)) {
        const quizStore = db.createObjectStore(STORES.QUIZZES, { keyPath: 'id', autoIncrement: true });
        quizStore.createIndex('lessonId', 'lessonId');
        quizStore.createIndex('takenAt', 'takenAt');
      }

      // Code snippets store
      if (!db.objectStoreNames.contains(STORES.CODE)) {
        const codeStore = db.createObjectStore(STORES.CODE, { keyPath: 'lessonId' });
        codeStore.createIndex('updatedAt', 'updatedAt');
      }

      // Settings store
      if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
        db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
      }
    },
  });
}

// Progress operations
export const progressDB = {
  async saveProgress(lessonId, week, data) {
    const db = await initDB();
    await db.put(STORES.PROGRESS, {
      lessonId,
      week,
      ...data,
      completedAt: new Date().toISOString(),
    });
  },

  async getProgress(lessonId) {
    const db = await initDB();
    return db.get(STORES.PROGRESS, lessonId);
  },

  async getAllProgress() {
    const db = await initDB();
    return db.getAll(STORES.PROGRESS);
  },

  async getWeekProgress(week) {
    const db = await initDB();
    return db.getAllFromIndex(STORES.PROGRESS, 'week', week);
  },

  async deleteProgress(lessonId) {
    const db = await initDB();
    await db.delete(STORES.PROGRESS, lessonId);
  },
};

// Quiz operations
export const quizDB = {
  async saveQuizResult(lessonId, score, answers, timeSpent) {
    const db = await initDB();
    return db.add(STORES.QUIZZES, {
      lessonId,
      score,
      answers,
      timeSpent,
      takenAt: new Date().toISOString(),
    });
  },

  async getQuizResults(lessonId) {
    const db = await initDB();
    return db.getAllFromIndex(STORES.QUIZZES, 'lessonId', lessonId);
  },

  async getAllQuizResults() {
    const db = await initDB();
    return db.getAll(STORES.QUIZZES);
  },

  async getRecentQuizzes(limit = 10) {
    const db = await initDB();
    const all = await db.getAll(STORES.QUIZZES);
    return all
      .sort((a, b) => new Date(b.takenAt) - new Date(a.takenAt))
      .slice(0, limit);
  },
};

// Code operations
export const codeDB = {
  async saveCode(lessonId, code) {
    const db = await initDB();
    await db.put(STORES.CODE, {
      lessonId,
      code,
      updatedAt: new Date().toISOString(),
    });
  },

  async getCode(lessonId) {
    const db = await initDB();
    const result = await db.get(STORES.CODE, lessonId);
    return result?.code;
  },

  async getAllCode() {
    const db = await initDB();
    return db.getAll(STORES.CODE);
  },
};

// Settings operations
export const settingsDB = {
  async set(key, value) {
    const db = await initDB();
    await db.put(STORES.SETTINGS, { key, value });
  },

  async get(key) {
    const db = await initDB();
    const result = await db.get(STORES.SETTINGS, key);
    return result?.value;
  },

  async getAll() {
    const db = await initDB();
    return db.getAll(STORES.SETTINGS);
  },
};

// Utility function to calculate overall progress
export async function calculateOverallProgress() {
  const progress = await progressDB.getAllProgress();
  const totalLessons = 24;
  const completedLessons = progress.length;
  return {
    completed: completedLessons,
    total: totalLessons,
    percentage: Math.round((completedLessons / totalLessons) * 100),
  };
}

// Utility function to calculate week-wise progress
export async function calculateWeekProgress() {
  const progress = await progressDB.getAllProgress();
  const weeks = {
    'Week 1-2': { completed: 0, total: 4 },
    'Week 3-4': { completed: 0, total: 4 },
    'Week 5-6': { completed: 0, total: 4 },
    'Week 7-8': { completed: 0, total: 4 },
    'Week 9-10': { completed: 0, total: 4 },
    'Week 11-12': { completed: 0, total: 4 },
  };

  progress.forEach((p) => {
    if (weeks[p.week]) {
      weeks[p.week].completed++;
    }
  });

  return weeks;
}