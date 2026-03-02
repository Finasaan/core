"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  getJourneyById,
  getJourneyCompletionPercent,
  getModuleCompletionPercent,
  getCompletedLessonsCount,
  getQuizResult,
} from "@/lib/learn";
import type { LearningJourney } from "@/lib/learn";

export default function JourneyDetailPage() {
  const params = useParams();
  const journeyId = params.journeyId as string;
  const [journey, setJourney] = useState<LearningJourney | undefined>();
  const [journeyPct, setJourneyPct] = useState(0);
  const [modulePcts, setModulePcts] = useState<Record<string, number>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const j = getJourneyById(journeyId);
    setJourney(j);
    if (j) {
      setJourneyPct(getJourneyCompletionPercent(j));
      const pcts: Record<string, number> = {};
      for (const m of j.modules) {
        pcts[m.id] = getModuleCompletionPercent(j, m.id);
      }
      setModulePcts(pcts);
    }
    setMounted(true);
  }, [journeyId]);

  if (!mounted) return null;

  if (!journey) {
    return (
      <>
        <Link href="/dashboard/learn" className="learn-back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Back to Journeys
        </Link>
        <div className="learn-lesson-content">
          <p className="learn-block--text">Journey not found.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Link href="/dashboard/learn" className="learn-back-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        Back to Journeys
      </Link>

      {/* Hero */}
      <div className="learn-journey-hero">
        <div
          className="learn-journey-hero__icon"
          style={{ background: journey.coverColor }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M22 16.74V4.67c0-1.2-.98-2.09-2.17-1.99H19.7c-2.01.15-5.02 1.13-6.68 2.21l-.17.12c-.29.19-.77.19-1.06 0l-.25-.15C9.87 3.78 6.87 2.83 4.86 2.67H4.73C3.53 2.57 2.56 3.47 2.56 4.67v12.07c0 .96.78 1.86 1.74 1.98l.29.04c2.09.27 5.32 1.3 7.15 2.31l.04.02c.27.15.7.15.96 0 1.83-1.02 5.07-2.07 7.18-2.33l.33-.04c.96-.12 1.74-1.02 1.74-1.98z" />
            <path d="M12 5.49v15M7.75 8.49h-2.5M8.25 11.49h-3" />
          </svg>
        </div>
        <div className="learn-journey-hero__info">
          <h1 className="learn-journey-hero__title">{journey.title}</h1>
          <p className="learn-journey-hero__desc">{journey.description}</p>
          <div className="learn-journey-hero__tags">
            <span className="learn-journey-hero__tag" data-level={journey.difficulty}>
              {journey.difficulty.charAt(0).toUpperCase() + journey.difficulty.slice(1)}
            </span>
            <span className="learn-journey-hero__tag">
              {journey.modules.length} modules
            </span>
            <span className="learn-journey-hero__tag">
              {journey.estimatedMinutes} min
            </span>
          </div>
          <div className="learn-journey-progress-bar">
            <div className="learn-journey-progress-bar__track">
              <div
                className="learn-journey-progress-bar__fill"
                style={{ width: `${journeyPct}%` }}
              />
            </div>
            <span className="learn-journey-progress-bar__label">
              {journeyPct}% complete
            </span>
          </div>
        </div>
      </div>

      {/* Modules list */}
      <section className="learn-section">
        <div className="learn-section-header">
          <h2 className="learn-section-title">Modules</h2>
        </div>
        <div className="learn-modules-list">
          {journey.modules.map((mod) => {
            const pct = modulePcts[mod.id] ?? 0;
            const completedLessons = getCompletedLessonsCount(
              journey.id,
              mod.id,
              mod.lessons.length,
            );
            const quizResult = getQuizResult(journey.id, mod.id);
            return (
              <Link
                key={mod.id}
                href={`/dashboard/learn/${journey.id}/${mod.id}`}
                className="learn-module-card"
              >
                <div
                  className={`learn-module-card__number${pct === 100 ? " completed" : ""}`}
                >
                  {pct === 100 ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                  ) : (
                    mod.order
                  )}
                </div>
                <div className="learn-module-card__info">
                  <h3 className="learn-module-card__title">{mod.title}</h3>
                  <p className="learn-module-card__desc">{mod.description}</p>
                  <div className="learn-module-card__meta">
                    <span>
                      {completedLessons}/{mod.lessons.length} lessons
                    </span>
                    <span>
                      {quizResult
                        ? `Quiz: ${quizResult.score}%${quizResult.passed ? " (Passed)" : ""}`
                        : "Quiz: Not taken"}
                    </span>
                  </div>
                </div>
                <div className="learn-module-card__progress">
                  <div className="learn-module-card__progress-bar">
                    <div
                      className="learn-module-card__progress-fill"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="learn-module-card__progress-text">
                    {pct}%
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
