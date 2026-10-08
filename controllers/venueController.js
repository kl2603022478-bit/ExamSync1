const { pool } = require('../config/db');

// GET /api/venues
exports.getVenues = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                venue_id AS venueId, 
                venue_name AS name, 
                building, 
                capacity 
            FROM venues 
            ORDER BY venue_id ASC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /api/venues
exports.createVenue = async (req, res) => {
    const { name, building, capacity } = req.body;
if (!name || !building || !capacity) {
    return res.status(400).json({ error: 'Venue name, building and capacity are required.' });
}

    try {
        const [result] = await pool.query(
            'INSERT INTO venues (venue_name, building, capacity) VALUES (?, ?, ?)',
            [name, building, capacity]
        );
        res.status(201).json({ venueId: result.insertId, name, building, capacity });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE /api/venues/:id
exports.deleteVenue = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.query('DELETE FROM venues WHERE venue_id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `Venue with ID ${id} not found.` });
        }

        return res.status(200).json({ success: true, message: `Venue #${id} deleted successfully.` });
    } catch (err) {
        if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.code === 'ER_ROW_IS_REFERENCED') {
            return res.status(409).json({
                error: 'Cannot delete venue because related examination records exist in the database.'
            });
        }
        return res.status(500).json({ error: err.message });
    }
};
