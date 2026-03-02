/**
 * Learning progress helpers — localStorage-based for now.
 * Can be migrated to Supabase later.
 */

import type {
  AllProgress,
  JourneyProgress,
  ModuleProgress,
  LearningJourney,
  LearningModule,
} from "./types";

const STORAGE_KEY = "finasaan_learn_progress";

// ---- Read / Write ----

export function getAllProgress(): AllProgress {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AllProgress) : {};
  } catch {
    return {};
  }
}

function saveAllProgress(progress: AllProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

// ---- Journey-level ----

export function getJourneyProgress(journeyId: string): JourneyProgress | null {
  const all = getAllProgress();
  return all[journeyId] ?? null;
}

function ensureJourneyProgress(journeyId: string): JourneyProgress {
  const all = getAllProgress();
  if (!all[journeyId]) {
    all[journeyId] = {
      journeyId,
      modules: {},
      startedAt: new Date().toISOString(),
    };
    saveAllProgress(all);
  }
  return all[journeyId];
}

// ---- Module-level ----

function ensureModuleProgress(
  journeyId: string,
  moduleId: string,
): ModuleProgress {
  const all = getAllProgress();
  const jp = all[journeyId] ?? {
    journeyId,
    modules: {},
    startedAt: new Date().toISOString(),
  };
  if (!jp.modules[moduleId]) {
    jp.modules[moduleId] = { moduleId, lessons: {} };
  }
  all[journeyId] = jp;
  saveAllProgress(all);
  return jp.modules[moduleId];
}

// ---- Lesson ----

export function markLessonComplete(
  journeyId: string,
  moduleId: string,
  lessonId: string,
): void {
  const all = getAllProgress();
  const jp = all[journeyId] ?? {
    journeyId,
    modules: {},
    startedAt: new Date().toISOString(),
  };
  if (!jp.modules[moduleId]) {
    jp.modules[moduleId] = { moduleId, lessons: {} };
  }
  jp.modules[moduleId].lessons[lessonId] = {
    lessonId,
    completed: true,
    completedAt: new Date().toISOString(),
  };
  all[journeyId] = jp;
  saveAllProgress(all);
}

export function isLessonComplete(
  journeyId: string,
  moduleId: string,
  lessonId: string,
): boolean {
  const jp = getJourneyProgress(journeyId);
  return jp?.modules[moduleId]?.lessons[lessonId]?.completed ?? false;
}

// ---- Quiz ----

export function saveQuizResult(
  journeyId: string,
  moduleId: string,
  quizId: string,
  score: number,
  passed: boolean,
  answers: number[],
): void {
  const all = getAllProgress();
  const jp = all[journeyId] ?? {
    journeyId,
    modules: {},
    startedAt: new Date().toISOString(),
  };
  if (!jp.modules[moduleId]) {
    jp.modules[moduleId] = { moduleId, lessons: {} };
  }
  jp.modules[moduleId].quiz = {
    quizId,
    score,
    passed,
    completedAt: new Date().toISOString(),
    answers,
  };
  all[journeyId] = jp;
  saveAllProgress(all);
}

export function getQuizResult(
  journeyId: string,
  moduleId: string,
) {
  const jp = getJourneyProgress(journeyId);
  return jp?.modules[moduleId]?.quiz ?? null;
}

// ---- Computed stats ----

export function getJourneyCompletionPercent(journey: LearningJourney): number {
  const jp = getJourneyProgress(journey.id);
  if (!jp) return 0;

  let totalItems = 0;
  let completedItems = 0;

  for (const mod of journey.modules) {
    totalItems += mod.lessons.length + 1; // lessons + quiz
    const mp = jp.modules[mod.id];
    if (mp) {
      completedItems += Object.values(mp.lessons).filter((l) => l.completed).length;
      if (mp.quiz?.passed) completedItems += 1;
    }
  }

  return totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);
}

export function getModuleCompletionPercent(
  journey: LearningJourney,
  moduleId: string,
): number {
  const jp = getJourneyProgress(journey.id);
  const mod = journey.modules.find((m) => m.id === moduleId);
  if (!jp || !mod) return 0;

  const mp = jp.modules[moduleId];
  if (!mp) return 0;

  const totalItems = mod.lessons.length + 1;
  let completedItems = Object.values(mp.lessons).filter((l) => l.completed).length;
  if (mp.quiz?.passed) completedItems += 1;

  return Math.round((completedItems / totalItems) * 100);
}

export function getCompletedLessonsCount(
  journeyId: string,
  moduleId: string,
  totalLessons: number,
): number {
  const jp = getJourneyProgress(journeyId);
  if (!jp) return 0;
  const mp = jp.modules[moduleId];
  if (!mp) return 0;
  return Object.values(mp.lessons).filter((l) => l.completed).length;
}

export function getOverallCompletionPercent(
  journeys: LearningJourney[],
): number {
  if (journeys.length === 0) return 0;
  const total = journeys.reduce(
    (sum, j) => sum + getJourneyCompletionPercent(j),
    0,
  );
  return Math.round(total / journeys.length);
}
