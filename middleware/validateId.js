// Usage: router.delete('/:id', validateId('user'), deleteUser)
// Rejects the request early if :id is missing or not a number.
const validateId = (entityName) => (req, res, next) => {
    const { id } = req.params;

    if (!id || isNaN(id)) {
        return res.status(400).json({ error: `Valid ${entityName} ID is required.` });
    }

    next();
};

module.exports = validateId;
