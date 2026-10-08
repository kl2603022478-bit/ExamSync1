// Runs when no route matched the request.
const notFound = (req, res, next) => {
    res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found.` });
};

// Catch-all for any error that a controller didn't handle itself.
// (Express 5 automatically forwards errors from async handlers here.)
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message });
};

module.exports = { notFound, errorHandler };
