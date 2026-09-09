import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSfx } from "../hooks/useSfx.js";
import "./NextLevelPage.scss";

const TYPE_SPEED = 28;
const LINE_DELAY = 180;

export default function NextLevelPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { play } = useSfx();

  const from = params.get("from");
  const score1 = Number(localStorage.getItem("scoreQuiz1") || 0);
  const score2 = Number(localStorage.getItem("scoreQuiz2") || 0);
  const base = score1 + score2;

  const cfg = useMemo(() => {
    if (from === "quiz-2") {
      return {
        title: "NEXT LEVEL?",
        levelLabel: "LEVEL 3",
        mode: "TAPE YOUR RESPONSE",
        primaryText: "START",
        primaryTo: "/double",
        secondaryText: "EXIT",
        secondaryTo: "/result",
        hint: "FINAL LEVEL | 1 QUESTION QUITTE OU DOUBLE | Score X2 ou X0",
      };
    }

    return {
      title: "NEXT LEVEL?",
      levelLabel: "LEVEL 2",
      mode: "QCM Timer",
      primaryText: "START",
      primaryTo: "/quiz-2",
      secondaryText: "EXIT",
      secondaryTo: "/result",
      hint: "LEVEL 2 : 10 QCM | 10s PAR QUESTION | +2 XP PAR BONNE RÉPONSE",
    };
  }, [from]);

  const terminalLines = useMemo(() => {
    if (from === "quiz-2") {
      return [
        "FINAL LEVEL | 1 QUESTION",
        "QUITTE OU DOUBLE",
        "...",
        "PRESS START TO CONTINUE",
      ];
    }

    return [
      "LOADING QUIZ MODULES...",
      "LEVEL 2 : 10 QCM | 10s PAR QUESTION",
      "+2 XP PAR BONNE RÉPONSE",
      "...",
      "PRESS START TO CONTINUE",
    ];
  }, [from]);

  const [displayedLines, setDisplayedLines] = useState(
    terminalLines.map(() => ""),
  );
  const [activeLine, setActiveLine] = useState(0);
  const [isTypingDone, setIsTypingDone] = useState(false);

  useEffect(() => {
    let lineIndex = 0;
    let charIndex = 0;
    let timeoutId;

    function typeNextChar() {
      const currentLine = terminalLines[lineIndex];

      if (!currentLine) {
        setIsTypingDone(true);
        return;
      }

      if (charIndex <= currentLine.length) {
        setDisplayedLines((prev) => {
          const next = [...prev];
          next[lineIndex] = currentLine.slice(0, charIndex);
          return next;
        });

        charIndex += 1;
        timeoutId = setTimeout(typeNextChar, TYPE_SPEED);
        return;
      }

      lineIndex += 1;
      charIndex = 0;

      if (lineIndex >= terminalLines.length) {
        setActiveLine(terminalLines.length - 1);
        setIsTypingDone(true);
        return;
      }

      setActiveLine(lineIndex);
      timeoutId = setTimeout(typeNextChar, LINE_DELAY);
    }

    timeoutId = setTimeout(typeNextChar, 250);

    return () => clearTimeout(timeoutId);
  }, [terminalLines]);

  return (
    <div className="container nextLevel">
      <div className="card nextLevel__card">
        <header className="nextLevel__hud">
          <div className="nextLevel__hudLine">
            <span className="nextLevel__hudLabel">STATUT</span>
            <span className="nextLevel__hudValue nextLevel__hudValue--ok">
              CLEAR
            </span>
          </div>
          <div className="nextLevel__hudLine">
            <span className="nextLevel__hudLabel">SCORE</span>
            <span className="nextLevel__hudValue">{base}</span>
          </div>
          <div className="nextLevel__hudLine">
            <span className="nextLevel__hudLabel">{cfg.levelLabel}</span>
            <span className="nextLevel__hudValue">{cfg.mode}</span>
          </div>
        </header>

        <div className="nextLevel__titleBlock">
          <h2 className="title nextLevel__title">{cfg.title}</h2>
          <p className="subtitle nextLevel__subtitle">{cfg.hint}</p>
        </div>

        <div className="start__terminalBody nextLevel__terminalBody">
          {terminalLines.map((_, i) => {
                const showCursor =
              (!isTypingDone && i === activeLine) ||
              (isTypingDone && i === terminalLines.length - 1);
            const text = displayedLines[i];

            return (
              <p key={i} className="start__log nextLevel__logLine">
                <span className="nextLevel__prompt">{">"}</span>
                <span className="nextLevel__logText">
                  {text || "\u00A0"}
                  {showCursor && <span className="nextLevel__cursor">█</span>}
                </span>
              </p>
            );
          })}
        </div>

        <div className="nextLevel__actions">
          <button
            className="btn btn--primary"
            type="button"
            onClick={() => {
              play("coin");
              navigate(
                `/loading?to=${encodeURIComponent(
                  cfg.primaryTo,
                )}&label=NEXT%20LEVEL&ms=400`,
              );
            }}
          >
            <p className="nextLevel__textBtn">{cfg.primaryText}</p>
          </button>

          <button
            className="btn btn--secondary"
            type="button"
            onClick={() => {
              play("click");
              navigate(
                `/loading?to=${encodeURIComponent(
                  cfg.secondaryTo,
                )}&label=SAVING&ms=350`,
              );
            }}
          >
            <p className="nextLevel__textBtn">{cfg.secondaryText}</p>
          </button>
        </div>

        <p className="nextLevel__footer">
          INSERT COIN ▸ <span className="nextLevel__blink">READY</span>
        </p>
      </div>
    </div>
  );
}
