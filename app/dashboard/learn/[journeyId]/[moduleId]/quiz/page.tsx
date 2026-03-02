"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getModuleById, saveQuizResult, getQuizResult } from "@/lib/learn";
import type { LearningJourney, LearningModule, Quiz, QuizQuestion } from "@/lib/learn";

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const journeyId = params.journeyId as string;
  const moduleId = params.moduleId as string;

  const [journey, setJourney] = useState<LearningJourney | undefined>();
  const [module_, setModule] = useState<LearningModule | undefined>();
  const [mounted, setMounted] = useState(false);

  // Quiz state
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);
  const [previousResult, setPreviousResult] = useState<{ score: number; passed: boolean } | null>(null);

  useEffect(() => {
    const { journey: j, module: m } = getModuleById(journeyId, moduleId);
    setJourney(j);
    setModule(m);
    if (m) {
      setAnswers(new Array(m.quiz.questions.length).fill(null));
      const prev = getQuizResult(journeyId, moduleId);
      if (prev) {
        setPreviousResult({ score: prev.score, passed: prev.passed });
      }
    }
    setMounted(true);
  }, [journeyId, moduleId]);

  if (!mounted) return null;

  if (!journey || !module_) {
    return (
      <>
        <Link href="/dashboard/learn" className="learn-back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Back to Journeys
        </Link>
        <div className="learn-quiz-container">
          <p className="learn-block--text">Module not found.</p>
        </div>
      </>
    );
  }

  const quiz: Quiz = module_.quiz;
  const questions: QuizQuestion[] = quiz.questions;
  const currentQ = questions[currentIdx];

  const handleSelectOption = (optionIdx: number) => {
    if (revealed) return;
    const newAnswers = [...answers];
    newAnswers[currentIdx] = optionIdx;
    setAnswers(newAnswers);
  };

  const handleCheck = () => {
    setRevealed(true);
  };

  const handleNext = () => {
    setRevealed(false);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Finished
      const correctCount = answers.reduce((count: number, ans, idx) => {
        return count + (ans === questions[idx].correctIndex ? 1 : 0);
      }, 0);
      const pct = Math.round((correctCount / questions.length) * 100);
      const didPass = pct >= quiz.passingScore;
      setScore(pct);
      setPassed(didPass);
      setFinished(true);
      saveQuizResult(
        journeyId,
        moduleId,
        quiz.id,
        pct,
        didPass,
        answers.map((a) => a ?? -1),
      );
    }
  };

  const handleRetry = () => {
    setCurrentIdx(0);
    setAnswers(new Array(questions.length).fill(null));
    setRevealed(false);
    setFinished(false);
    setScore(0);
    setPassed(false);
  };

  return (
    <>
      <Link
        href={`/dashboard/learn/${journeyId}/${moduleId}`}
        className="learn-back-link"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        Back to {module_.title}
      </Link>

      <div className="learn-quiz-container">
        <div className="learn-quiz-header">
          <h1 className="learn-quiz-title">{quiz.title}</h1>
          <p className="learn-quiz-subtitle">
            {questions.length} questions &middot; {quiz.passingScore}% to pass
            {previousResult && (
              <span style={{ marginLeft: 12, color: previousResult.passed ? "#159F63" : "#708090" }}>
                &middot; Previous best: {previousResult.score}%
              </span>
            )}
          </p>
        </div>

        {finished ? (
          /* Results */
          <div className="learn-quiz-results">
            <p className={`learn-quiz-results__score ${passed ? "passed" : "failed"}`}>
              {score}%
            </p>
            <h2 className="learn-quiz-results__label">
              {passed ? "Congratulations! You passed!" : "Not quite there yet"}
            </h2>
            <p className="learn-quiz-results__detail">
              You got {answers.filter((a, i) => a === questions[i].correctIndex).length} out of{" "}
              {questions.length} questions correct.
              {!passed && ` You need ${quiz.passingScore}% to pass.`}
            </p>
            <div className="learn-quiz-results__actions">
              {!passed && (
                <button
                  className="learn-lesson-nav__btn learn-lesson-nav__btn--secondary"
                  onClick={handleRetry}
                >
                  Try Again
                </button>
              )}
              <button
                className="learn-lesson-nav__btn learn-lesson-nav__btn--primary"
                onClick={() => router.push(`/dashboard/learn/${journeyId}`)}
              >
                Back to Journey
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Progress */}
            <div className="learn-quiz-progress">
              <div className="learn-quiz-progress__bar">
                <div
                  className="learn-quiz-progress__fill"
                  style={{
                    width: `${((currentIdx + (revealed ? 1 : 0)) / questions.length) * 100}%`,
                  }}
                />
              </div>
              <span className="learn-quiz-progress__text">
                {currentIdx + 1} / {questions.length}
              </span>
            </div>

            {/* Question */}
            <div className="learn-quiz-question">
              <h3 className="learn-quiz-question__text">{currentQ.question}</h3>
              <div className="learn-quiz-options">
                {currentQ.options.map((option, idx) => {
                  let className = "learn-quiz-option";
                  if (revealed) {
                    className += " disabled";
                    if (idx === currentQ.correctIndex) {
                      className += " correct";
                    } else if (idx === answers[currentIdx] && idx !== currentQ.correctIndex) {
                      className += " incorrect";
                    }
                  } else if (answers[currentIdx] === idx) {
                    className += " selected";
                  }
                  return (
                    <button
                      key={idx}
                      className={className}
                      onClick={() => handleSelectOption(idx)}
                      disabled={revealed}
                    >
                      <span className="learn-quiz-option__marker">
                        {revealed && idx === currentQ.correctIndex
                          ? "\u2713"
                          : revealed && idx === answers[currentIdx] && idx !== currentQ.correctIndex
                            ? "\u2717"
                            : String.fromCharCode(65 + idx)}
                      </span>
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Explanation */}
            {revealed && (
              <div className="learn-quiz-explanation">
                {currentQ.explanation}
              </div>
            )}

            {/* Nav */}
            <div className="learn-quiz-nav">
              {!revealed ? (
                <button
                  className="learn-lesson-nav__btn learn-lesson-nav__btn--primary"
                  onClick={handleCheck}
                  disabled={answers[currentIdx] === null}
                  style={{
                    opacity: answers[currentIdx] === null ? 0.5 : 1,
                    cursor: answers[currentIdx] === null ? "not-allowed" : "pointer",
                  }}
                >
                  Check Answer
                </button>
              ) : (
                <button
                  className="learn-lesson-nav__btn learn-lesson-nav__btn--primary"
                  onClick={handleNext}
                >
                  {currentIdx < questions.length - 1 ? "Next Question" : "See Results"}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
