export function notFound(req, res) {
  res.status(404).json({ message: "Route introuvable." });
}

export function errorHandler(error, req, res, next) {
  void req;
  void next;

  const statusCode = Number(error.statusCode) || 500;

  if (statusCode >= 500) {
    console.error("API error:", error);
  }

  res.status(statusCode).json({
    message:
      statusCode >= 500
        ? "Le service est momentanément indisponible. Réessaie dans quelques instants."
        : error.message,
  });
}
