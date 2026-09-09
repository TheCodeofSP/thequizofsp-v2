import express from "express";
import { createScore, fetchScores } from "../controllers/score.controller.js";
import { validateScore } from "../middlewares/validateScore.middleware.js";

const router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     ScoreCreateRequest:
 *       type: object
 *       required:
 *         - runId
 *         - pseudo
 *         - scoreQuiz1
 *         - scoreQuiz2
 *       properties:
 *         runId:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         pseudo:
 *           type: string
 *           example: "Sophie"
 *         scoreQuiz1:
 *           type: integer
 *           minimum: 0
 *           maximum: 5
 *           example: 4
 *         scoreQuiz2:
 *           type: integer
 *           minimum: 0
 *           maximum: 20
 *           example: 7
 *         playedDouble:
 *           type: boolean
 *           example: true
 *         doubleWon:
 *           type: boolean
 *           example: true
 *
 *     ScoreResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         pseudo:
 *           type: string
 *         scoreQuiz1:
 *           type: integer
 *         scoreQuiz2:
 *           type: integer
 *         playedDouble:
 *           type: boolean
 *         doubleWon:
 *           type: boolean
 *         finalScore:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @openapi
 * /api/scores:
 *   post:
 *     summary: Enregistrer un score final
 *     tags:
 *       - Scores
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ScoreCreateRequest"
 *     responses:
 *       201:
 *         description: Score enregistré
 *       400:
 *         description: Données invalides
 *       409:
 *         description: Score déjà enregistré
 *       500:
 *         description: Erreur serveur
 */
router.post("/", validateScore, createScore);

/**
 * @openapi
 * /api/scores:
 *   get:
 *     summary: Récupérer le leaderboard
 *     tags:
 *       - Scores
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 20
 *         description: Nombre de scores à retourner
 *     responses:
 *       200:
 *         description: Liste des scores triés par score décroissant
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/ScoreResponse"
 *       500:
 *         description: Erreur serveur
 */
router.get("/", fetchScores);

export default router;
