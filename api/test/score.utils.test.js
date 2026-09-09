import test from "node:test";
import assert from "node:assert/strict";
import { computeFinalScore, normalizePseudo } from "../src/utils/score.utils.js";

test("calcule un score sécurisé", () => {
  assert.equal(computeFinalScore({ scoreQuiz1: 5, scoreQuiz2: 16, playedDouble: false, doubleWon: false }), 21);
});

test("double un score après une finale gagnée", () => {
  assert.equal(computeFinalScore({ scoreQuiz1: 5, scoreQuiz2: 20, playedDouble: true, doubleWon: true }), 50);
});

test("annule un score après une finale perdue", () => {
  assert.equal(computeFinalScore({ scoreQuiz1: 5, scoreQuiz2: 20, playedDouble: true, doubleWon: false }), 0);
});

test("nettoie les espaces externes d'un pseudo", () => {
  assert.equal(normalizePseudo("  SP  "), "SP");
});
