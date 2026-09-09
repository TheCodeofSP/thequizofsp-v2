const API_URL = String(import.meta.env.VITE_API_URL || "http://localhost:5050").replace(/\/$/, "");

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(`${API_URL}${path}`, { ...options, signal: controller.signal, headers: { "Content-Type": "application/json", ...options.headers } });
    const body = await response.json().catch(() => null);
    if (!response.ok) throw new Error(body?.message || `Erreur API (${response.status})`);
    return body;
  } catch (error) {
    if (error.name === "AbortError") throw new Error("Le serveur met trop de temps à répondre.");
    throw error;
  } finally { clearTimeout(timeout); }
}

export async function postScore(payload) {
  return request("/api/scores", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

}

export async function getScores(limit = 20) {
  return request(`/api/scores?limit=${encodeURIComponent(limit)}`);
}
