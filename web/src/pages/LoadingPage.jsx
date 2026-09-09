import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSfx } from "../hooks/useSfx.js";
import "./LoadingPage.scss";

export default function LoadingPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { play } = useSfx();

  const to = params.get("to") || "/";
  const label = params.get("label") || "LOADING";
  const ms = Number(params.get("ms") || 400);

  const safeTo = useMemo(() => {
    // Sécurise: autoriser uniquement des paths internes
    if (!to.startsWith("/")) return "/";
    return to;
  }, [to]);

  useEffect(() => {
    // Petit son rétro (si audio déjà autorisé)
    play("coin");

    const t = setTimeout(() => {
      navigate(safeTo, { replace: true });
    }, ms);

    return () => clearTimeout(t);
  }, [ms, navigate, play, safeTo]);

  return (
    <div className="container loading">
      <div className="card loading__card">
        <header className="loading__hud">
          <span className="loading__hudText">SYSTEM</span>
          <span className="loading__hudText loading__hudText--ok">ONLINE</span>
        </header>

        <div className="loading__center">
          <h2 className="title loading__title">{label}</h2>
          <p className="loading__sub">PLEASE WAIT…</p>

          <div className="loading__bar" aria-hidden="true">
            <span className="loading__barFill" />
          </div>

          <p className="loading__hint">
            TIP: GO LEVEL 3 FOR <span className="loading__x2">ALL-IN</span>
          </p>
        </div>

        <footer className="loading__footer">
          INSERT COIN ▸ <span className="loading__blink">READY</span>
        </footer>
      </div>
    </div>
  );
}