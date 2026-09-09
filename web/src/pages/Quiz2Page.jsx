import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import QuizRunner from "../components/QuizRunner.jsx";
import data from "../data/questions.json";
import { abandonRun, setQuiz2Score } from "../services/quizSession.js";
import "./Quiz2Page.scss";
import { getNextQuestions } from "../services/questionsPool.js";

export default function Quiz2Page() {
  const navigate = useNavigate();

  const shuffledQuestions = useMemo(() => {
    const list = Array.isArray(data.quiz2_hobbies) ? data.quiz2_hobbies : [];
    return getNextQuestions("quiz2_pool", list, 10);
  }, []);

  function handleComplete(score) {
    setQuiz2Score(score);
    navigate("/next-level?from=quiz-2");
  }

  function handleExit() {
    abandonRun();
    navigate("/result");
  }

  return (
    <div className="quizPage quizPage--q2">
      <QuizRunner
        title="LEVEL 2"
        subtitle="LEVEL 2 • 10 questions • 10s par question"
        questions={shuffledQuestions}
        secondsPerQuestion={10}
        pointsPerCorrect={2}
        onComplete={handleComplete}
        onExit={handleExit}
      />
    </div>
  );
}
