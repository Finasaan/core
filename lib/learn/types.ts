/**
 * Learning Journeys module types
 * All learning data is hardcoded educational content for the Finasaan platform.
 */

// ---- Journey ----

export type JourneyDifficulty = "beginner" | "intermediate" | "advanced";
export type JourneyCategory = "stocks" | "mutual-funds" | "financial-literacy" | "insurance" | "taxation";

export interface LearningJourney {
  id: string;
  title: string;
  description: string;
  difficulty: JourneyDifficulty;
  category: JourneyCategory;
  estimatedMinutes: number;
  coverColor: string; // gradient start color
  icon: string; // icon identifier
  modules: LearningModule[];
}

// ---- Module ----

export interface LearningModule {
  id: string;
  journeyId: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
  quiz: Quiz;
}

// ---- Lesson ----

export type LessonContentBlock =
  | { type: "text"; content: string }
  | { type: "heading"; content: string }
  | { type: "callout"; content: string; variant: "info" | "tip" | "warning" }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "video"; youtubeId: string; title: string }
  | { type: "keyTakeaway"; items: string[] };

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  order: number;
  estimatedMinutes: number;
  content: LessonContentBlock[];
}

// ---- Quiz ----

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  moduleId: string;
  title: string;
  passingScore: number; // percentage (0-100)
  questions: QuizQuestion[];
}

// ---- Progress ----

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  completedAt?: string;
}

export interface QuizProgress {
  quizId: string;
  score: number; // percentage
  passed: boolean;
  completedAt: string;
  answers: number[]; // selected option indices
}

export interface ModuleProgress {
  moduleId: string;
  lessons: Record<string, LessonProgress>;
  quiz?: QuizProgress;
}

export interface JourneyProgress {
  journeyId: string;
  modules: Record<string, ModuleProgress>;
  startedAt: string;
}

export type AllProgress = Record<string, JourneyProgress>;
