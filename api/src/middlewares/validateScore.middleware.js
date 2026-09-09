import { validateScorePayload } from "../schemas/score.schema.js";

export function validateScore(req, res, next) {
  const result = validateScorePayload(req.body);

  if (!result.ok) {
    return res.status(400).json({
      message: "Données de score invalides.",
      errors: result.errors,
    });
  }

  req.validatedScore = result.data;
  return next();
}
