import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSfx } from "../hooks/useSfx.js";
import finalQuestions from "../data/finalQuestion.json";
import { getNextQuestion } from "../services/questionsPool.js";

import {
  getBaseScore,
  setDoubleWon,
  setPlayedDouble,
} from "../services/quizSession.js";
import "./Quiz3Page.scss";

function normalize(str) {
  return String(str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

export default function Quiz3Page() {
  const navigate = useNavigate();
  const { play } = useSfx();

  const finalQuestion = useMemo(() => {
    return getNextQuestion("quiz3_pool", finalQuestions);
  }, []);

  const [answer, setAnswer] = useState("");
  const [locked, setLocked] = useState(false);
  const [result, setResult] = useState(null);

  const baseScore = getBaseScore();

  function checkAnswer() {
    if (locked || !finalQuestion) return;

    const userAnswer = normalize(answer);

    const isCorrect = finalQuestion.answers.some(
      (item) => normalize(item) === userAnswer,
    );

    setLocked(true);
    setPlayedDouble(true);

    if (isCorrect) {
      setDoubleWon(true);
      setResult("win");
      play("win");
    } else {
      setDoubleWon(false);
      setResult("lose");
      play("lose");
    }

    setTimeout(() => {
      navigate("/result");
    }, 1400);
  }

  if (!finalQuestion) {
    return (
      <div className="container quiz3">
        <div className="card quiz3__card">
          <p>Aucune question finale disponible.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container quiz3">
      <div className="card quiz3__card">
        <header className="quiz3__hud">
          <span>LEVEL 3</span>
          <span className="quiz3__score">{baseScore} PTS</span>
        </header>

        <h2 className="title quiz3__title">FINAL BOSS</h2>

        <p className="quiz3__warning">
          ⚠️ Bonne réponse = Score x2 • Mauvaise = Score x0
        </p>

        <div className="quiz3__questionBlock">
          <p className="quiz3__question">{finalQuestion.question}</p>

          <div className="quiz3__inputRow">
            <span className="quiz3__prompt">{">"}</span>
            <input
              className="input quiz3__input"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={locked}
              placeholder="TA RÉPONSE..."
            />
          </div>
        </div>

        <div className="quiz3__actions">
          <button
            className="btn btn--primary"
            type="button"
            onClick={checkAnswer}
            disabled={!answer.trim() || locked}
          >
            VALIDER
          </button>
        </div>

        {result === "win" && (
          <p className="quiz3__result quiz3__result--win">JACKPOT x2 🎉</p>
        )}
        {result === "lose" && (
          <p className="quiz3__result quiz3__result--lose">GAME OVER 💀</p>
        )}
      </div>
    </div>
  );
}
