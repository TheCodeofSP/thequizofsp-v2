import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getScores } from "../services/api.js";
import { useSfx } from "../hooks/useSfx.js";
import { getPlayerName, startNewRun } from "../services/quizSession.js";
import "./LeaderboardPage.scss";

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const { play } = useSfx();

  const [scores, setScores] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const pseudo = getPlayerName();

  useEffect(() => {
    loadScores();
  }, []);

  async function loadScores() {
      try {
        setLoading(true);
        setError("");
        const data = await getScores(10);
        setScores(data);
      } catch (e) {
        setError(e.message || "Erreur");
      } finally {
        setLoading(false);
      }
  }

  const ranked = useMemo(() => {
    return scores.map((s, idx) => ({ ...s, rank: idx + 1 }));
  }, [scores]);

  return (
    <div className="container leaderboard">
      <div className="card leaderboard__card">
        <header className="leaderboard__hud">
          <div className="leaderboard__hudLeft">
            <h2 className="title leaderboard__title">LEADERBOARD</h2>
            <p className="subtitle leaderboard__subtitle">
              TOP 10 • ARCADE BOARD
            </p>
          </div>
        </header>

        {loading && <p className="leaderboard__loading" role="status">LOADING…</p>}
        {error && <div className="status-panel status-panel--error" role="alert"><p>{error}</p><button className="btn btn--secondary" type="button" onClick={loadScores}>RÉESSAYER</button></div>}

        {!loading && !error && (
          <ol className="leaderboard__list">
            {ranked.map((s) => {
              const isMe =
                pseudo && s.pseudo?.toLowerCase() === pseudo.toLowerCase();
              const isTop1 = s.rank === 1;
              const isTop2 = s.rank === 2;
              const isTop3 = s.rank === 3;

              const cls = [
                "leaderboard__item",
                isMe ? "leaderboard__item--me" : "",
                isTop1 ? "leaderboard__item--top1" : "",
                isTop2 ? "leaderboard__item--top2" : "",
                isTop3 ? "leaderboard__item--top3" : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
              <li key={s._id || `${s.pseudo}-${s.createdAt}`} className={cls}>
                  <span className="leaderboard__rank">
                    #{String(s.rank).padStart(2, "0")}
                  </span>

                  <span className="leaderboard__name">{s.pseudo}</span>

                  <div className="leaderboard__meta">
                    {s.playedDouble && (
                      <span
                        className={`leaderboard__badge ${
                          s.doubleWon
                            ? "leaderboard__badge--win"
                            : "leaderboard__badge--lose"
                        }`}
                      >
                        {s.doubleWon ? "x2" : "LOST"}
                      </span>
                    )}

                    <span className="leaderboard__score">
                      {s.finalScore} PTS
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        )}

        <div className="double__actions">
          <button
            className="btn btn--primary"
            type="button"
            onClick={() => {
              play("coin");
              if (pseudo) {
                startNewRun(pseudo);
                navigate("/quiz-1");
              } else {
                navigate("/");
              }
            }}
          >
            PLAY
          </button>
          <button
            className="btn btn--primary"
            type="button"
            onClick={() => {
              play("click");
              navigate("/");
            }}
          >
            HOME
          </button>
        </div>

        <footer className="leaderboard__footer">
          <span className="leaderboard__tip">TIP: GO LEVEL 3 FOR ALL-IN</span>
        </footer>
      </div>
    </div>
  );
}
