"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getModuleById, isLessonComplete, markLessonComplete } from "@/lib/learn";
import type { LearningJourney, LearningModule, Lesson, LessonContentBlock } from "@/lib/learn";

function CalloutIcon({ variant }: { variant: string }) {
  if (variant === "tip") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2a7 7 0 017 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 01-1 1H9a1 1 0 01-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 017-7z" />
        <path d="M9 21h6M10 17v4M14 17v4" />
      </svg>
    );
  }
  if (variant === "warning") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <path d="M12 9v4M12 17h.01" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

function LessonBlock({ block }: { block: LessonContentBlock }) {
  switch (block.type) {
    case "heading":
      return <h2 className="learn-block learn-block--heading">{block.content}</h2>;
    case "text":
      return <p className="learn-block learn-block--text">{block.content}</p>;
    case "callout":
      return (
        <div className="learn-block learn-block--callout" data-variant={block.variant}>
          <span className="learn-block--callout-icon">
            <CalloutIcon variant={block.variant} />
          </span>
          <span>{block.content}</span>
        </div>
      );
    case "list":
      if (block.ordered) {
        return (
          <ol className="learn-block learn-block--list">
            {block.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ol>
        );
      }
      return (
        <ul className="learn-block learn-block--list">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    case "video":
      return (
        <div className="learn-block">
          <div className="learn-block--video">
            <iframe
              src={`https://www.youtube.com/embed/${block.youtubeId}`}
              title={block.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <p className="learn-block--video-title">{block.title}</p>
        </div>
      );
    case "keyTakeaway":
      return (
        <div className="learn-block learn-block--takeaway">
          <h4 className="learn-block--takeaway-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" /></svg>
            Key Takeaways
          </h4>
          <ul className="learn-block--takeaway-list">
            {block.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      );
    default:
      return null;
  }
}

export default function ModuleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const journeyId = params.journeyId as string;
  const moduleId = params.moduleId as string;

  const [journey, setJourney] = useState<LearningJourney | undefined>();
  const [module_, setModule] = useState<LearningModule | undefined>();
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [lessonStatuses, setLessonStatuses] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);

  const refreshStatuses = useCallback(() => {
    if (!module_) return;
    const statuses: Record<string, boolean> = {};
    for (const l of module_.lessons) {
      statuses[l.id] = isLessonComplete(journeyId, moduleId, l.id);
    }
    setLessonStatuses(statuses);
  }, [module_, journeyId, moduleId]);

  useEffect(() => {
    const { journey: j, module: m } = getModuleById(journeyId, moduleId);
    setJourney(j);
    setModule(m);
    setMounted(true);
  }, [journeyId, moduleId]);

  useEffect(() => {
    refreshStatuses();
  }, [refreshStatuses]);

  if (!mounted) return null;

  if (!journey || !module_) {
    return (
      <>
        <Link href="/dashboard/learn" className="learn-back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Back to Journeys
        </Link>
        <div className="learn-lesson-content">
          <p className="learn-block--text">Module not found.</p>
        </div>
      </>
    );
  }

  const activeLesson: Lesson | undefined = module_.lessons[activeLessonIdx];

  const handleMarkComplete = () => {
    if (!activeLesson) return;
    markLessonComplete(journeyId, moduleId, activeLesson.id);
    refreshStatuses();

    // Auto-advance
    if (activeLessonIdx < module_.lessons.length - 1) {
      setActiveLessonIdx(activeLessonIdx + 1);
    }
  };

  const handleGoToQuiz = () => {
    router.push(`/dashboard/learn/${journeyId}/${moduleId}/quiz`);
  };

  const allLessonsComplete = module_.lessons.every(
    (l) => lessonStatuses[l.id],
  );

  return (
    <>
      <Link
        href={`/dashboard/learn/${journeyId}`}
        className="learn-back-link"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        Back to {journey.title}
      </Link>

      <div className="learn-module-layout">
        {/* Sidebar */}
        <div className="learn-module-sidebar">
          <h3 className="learn-module-sidebar__title">{module_.title}</h3>
          <div className="learn-module-sidebar__items">
            {module_.lessons.map((lesson, idx) => (
              <button
                key={lesson.id}
                className={`learn-module-sidebar__item${idx === activeLessonIdx ? " active" : ""}`}
                onClick={() => setActiveLessonIdx(idx)}
              >
                <span
                  className={`learn-module-sidebar__item-icon${lessonStatuses[lesson.id] ? " completed" : ""}`}
                >
                  {lessonStatuses[lesson.id] ? (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
                  ) : (
                    idx + 1
                  )}
                </span>
                <span className="learn-module-sidebar__item-label">
                  {lesson.title}
                </span>
              </button>
            ))}
            {/* Quiz link */}
            <button
              className="learn-module-sidebar__item"
              onClick={handleGoToQuiz}
            >
              <span className="learn-module-sidebar__item-icon quiz-icon">
                Q
              </span>
              <span className="learn-module-sidebar__item-label">
                Knowledge Check
              </span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="learn-lesson-content">
          {activeLesson ? (
            <>
              <div className="learn-lesson-header">
                <h1 className="learn-lesson-title">{activeLesson.title}</h1>
                <div className="learn-lesson-meta">
                  <span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: "middle", marginRight: 4 }}><path d="M12 6v6l4 2" /><circle cx="12" cy="12" r="10" /></svg>
                    {activeLesson.estimatedMinutes} min read
                  </span>
                  <span>
                    Lesson {activeLesson.order} of {module_.lessons.length}
                  </span>
                </div>
              </div>

              {activeLesson.content.map((block, i) => (
                <LessonBlock key={i} block={block} />
              ))}

              {/* Nav */}
              <div className="learn-lesson-nav">
                {activeLessonIdx > 0 ? (
                  <button
                    className="learn-lesson-nav__btn learn-lesson-nav__btn--secondary"
                    onClick={() => setActiveLessonIdx(activeLessonIdx - 1)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                    Previous
                  </button>
                ) : (
                  <div />
                )}

                <div style={{ display: "flex", gap: 8 }}>
                  {!lessonStatuses[activeLesson.id] && (
                    <button
                      className="learn-lesson-nav__btn learn-lesson-nav__btn--complete"
                      onClick={handleMarkComplete}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" /></svg>
                      Mark Complete
                    </button>
                  )}

                  {activeLessonIdx < module_.lessons.length - 1 ? (
                    <button
                      className="learn-lesson-nav__btn learn-lesson-nav__btn--primary"
                      onClick={() => setActiveLessonIdx(activeLessonIdx + 1)}
                    >
                      Next
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </button>
                  ) : allLessonsComplete ? (
                    <button
                      className="learn-lesson-nav__btn learn-lesson-nav__btn--primary"
                      onClick={handleGoToQuiz}
                    >
                      Take Quiz
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </button>
                  ) : null}
                </div>
              </div>
            </>
          ) : (
            <p className="learn-block--text">No lesson selected.</p>
          )}
        </div>
      </div>
    </>
  );
}
