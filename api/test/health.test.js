import test from "node:test";
import assert from "node:assert/strict";

test("GET /health répond sans connexion obligatoire à MongoDB", async () => {
  process.env.CLIENT_URL = "http://localhost:5173";
  const { default: app } = await import("../src/app.js");
  const server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));

  try {
    const { port } = server.address();
    const response = await fetch(`http://127.0.0.1:${port}/health`);
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.ok, true);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
