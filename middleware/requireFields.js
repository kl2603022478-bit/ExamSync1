// Usage: router.post('/', requireFields(['email', 'password'], 'Email and password are required.'), handler)
// Rejects the request early if any listed field is missing/empty in req.body.
const requireFields = (fields, message) => (req, res, next) => {
    const body = req.body || {};
    const missing = fields.some((field) => !body[field]);

    if (missing) {
        return res.status(400).json({ error: message });
    }

    next();
};

module.exports = requireFields;
