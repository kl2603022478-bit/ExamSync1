const bcrypt = require('bcrypt');
const { pool } = require('../config/db');

// POST /api/login - Authenticate user credentials against database
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await pool.query(
            `SELECT 
                user_id AS id, 
                full_name AS name, 
                email, 
                password,
                role, 
                student_id AS studentMatricNo 
            FROM users 
            WHERE LOWER(email) = LOWER(?)`,
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email address or password.' });
        }

        const user = rows[0];

        let isMatch = false;
        if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$')) {
            isMatch = await bcrypt.compare(password, user.password);
        } else {
            // Legacy plain-text passwords
            isMatch = (password === user.password);
        }

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email address or password.' });
        }

        delete user.password;
        res.json({ message: 'Login successful', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
