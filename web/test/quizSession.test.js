import test from "node:test";
import assert from "node:assert/strict";
import { computeFinalScore } from "../src/services/quizSession.js";

const game = { scoreQuiz1: 5, scoreQuiz2: 20, abandonedRun: false, playedDouble: false, doubleWon: false };

test("conserve le score quand le joueur quitte", () => {
  assert.equal(computeFinalScore(game), 25);
});

test("double le score quand le final boss est gagné", () => {
  assert.equal(computeFinalScore({ ...game, playedDouble: true, doubleWon: true }), 50);
});

test("remet le score à zéro quand le final boss est perdu", () => {
  assert.equal(computeFinalScore({ ...game, playedDouble: true }), 0);
});

test("remet le score à zéro quand une partie est abandonnée", () => {
  assert.equal(computeFinalScore({ ...game, abandonedRun: true }), 0);
});
