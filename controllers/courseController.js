const { pool } = require('../config/db');

// GET /api/courses
exports.getCourses = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                course_id AS id, 
                course_code AS code, 
                course_name AS title, 
                credit_hour AS credits, 
                faculty 
            FROM courses 
            ORDER BY course_id ASC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /api/courses
exports.createCourse = async (req, res) => {
    const { code, title, credits, faculty } = req.body || {};

    if (!code || !title) {
        return res.status(400).json({ error: 'Course code and title are required.' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO courses (course_code, course_name, credit_hour, faculty) VALUES (?, ?, ?, ?)',
            [code, title, credits || 3, faculty || 'Faculty of Computing']
        );
        res.status(201).json({ id: result.insertId, code, title, credits, faculty });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'A course with this code already exists.' });
        }
        res.status(500).json({ error: err.message });
    }
};

// DELETE /api/courses/:id
exports.deleteCourse = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.query('DELETE FROM courses WHERE course_id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `Course with ID ${id} not found.` });
        }

        return res.status(200).json({ success: true, message: `Course #${id} deleted successfully.` });
    } catch (err) {
        if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.code === 'ER_ROW_IS_REFERENCED') {
            return res.status(409).json({
                error: 'Cannot delete course because related examination or registration records exist in the database.'
            });
        }
        return res.status(500).json({ error: err.message });
    }
};
