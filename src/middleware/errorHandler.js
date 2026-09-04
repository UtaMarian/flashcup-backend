function notFoundHandler(req, res) {
  res.status(404).json({ error: `Ruta ${req.method} ${req.originalUrl} nu există.` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Eroare internă de server." });
}

module.exports = { notFoundHandler, errorHandler };
