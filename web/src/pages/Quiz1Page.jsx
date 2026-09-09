import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import QuizRunner from "../components/QuizRunner.jsx";
import data from "../data/questions.json";
import { abandonRun, setQuiz1Score } from "../services/quizSession.js";
import "./Quiz1Page.scss";
import { getNextQuestions } from "../services/questionsPool.js";

export default function Quiz1Page() {
  const navigate = useNavigate();

  const shuffledQuestions = useMemo(() => {
    const list = Array.isArray(data.quiz1_profile) ? data.quiz1_profile : [];
    return getNextQuestions("quiz1_pool", list, 5);
  }, []);

  function handleComplete(score) {
    setQuiz1Score(score);
    navigate("/next-level?from=quiz-1");
  }

  function handleExit() {
    abandonRun();
    navigate("/result");
  }

  return (
    <div className="quizPage quizPage--q1">
      <QuizRunner
        title="LEVEL 1"
        subtitle="LEVEL 1 : 5 QCM | +1 XP PAR BONNE RÉPONSE"
        questions={shuffledQuestions}
        secondsPerQuestion={null}
        pointsPerCorrect={1}
        onComplete={handleComplete}
        onExit={handleExit}
      />
    </div>
  );
}
