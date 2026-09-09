const RUN_ID_PATTERN = /^[a-zA-Z0-9-]{8,80}$/;

export function validateScorePayload(payload = {}) {
  const errors = {};
  const runId = String(payload.runId ?? "").trim();
  const pseudo = String(payload.pseudo ?? "").trim().replace(/\s+/g, " ");
  const scoreQuiz1 = Number(payload.scoreQuiz1);
  const scoreQuiz2 = Number(payload.scoreQuiz2);
  const playedDouble = payload.playedDouble === true;
  const doubleWon = playedDouble && payload.doubleWon === true;

  if (!RUN_ID_PATTERN.test(runId)) {
    errors.runId = "Identifiant de partie invalide.";
  }

  if (pseudo.length < 1 || pseudo.length > 30) {
    errors.pseudo = "Le pseudo doit contenir entre 1 et 30 caractères.";
  }

  if (!Number.isInteger(scoreQuiz1) || scoreQuiz1 < 0 || scoreQuiz1 > 5) {
    errors.scoreQuiz1 = "Le score du niveau 1 doit être compris entre 0 et 5.";
  }

  if (!Number.isInteger(scoreQuiz2) || scoreQuiz2 < 0 || scoreQuiz2 > 20) {
    errors.scoreQuiz2 = "Le score du niveau 2 doit être compris entre 0 et 20.";
  }

  if (Object.keys(errors).length) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: { runId, pseudo, scoreQuiz1, scoreQuiz2, playedDouble, doubleWon },
  };
}
