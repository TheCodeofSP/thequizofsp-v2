import { connectDB } from "../config/db.js";
import { saveScore, getLeaderboard } from "../services/score.service.js";

function sendError(res, error) {
  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    message:
      statusCode === 500
        ? "Impossible de contacter la base de données. Réessaie dans quelques instants."
        : error.message,
  });
}

export async function createScore(req, res) {
  try {
    await connectDB();

    const data = await saveScore(req.validatedScore);

    return res.status(201).json({
      message: "Score enregistré",
      data,
    });
  } catch (error) {
    return sendError(res, error);
  }
}

export async function fetchScores(req, res) {
  try {
    await connectDB();

    const scores = await getLeaderboard(req.query.limit);

    return res.status(200).json(scores);
  } catch (error) {
    return sendError(res, error);
  }
}
