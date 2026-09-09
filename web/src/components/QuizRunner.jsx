import { useEffect, useMemo, useRef, useState } from "react";
import { useSfx } from "../hooks/useSfx.js";
import "./quizRunner.scss";

export default function QuizRunner({
  title,
  subtitle,
  questions,
  initialScore = 0,
  secondsPerQuestion = null,
  pointsPerCorrect = 1,
  onComplete,
  onExit,
}) {
  const { play } = useSfx();

  const total = questions?.length ?? 0;
  const hasTimer = Number.isFinite(secondsPerQuestion);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);
  const [score, setScore] = useState(initialScore);
  const [secondsLeft, setSecondsLeft] = useState(
    hasTimer ? secondsPerQuestion : 0,
  );

  const nextTimerRef = useRef(null);

  const q = questions?.[index];

  useEffect(() => {
    return () => {
      if (nextTimerRef.current) {
        clearTimeout(nextTimerRef.current);
        nextTimerRef.current = null;
      }
    };
  }, [index]);

  const progressLabel = useMemo(() => {
    const current = index + 1;
    return `Q${String(current).padStart(2, "0")}/${String(total).padStart(2, "0")}`;
  }, [index, total]);

  useEffect(() => {
    if (!hasTimer || locked || secondsLeft <= 0) return;

    const timer = setTimeout(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [hasTimer, locked, secondsLeft]);

  useEffect(() => {
    if (!hasTimer || locked) return;

    if (secondsLeft > 0 && secondsLeft <= 3) {
      play("click");
    }
  }, [hasTimer, locked, secondsLeft, play]);

  useEffect(() => {
    if (!hasTimer || locked || secondsLeft > 0) return;
    if (nextTimerRef.current) return;

    setLocked(true);
    play("timeout");

    nextTimerRef.current = setTimeout(() => {
      nextTimerRef.current = null;
      finishOrGoNext(score);
    }, 650);
    // finishOrGoNext utilise volontairement l'état courant de la question.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasTimer, locked, secondsLeft, play, score]);

  function resetForNextQuestion() {
    setSelected(null);
    setLocked(false);

    if (hasTimer) {
      setSecondsLeft(secondsPerQuestion);
    }
  }

  function finishOrGoNext(nextScoreValue) {
    if (index + 1 >= total) {
      onComplete(nextScoreValue);
      return;
    }

    resetForNextQuestion();
    setIndex((prev) => prev + 1);
  }

  function scheduleNext(nextScoreValue) {
    if (nextTimerRef.current) {
      clearTimeout(nextTimerRef.current);
      nextTimerRef.current = null;
    }

    nextTimerRef.current = setTimeout(() => {
      nextTimerRef.current = null;
      finishOrGoNext(nextScoreValue);
    }, 650);
  }

  function pickChoice(choiceIndex) {
    if (locked || !q) return;

    setSelected(choiceIndex);
    setLocked(true);
    play("select");

    const isCorrect = choiceIndex === q.answerIndex;
    const nextScoreValue = isCorrect ? score + pointsPerCorrect : score;

    if (isCorrect) {
      setScore(nextScoreValue);
      play("correct");
    } else {
      play("wrong");
    }

    scheduleNext(nextScoreValue);
  }

  function exitNow() {
    play("click");

    if (onExit) {
      onExit();
      return;
    }

    onComplete(0);
  }

  if (!total || !q) {
    return (
      <div className="quiz container">
        <div className="card quiz__card">
          <p className="quiz__feedback quiz__feedback--wrong">
            No questions available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz container">
      <div className="card quiz__card">
        <header className="quiz__hud">
          <div className="quiz__hudBlock">
            <span className="quiz__hudLabel">LEVEL</span>
            <span className="quiz__hudValue quiz__hudValue--primary">
              {title}
            </span>
          </div>

          <div className="quiz__hudBlock quiz__hudCenter">
            <span className="quiz__hudLabel">PROGRESS</span>
            <span className="quiz__hudValue">{progressLabel}</span>
          </div>

          <div className="quiz__hudBlock quiz__hudRight">
            <span className="quiz__hudLabel">SCORE</span>
            <span className="quiz__hudValue quiz__hudValue--ok">{score}</span>
          </div>
        </header>

        {subtitle && <p className="quiz__subtitle subtitle">{subtitle}</p>}

        {hasTimer && (
          <div className="quiz__timer">
            <div className="quiz__timerTop">
              <span className="quiz__timerLabel">TIME</span>
              <span
                className={`quiz__timerValue ${
                  secondsLeft <= 3 ? "quiz__timerValue--danger" : ""
                }`}
              >
                {secondsLeft}s
              </span>
            </div>

            <progress
              className="quiz__progress"
              max={secondsPerQuestion}
              value={secondsLeft}
            />
          </div>
        )}

        <div className="quiz__questionBlock" aria-live="polite">
          <h2 className="quiz__question">{q.question}</h2>

          <div className="quiz__choices">
            {q.choices.map((choice, i) => {
              const isSelected = selected === i;
              const isCorrect = locked && i === q.answerIndex;
              const isWrong = locked && isSelected && i !== q.answerIndex;

              const className = [
                "quiz__choice",
                isSelected ? "quiz__choice--selected" : "",
                isCorrect ? "quiz__choice--correct" : "",
                isWrong ? "quiz__choice--wrong" : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <button
                  key={i}
                  className={className}
                  onClick={() => pickChoice(i)}
                  type="button"
                  disabled={locked}
                  aria-pressed={isSelected}
                >
                  <span className="quiz__choiceKey">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="quiz__choiceText">{choice}</span>
                </button>
              );
            })}
          </div>

          <div className="quiz__actions">
            <button
              className="btn btn--primary"
              type="button"
              onClick={exitNow}
            >
              EXIT
            </button>
          </div>

          {hasTimer && locked && secondsLeft === 0 && (
            <p className="quiz__feedback quiz__feedback--wrong" role="status">⏱ TIME OUT!</p>
          )}

          {locked && selected !== null && (
            <p role="status"
              className={`quiz__feedback ${
                selected === q.answerIndex
                  ? "quiz__feedback--correct"
                  : "quiz__feedback--wrong"
              }`}
            >
              {selected === q.answerIndex ? "✅ NICE!" : "❌ WRONG!"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
