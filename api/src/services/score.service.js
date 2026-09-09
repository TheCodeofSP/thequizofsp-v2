import Score from "../models/score.model.js";
import { normalizePseudo, computeFinalScore } from "../utils/score.utils.js";

function createHttpError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

export async function saveScore(payload) {
  const runId = String(payload.runId ?? "").trim();
  const pseudo = normalizePseudo(payload.pseudo);

  const scoreQuiz1 = Number(payload.scoreQuiz1);
  const scoreQuiz2 = Number(payload.scoreQuiz2);

  const playedDouble = payload.playedDouble === true;
  const doubleWon = payload.doubleWon === true;

  if (!runId) {
    throw createHttpError("runId requis.", 400);
  }

  if (!pseudo) {
    throw createHttpError("Pseudo requis.", 400);
  }

  if (!Number.isInteger(scoreQuiz1) || scoreQuiz1 < 0 || scoreQuiz1 > 5) {
    throw createHttpError("scoreQuiz1 invalide (0-5).", 400);
  }

  if (!Number.isInteger(scoreQuiz2) || scoreQuiz2 < 0 || scoreQuiz2 > 20) {
    throw createHttpError("scoreQuiz2 invalide (0-20).", 400);
  }

  const safeDoubleWon = playedDouble ? doubleWon : false;

  const finalScore = computeFinalScore({
    scoreQuiz1,
    scoreQuiz2,
    playedDouble,
    doubleWon: safeDoubleWon,
  });

  try {
    const savedScore = await Score.findOneAndUpdate(
      { runId },
      {
        runId,
        pseudo,
        scoreQuiz1,
        scoreQuiz2,
        playedDouble,
        doubleWon: safeDoubleWon,
        finalScore,
      },
      {
        returnDocument: "after",
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      },
    );

    return {
      id: savedScore._id,
      runId: savedScore.runId,
      pseudo: savedScore.pseudo,
      finalScore: savedScore.finalScore,
    };
  } catch (error) {
    if (error?.code === 11000) {
      throw createHttpError("Ce score a déjà été enregistré.", 409);
    }

    throw error;
  }
}

export async function getLeaderboard(limitQuery) {
  const limitRaw = Number(limitQuery ?? 20);

  const limit = Number.isFinite(limitRaw)
    ? Math.trunc(Math.min(Math.max(limitRaw, 1), 50))
    : 20;

  const scores = await Score.find({ finalScore: { $exists: true } })
    .sort({ finalScore: -1, createdAt: 1 })
    .limit(limit)
    .select(
      "pseudo scoreQuiz1 scoreQuiz2 playedDouble doubleWon finalScore createdAt",
    );

  return scores.map((score) => score.toObject());
}
