"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  JOURNEYS,
  JOURNEY_STATS,
  getJourneyCompletionPercent,
  getOverallCompletionPercent,
} from "@/lib/learn";

export default function LearnPage() {
  const [completions, setCompletions] = useState<Record<string, number>>({});
  const [overall, setOverall] = useState(0);

  useEffect(() => {
    const map: Record<string, number> = {};
    for (const j of JOURNEYS) {
      map[j.id] = getJourneyCompletionPercent(j);
    }
    setCompletions(map);
    setOverall(getOverallCompletionPercent(JOURNEYS));
  }, []);

  return (
    <>
      <header className="dashboard-header">
        <h1 className="dashboard-greeting">
          <span className="greeting-green">Learning</span>{" "}
          <span className="greeting-dark">Journeys</span>
        </h1>
        <p className="dashboard-date">
          Build your financial knowledge step by step
        </p>
      </header>

      {/* Stats */}
      <div className="learn-stats-row">
        <div className="learn-stat-card">
          <span className="learn-stat-value">{JOURNEY_STATS.totalJourneys}</span>
          <span className="learn-stat-label">Learning Paths</span>
        </div>
        <div className="learn-stat-card">
          <span className="learn-stat-value">{JOURNEY_STATS.totalModules}</span>
          <span className="learn-stat-label">Modules</span>
        </div>
        <div className="learn-stat-card">
          <span className="learn-stat-value">{JOURNEY_STATS.totalLessons}</span>
          <span className="learn-stat-label">Lessons</span>
        </div>
        <div className="learn-stat-card">
          <span className="learn-stat-value">{JOURNEY_STATS.totalMinutes}m</span>
          <span className="learn-stat-label">Total Content</span>
        </div>
      </div>

      {/* Overall progress */}
      <div className="learn-overall-progress">
        <span className="learn-overall-label">Overall Progress</span>
        <div className="learn-overall-bar-wrap">
          <div
            className="learn-overall-bar-fill"
            style={{ width: `${overall}%` }}
          />
        </div>
        <span className="learn-overall-pct">{overall}%</span>
      </div>

      {/* Journey cards */}
      <section className="learn-section">
        <div className="learn-section-header">
          <h2 className="learn-section-title">All Journeys</h2>
        </div>
        <div className="learn-journeys-grid">
          {JOURNEYS.map((journey) => {
            const pct = completions[journey.id] ?? 0;
            const totalLessons = journey.modules.reduce(
              (s, m) => s + m.lessons.length,
              0,
            );
            return (
              <Link
                key={journey.id}
                href={`/dashboard/learn/${journey.id}`}
                className="learn-journey-card"
              >
                <div
                  className="learn-journey-card__banner"
                  style={{ background: journey.coverColor }}
                />
                <div className="learn-journey-card__body">
                  <span
                    className="learn-journey-card__difficulty"
                    data-level={journey.difficulty}
                  >
                    {journey.difficulty}
                  </span>
                  <h3 className="learn-journey-card__title">{journey.title}</h3>
                  <p className="learn-journey-card__desc">
                    {journey.description}
                  </p>
                  <div className="learn-journey-card__meta">
                    <span className="learn-journey-card__meta-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
                      {journey.modules.length} modules
                    </span>
                    <span className="learn-journey-card__meta-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 6v6l4 2" /><circle cx="12" cy="12" r="10" /></svg>
                      {journey.estimatedMinutes} min
                    </span>
                    <span className="learn-journey-card__meta-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" /></svg>
                      {totalLessons} lessons
                    </span>
                  </div>
                  <div className="learn-journey-card__progress">
                    <div className="learn-journey-card__progress-bar">
                      <div
                        className="learn-journey-card__progress-fill"
                        style={{
                          width: `${pct}%`,
                          background: journey.coverColor,
                        }}
                      />
                    </div>
                    <span className="learn-journey-card__progress-text">
                      {pct > 0 ? `${pct}% complete` : "Not started"}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
