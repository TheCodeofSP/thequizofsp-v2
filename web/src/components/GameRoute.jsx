import { Navigate, useLocation } from "react-router-dom";
import { hasActiveRun } from "../services/quizSession.js";

export default function GameRoute({ children }) {
  const location = useLocation();
  return hasActiveRun() ? children : <Navigate to="/" replace state={{ interruptedAt: location.pathname }} />;
}
