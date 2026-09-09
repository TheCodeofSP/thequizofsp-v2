import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSfx } from "../hooks/useSfx.js";
import { getPlayerName, startNewRun } from "../services/quizSession.js";
import "./StartPage.scss";

const TYPE_SPEED = 18;
const LINE_DELAY = 120;

export default function StartPage() {
  const navigate = useNavigate();
  const { play } = useSfx();
  const [pseudo, setPseudo] = useState(() => getPlayerName());
  const typingTimeoutsRef = useRef([]);

  const terminalLines = useMemo(
    () => [
      "BOOTING PLAYER PROFILE...",
      "LOADING QUIZ MODULES...",
      "LEVEL 1 : 5 QCM | +1 XP PAR BONNE RÉPONSE",
      "LEVEL 2 : 10 QCM | 10s PAR QUESTION | +2 XP PAR BONNE RÉPONSE",
      "LEVEL 3 : FINAL BOSS | 1 QUESTION QUITTE OU DOUBLE",
      "WARNING : MAUVAISE RÉPONSE = SCORE FINAL PERDU",
      "ONLINE LEADERBOARD ACTIVÉ",
      "ENTRE TON PSEUDO POUR COMMENCER",
    ],
    [],
  );

  const [displayedLines, setDisplayedLines] = useState(
    terminalLines.map(() => ""),
  );
  const [activeLine, setActiveLine] = useState(0);
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [visibleFormStep, setVisibleFormStep] = useState(0);

  useEffect(() => {
    typingTimeoutsRef.current.forEach(clearTimeout);
    typingTimeoutsRef.current = [];

    let lineIndex = 0;
    let charIndex = 0;

    function schedule(fn, delay) {
      const id = setTimeout(fn, delay);
      typingTimeoutsRef.current.push(id);
      return id;
    }

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
        schedule(typeNextChar, TYPE_SPEED);
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
      schedule(typeNextChar, LINE_DELAY);
    }

    schedule(typeNextChar, 200);

    return () => {
      typingTimeoutsRef.current.forEach(clearTimeout);
      typingTimeoutsRef.current = [];
    };
  }, [terminalLines]);

  useEffect(() => {
    if (!isTypingDone) return;

    const timers = [
      setTimeout(() => setVisibleFormStep(1), 120),
      setTimeout(() => setVisibleFormStep(2), 260),
      setTimeout(() => setVisibleFormStep(3), 420),
      setTimeout(() => setVisibleFormStep(4), 560),
      setTimeout(() => setVisibleFormStep(5), 720),
    ];

    return () => timers.forEach(clearTimeout);
  }, [isTypingDone]);

  function onStart(e) {
    e.preventDefault();
    const name = pseudo.trim();

    if (!name) return;

    play("coin");
    startNewRun(name);

    navigate("/loading?to=/quiz-1&label=BOOTING&ms=450");
  }

  function finishBootInstantly() {
    if (isTypingDone) return;

    typingTimeoutsRef.current.forEach(clearTimeout);
    typingTimeoutsRef.current = [];

    setDisplayedLines([...terminalLines]);
    setActiveLine(terminalLines.length - 1);
    setIsTypingDone(true);
    setVisibleFormStep(5);
  }

  return (
    <div className="container start" onClick={finishBootInstantly}>
      <div className="card start__card">
        <header className="start__hud">
          <div className="start__hudLeft">
            <div className="start__hudLine">
              <span className="start__hudLabel">STATUT</span>
              <span className="start__hudValue start__hudValue--ok">READY</span>
            </div>
            <div className="start__hudLine">
              <span className="start__hudLabel">MODE</span>
              <span className="start__hudValue">ARCADE QUIZ</span>
            </div>
          </div>

          <div className="start__hudRight">
            <div className="start__hudLine">
              <span className="start__hudLabel">VERSION</span>
              <span className="start__hudValue">V2</span>
            </div>
            <div className="start__hudLine">
              <span className="start__hudLabel">RANK</span>
              <span className="start__hudValue">ROOKIE</span>
            </div>
          </div>
        </header>

        <div className="start__titleWrap">
          <h1 className="title start__title">THE QUIZ OF SP*</h1>
          <p className="subtitle start__subtitle">Qui se cache derrière SP ?</p>
          <p className="start__version">
            3 LEVELS • QCM • FINAL BOSS • LEADERBOARD
          </p>
        </div>

        <div className="start__terminal">
          <div className="start__terminalTop">
            <span className="start__terminalDot start__terminalDot--a" />
            <span className="start__terminalDot start__terminalDot--b" />
            <span className="start__terminalDot start__terminalDot--c" />
            <span className="start__terminalTitle">BOOT SEQUENCE</span>
          </div>

          <div className="start__terminalBody start__terminalBody--fixed">
            <div className="start__terminalLogs">
              {terminalLines.map((_, i) => {
                const showCursor =
                  (!isTypingDone && i === activeLine) ||
                  (isTypingDone && i === terminalLines.length - 1);
                const text = displayedLines[i];

                return (
                  <p key={i} className="start__log start__logLine">
                    <span className="start__prompt">{">"}</span>
                    <span className="start__logText">
                      {text || "\u00A0"}
                      {showCursor && <span className="start__cursor">█</span>}
                    </span>
                  </p>
                );
              })}
              {!isTypingDone && (
                <p className="start__skipHint">CLICK/TOUCH ANYWHERE TO SKIP</p>
              )}
            </div>

            <div className="start__formWrap">
              <form className="start__form" onSubmit={onStart}>
                <div
                  className={`start__formItem ${
                    visibleFormStep >= 1 ? "start__formItem--visible" : ""
                  }`}
                >
                  <label className="start__label" htmlFor="pseudo">
                    Entre ton pseudo
                  </label>
                </div>

                <div
                  className={`start__formItem ${
                    visibleFormStep >= 2 ? "start__formItem--visible" : ""
                  }`}
                >
                  <div className="start__inputRow">
                    <span className="start__prompt">{">"}</span>
                    <input
                      id="pseudo"
                      className="input start__input"
                      value={pseudo}
                      onChange={(e) => setPseudo(e.target.value)}
                      placeholder="EX : Jackiee"
                      maxLength={30}
                      autoComplete="nickname"
                      disabled={visibleFormStep < 2}
                      required
                      aria-describedby="pseudo-help"
                    />
                  </div>
                </div>

                <div
                  className={`start__formItem ${
                    visibleFormStep >= 3 ? "start__formItem--visible" : ""
                  }`}
                >
                  <p className="start__log blink">{">"} PRESS START</p>
                </div>

                <div
                  className={`start__formItem ${
                    visibleFormStep >= 4 ? "start__formItem--visible" : ""
                  }`}
                >
                  <div className="start__actions">
                    <button
                      className="btn btn--primary start__startBtn"
                      type="submit"
                      disabled={visibleFormStep < 4}
                    >
                      START
                    </button>

                    <button
                      className="btn btn--secondary start__secondaryBtn"
                      type="button"
                      disabled={visibleFormStep < 4}
                      onClick={() => {
                        play("click");
                        navigate("/leaderboard");
                      }}
                    >
                      LEADERBOARD
                    </button>
                  </div>
                </div>

                <div
                  className={`start__formItem ${
                    visibleFormStep >= 5 ? "start__formItem--visible" : ""
                  }`}
                >
                  <p id="pseudo-help" className="start__hint">30 caractères maximum. Ce pseudo apparaîtra dans le classement.</p>
                </div>
              </form>
            </div>
          </div>
        </div>

        <footer className="start__footer">
          <span className="badge start__badge">TIP: TRY TO GO LEVEL 3</span>
          <span className="start__coin">INSERT COIN ▸</span>
        </footer>
      </div>
    </div>
  );
}
