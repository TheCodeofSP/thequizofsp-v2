const STORAGE_KEY = "thequizofsp:game:v2";

const EMPTY_GAME = Object.freeze({ runId: "", playerName: "", scoreQuiz1: 0, scoreQuiz2: 0, playedDouble: false, doubleWon: false, abandonedRun: false, step: "home" });

function storage() { return typeof window === "undefined" ? null : window.localStorage; }

function readLegacyGame(store) {
  const runId = store.getItem("runId") || "";
  if (!runId) return null;
  return { runId, playerName: store.getItem("playerName") || "", scoreQuiz1: Number(store.getItem("scoreQuiz1") || 0), scoreQuiz2: Number(store.getItem("scoreQuiz2") || 0), playedDouble: store.getItem("playedDouble") === "true", doubleWon: store.getItem("doubleWon") === "true", abandonedRun: store.getItem("abandonedRun") === "true", step: "result" };
}

export function readGame() {
  const store = storage();
  if (!store) return { ...EMPTY_GAME };
  try {
    const current = JSON.parse(store.getItem(STORAGE_KEY));
    if (current?.runId) return { ...EMPTY_GAME, ...current };
    const legacy = readLegacyGame(store);
    if (legacy) { store.setItem(STORAGE_KEY, JSON.stringify(legacy)); return { ...EMPTY_GAME, ...legacy }; }
  } catch { store.removeItem(STORAGE_KEY); }
  return { ...EMPTY_GAME };
}

function updateGame(patch) {
  const next = { ...readGame(), ...patch };
  storage()?.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function startNewRun(playerName) {
  const next = { ...EMPTY_GAME, runId: crypto.randomUUID(), playerName: String(playerName || "").trim().replace(/\s+/g, " "), step: "quiz-1" };
  storage()?.setItem(STORAGE_KEY, JSON.stringify(next));
  return next.runId;
}

export const getRunId = () => readGame().runId;
export const getPlayerName = () => readGame().playerName;
export const getScoreQuiz1 = () => readGame().scoreQuiz1;
export const getScoreQuiz2 = () => readGame().scoreQuiz2;
export const getPlayedDouble = () => readGame().playedDouble;
export const getDoubleWon = () => readGame().doubleWon;
export const getAbandonedRun = () => readGame().abandonedRun;
export const getBaseScore = () => getScoreQuiz1() + getScoreQuiz2();

export function setQuiz1Score(score) { updateGame({ scoreQuiz1: Number(score), step: "transition-1" }); }
export function setQuiz2Score(score) { updateGame({ scoreQuiz2: Number(score), step: "transition-2" }); }
export function setPlayedDouble(value) { updateGame({ playedDouble: Boolean(value) }); }
export function setDoubleWon(value) { updateGame({ doubleWon: Boolean(value), step: "result" }); }
export function markStep(step) { updateGame({ step }); }
export function hasActiveRun() { const game = readGame(); return Boolean(game.runId && game.playerName); }

export function abandonRun() {
  updateGame({ scoreQuiz1: 0, scoreQuiz2: 0, playedDouble: false, doubleWon: false, abandonedRun: true, step: "result" });
}

export function computeFinalScore(game = readGame()) {
  if (game.abandonedRun) return 0;
  const base = Number(game.scoreQuiz1) + Number(game.scoreQuiz2);
  if (!game.playedDouble) return base;
  return game.doubleWon ? base * 2 : 0;
}

export function getScorePayload() {
  const game = readGame();
  return { runId: game.runId, pseudo: game.playerName, scoreQuiz1: game.scoreQuiz1, scoreQuiz2: game.scoreQuiz2, playedDouble: game.playedDouble, doubleWon: game.doubleWon };
}
