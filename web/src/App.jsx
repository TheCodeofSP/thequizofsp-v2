import { Navigate, Route, Routes } from "react-router-dom";

import StartPage from "./pages/StartPage.jsx";
import Quiz1Page from "./pages/Quiz1Page.jsx";
import Quiz2Page from "./pages/Quiz2Page.jsx";
import Quiz3Page from "./pages/Quiz3Page.jsx";
import NextLevelPage from "./pages/NextLevelPage.jsx";
import DoublePage from "./pages/DoublePage.jsx";
import ResultPage from "./pages/ResultPage.jsx";
import LeaderboardPage from "./pages/LeaderboardPage.jsx";
import LoadingPage from "./pages/LoadingPage.jsx";

import Footer from "./components/Footer.jsx";
import GameRoute from "./components/GameRoute.jsx";
import SoundToggle from "./components/SoundToggle.jsx";

const protectedPage = (page) => <GameRoute>{page}</GameRoute>;

export default function App() {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Aller au contenu</a>
      <header className="site-header" aria-label="En-tête du jeu">
        <a className="site-header__brand" href="/">THE QUIZ OF SP</a>
        <SoundToggle />
      </header>
      <main id="main-content">
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/quiz-1" element={protectedPage(<Quiz1Page />)} />
          <Route path="/next-level" element={protectedPage(<NextLevelPage />)} />
          <Route path="/quiz-2" element={protectedPage(<Quiz2Page />)} />
          <Route path="/double" element={protectedPage(<DoublePage />)} />
          <Route path="/quiz-3" element={protectedPage(<Quiz3Page />)} />
          <Route path="/result" element={protectedPage(<ResultPage />)} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/loading" element={<LoadingPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
