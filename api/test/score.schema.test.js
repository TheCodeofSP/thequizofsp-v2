import test from "node:test";
import assert from "node:assert/strict";
import { validateScorePayload } from "../src/schemas/score.schema.js";

const valid = { runId: "550e8400-e29b-41d4-a716-446655440000", pseudo: "Player One", scoreQuiz1: 4, scoreQuiz2: 18, playedDouble: true, doubleWon: true };

test("accepte un score valide", () => {
  const result = validateScorePayload(valid);
  assert.equal(result.ok, true);
  assert.equal(result.data.pseudo, "Player One");
});

test("refuse les scores impossibles", () => {
  const result = validateScorePayload({ ...valid, scoreQuiz2: 21 });
  assert.equal(result.ok, false);
  assert.match(result.errors.scoreQuiz2, /0 et 20/);
});

test("force doubleWon à false si le niveau final n'a pas été joué", () => {
  const result = validateScorePayload({ ...valid, playedDouble: false, doubleWon: true });
  assert.equal(result.data.doubleWon, false);
});
