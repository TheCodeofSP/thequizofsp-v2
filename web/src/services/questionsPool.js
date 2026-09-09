import { shuffleArray } from "../utils/shuffle.js";

function readPool(key) {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writePool(key, value) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

export function getNextQuestions(poolKey, questions, count) {
  if (!Array.isArray(questions) || questions.length === 0) return [];

  let remainingIds = readPool(poolKey);

  const allIds = questions.map((q) => q.id);

  const isPoolValid =
    Array.isArray(remainingIds) &&
    remainingIds.every((id) => allIds.includes(id));

  if (!isPoolValid || remainingIds.length < count) {
    const freshShuffledIds = shuffleArray(allIds);

    if (Array.isArray(remainingIds) && remainingIds.length > 0) {
      const missingIds = freshShuffledIds.filter(
        (id) => !remainingIds.includes(id),
      );
      remainingIds = [...remainingIds, ...missingIds];
    } else {
      remainingIds = freshShuffledIds;
    }
  }

  const selectedIds = remainingIds.slice(0, count);
  const nextRemainingIds = remainingIds.slice(count);

  writePool(poolKey, nextRemainingIds);

  return selectedIds
    .map((id) => questions.find((q) => q.id === id))
    .filter(Boolean);
}

export function getNextQuestion(poolKey, questions) {
  return getNextQuestions(poolKey, questions, 1)[0] ?? null;
}

export function resetQuestionPool(poolKey) {
  sessionStorage.removeItem(poolKey);
}