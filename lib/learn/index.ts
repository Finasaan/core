export type {
  LearningJourney,
  LearningModule,
  Lesson,
  LessonContentBlock,
  Quiz,
  QuizQuestion,
  JourneyDifficulty,
  JourneyCategory,
  JourneyProgress,
  ModuleProgress,
  LessonProgress,
  QuizProgress,
  AllProgress,
} from "./types";

export {
  JOURNEYS,
  JOURNEY_STATS,
  getJourneyById,
  getModuleById,
  getLessonById,
} from "./data";

export {
  getAllProgress,
  getJourneyProgress,
  getJourneyCompletionPercent,
  getModuleCompletionPercent,
  getCompletedLessonsCount,
  getOverallCompletionPercent,
  markLessonComplete,
  isLessonComplete,
  saveQuizResult,
  getQuizResult,
} from "./progress";
