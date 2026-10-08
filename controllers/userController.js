const bcrypt = require('bcrypt');
const { pool } = require('../config/db');

// GET /api/users - Fetch all users
exports.getUsers = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                user_id AS id, 
                full_name AS name, 
                email, 
                role, 
                student_id AS studentMatricNo 
            FROM users 
            ORDER BY user_id ASC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /api/users - Add a new user with hashed password
exports.createUser = async (req, res) => {
    const { fullName, email, password, role, studentId } = req.body;

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const [result] = await pool.query(
            'INSERT INTO users (full_name, email, password, role, student_id) VALUES (?, ?, ?, ?, ?)',
            [fullName, email, hashedPassword, role, studentId || null]
        );

        const newUser = {
            id: result.insertId,
            name: fullName,
            email,
            role,
            studentMatricNo: studentId || null
        };

        res.status(201).json({ message: 'User created successfully in database', user: newUser });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Email address is already registered.' });
        }
        res.status(500).json({ error: err.message });
    }
};

// DELETE /api/users/:id - Delete a user account
exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.query('DELETE FROM users WHERE user_id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `User with ID ${id} not found.` });
        }

        return res.status(200).json({ success: true, message: `User #${id} deleted successfully.` });
    } catch (err) {
        if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.code === 'ER_ROW_IS_REFERENCED') {
            return res.status(409).json({
                error: 'Cannot delete user because they have related records (results or registrations) in the database.'
            });
        }
        return res.status(500).json({ error: err.message });
    }
};
