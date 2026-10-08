const { pool } = require('../config/db');

// GET /api/registrations
exports.getRegistrations = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                reg.registration_id AS regId, 
                reg.student_id AS studentId, 
                u.full_name AS studentName, 
                u.student_id AS matricNo, 
                reg.course_id AS courseId, 
                c.course_code AS courseCode, 
                c.course_name AS courseName, 
                reg.semester, 
                DATE_FORMAT(reg.registration_date, '%Y-%m-%d') AS registrationDate 
            FROM registrations reg 
            LEFT JOIN users u ON reg.student_id = u.user_id 
            LEFT JOIN courses c ON reg.course_id = c.course_id
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /api/registrations
exports.createRegistration = async (req, res) => {
    const { studentId, courseId, semester } = req.body;
if (!studentId || !courseId || !semester) {
    return res.status(400).json({ error: 'Student, course and semester are required.' });
}

    try {
        const [result] = await pool.query(
            'INSERT INTO registrations (student_id, course_id, semester, registration_date) VALUES (?, ?, ?, NOW())',
            [studentId, courseId, semester]
        );
        res.status(201).json({ regId: result.insertId, message: 'Registration saved successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE /api/registrations/:id
exports.deleteRegistration = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.query('DELETE FROM registrations WHERE registration_id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `Registration with ID ${id} not found.` });
        }

        return res.status(200).json({ success: true, message: `Registration #${id} deleted successfully.` });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
