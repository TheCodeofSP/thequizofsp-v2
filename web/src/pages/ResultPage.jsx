import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postScore } from "../services/api.js";
import { useSfx } from "../hooks/useSfx.js";
import {
  computeFinalScore,
  getAbandonedRun,
  getDoubleWon,
  getPlayedDouble,
  getPlayerName,
  getRunId,
  getScoreQuiz1,
  getScoreQuiz2,
} from "../services/quizSession.js";
import "./ResultPage.scss";

export default function ResultPage() {
  const navigate = useNavigate();
  const { enabled: sfxEnabled, toggle: toggleSfx, play } = useSfx();

  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const pseudo = getPlayerName();
  const scoreQuiz1 = getScoreQuiz1();
  const scoreQuiz2 = getScoreQuiz2();
  const playedDouble = getPlayedDouble();
  const doubleWon = getDoubleWon();
  const abandonedRun = getAbandonedRun();

  const baseScore = scoreQuiz1 + scoreQuiz2;
  const finalScore = useMemo(() => computeFinalScore(), []);

  const runId = getRunId();
  const saveKey = `score-saved:${runId}`;

  const headline = finalScore > 0 ? "LEVEL CLEAR" : "GAME OVER";
  const subline = abandonedRun
    ? "RUN ABORTED • SCORE RESET"
    : playedDouble
      ? doubleWon
        ? "ALL-IN SUCCESS • SCORE DOUBLED"
        : "ALL-IN FAILED • SCORE LOST"
      : "EXIT • SCORE SAVED";

  useEffect(() => {
    async function save() {
      try {
        setStatus("saving");
        setError("");

        await postScore({
          runId,
          pseudo,
          scoreQuiz1,
          scoreQuiz2,
          playedDouble,
          doubleWon,
          finalScore,
        });

        sessionStorage.setItem(saveKey, "true");
        setStatus("saved");
      } catch (e) {
        setStatus("error");
        setError(e.message || "Erreur");
      }
    }

    if (!pseudo) return;

    const alreadySaved = sessionStorage.getItem(saveKey) === "true";

    if (alreadySaved) {
      // Synchronise l'interface avec la sauvegarde de cette partie.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("saved");
      return;
    }

    save();
  }, [
    doubleWon,
    finalScore,
    playedDouble,
    pseudo,
    runId,
    saveKey,
    scoreQuiz1,
    scoreQuiz2,
  ]);

  useEffect(() => {
    if (finalScore > 0) {
      play("win");
    } else {
      play("lose");
    }
  }, [finalScore, play]);

  return (
    <div className="container result">
      <div
        className={`card result__card ${
          finalScore > 0 ? "result__card--win" : "result__card--lose"
        }`}
      >
        <header className="result__hud">
          <div className="result__hudLeft">
            <div className="result__hudLine">
              <span className="result__hudLabel">JOUEUR</span>
              <span className="result__hudValue">{pseudo || "UNKNOWN"}</span>
            </div>
            <div className="result__hudLine">
              <span className="result__hudLabel">STATUS</span>
              <span
                className={`result__hudValue ${
                  finalScore > 0
                    ? "result__hudValue--ok"
                    : "result__hudValue--bad"
                }`}
              >
                {finalScore > 0 ? "CLEAR" : "FAILED"}
              </span>
            </div>
          </div>

          <div className="result__hudRight">
            <button
              className="result__sfxBtn"
              type="button"
              onClick={toggleSfx}
            >
              SFX: {sfxEnabled ? "ON" : "OFF"}
            </button>
          </div>
        </header>

        <div className="result__titleBlock">
          <h2
            className={`title result__headline ${
              finalScore > 0
                ? "result__headline--win"
                : "result__headline--lose"
            }`}
          >
            {headline}
          </h2>
          <p className="result__subline">{subline}</p>
        </div>

        <div className="result__stats">
          <div className="result__stat">
            <span className="result__statLabel">LEVEL 1</span>
            <span className="result__statValue">{scoreQuiz1} / 5</span>
          </div>

          <div className="result__stat">
            <span className="result__statLabel">LEVEL 2</span>
            <span className="result__statValue">{scoreQuiz2} / 20</span>
          </div>

          <div className="result__stat result__stat--big">
            <span className="result__statLabel">TOTAL</span>
            <span className="result__statValue">{baseScore}</span>
          </div>

          <div className="result__stat result__stat--big result__stat--final">
            <span className="result__statLabel">SCORE FINAL</span>
            <span
              className={`result__statValue result__finalValue ${
                finalScore > 0 ? "is-win" : "is-lose"
              }`}
            >
              {finalScore}
            </span>
          </div>
        </div>

        <div className="result__save">
          <span className="result__saveLabel">SAVE</span>
          <span className="result__saveValue">
            {status === "saving" && (
              <span className="result__blink">SAVING…</span>
            )}
            {status === "saved" && "SAVED ✓"}
            {status === "error" && "FAILED ✕"}
          </span>
        </div>

        {status === "error" && <p className="error result__error">{error}</p>}

        {status === "error" && (
          <button className="btn btn--secondary" type="button" onClick={() => window.location.reload()}>
            RÉESSAYER LA SAUVEGARDE
          </button>
        )}

        <div className="result__actions">
          <button
            className="btn btn--secondary"
            type="button"
            onClick={() => {
              play("click");
              navigate("/");
            }}
          >
            PLAY AGAIN
          </button>
          <button
            className="btn btn--primary"
            type="button"
            onClick={() => {
              play("coin");
              navigate("/leaderboard");
            }}
          >
            LEADERBOARD
          </button>
        </div>

        <p className="result__footer">
          PRESS <span className="pa">PLAY AGAIN</span> TO CONTINUE ▸{" "}
          <span className="result__blink">READY</span>
        </p>
      </div>
    </div>
  );
}
