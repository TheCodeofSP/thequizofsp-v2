import { useNavigate } from "react-router-dom";
import { useSfx } from "../hooks/useSfx.js";
import {
  getBaseScore,
  setDoubleWon,
  setPlayedDouble,
} from "../services/quizSession.js";
import "./DoublePage.scss";

export default function DoublePage() {
  const navigate = useNavigate();
  const { play } = useSfx();

  const baseScore = getBaseScore();

  function handleQuit() {
    play("click");
    setPlayedDouble(false);
    setDoubleWon(false);
    navigate("/result");
  }

  function handleDouble() {
    play("coin");
    navigate("/quiz-3");
  }

  return (
    <div className="container double">
      <div className="card double__card">
        <header className="double__hud">
          <span>FINAL ROUND</span>
          <span className="double__score">{baseScore} PTS</span>
        </header>

        <h2 className="title double__title">QUITTE OU DOUBLE</h2>

        <p className="double__warning">
          Bonne réponse au LEVEL 3 = score x2 • Mauvaise réponse = score perdu
        </p>


        <div className="double__actions">
          <button
            className="btn btn--primary"
            type="button"
            onClick={handleDouble}
          >
            TENTER LE LEVEL 3
          </button>

          <button
            className="btn btn--secondary"
            type="button"
            onClick={handleQuit}
          >
            QUITTER AVEC MON SCORE
          </button>
        </div>
      </div>
    </div>
  );
}
