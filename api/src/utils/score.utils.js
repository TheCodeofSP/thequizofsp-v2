export function normalizePseudo(pseudo) {
  return String(pseudo ?? "").trim();
}

export function computeFinalScore({
  scoreQuiz1,
  scoreQuiz2,
  playedDouble,
  doubleWon,
}) {
  const base = scoreQuiz1 + scoreQuiz2;

  if (!playedDouble) {
    return base;
  }

  return doubleWon ? base * 2 : 0;
}