const { pool } = require('../config/db');

// GET /api/examinations
exports.getExaminations = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                e.examination_id AS id, 
                e.course_id AS courseId, 
                c.course_code AS courseCode, 
                c.course_name AS title, 
                e.venue_id AS venueId, 
                v.venue_name AS venue, 
                v.building, 
                DATE_FORMAT(e.exam_date, '%Y-%m-%d') AS date, 
                e.start_time AS startTime, 
                e.end_time AS endTime, 
                e.exam_type AS examType, 
                'Scheduled' AS status 
            FROM examinations e 
            LEFT JOIN courses c ON e.course_id = c.course_id 
            LEFT JOIN venues v ON e.venue_id = v.venue_id
            ORDER BY e.exam_date ASC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /api/examinations
exports.createExamination = async (req, res) => {
    const { courseId, venueId, examDate, startTime, endTime, examType } = req.body;
if (!courseId || !venueId || !examDate || !startTime || !endTime || !examType) {
    return res.status(400).json({ error: 'Course, venue, date, start time, end time and exam type are required.' });
}

    try {
        const [result] = await pool.query(
            'INSERT INTO examinations (course_id, venue_id, exam_date, start_time, end_time, exam_type) VALUES (?, ?, ?, ?, ?, ?)',
            [courseId, venueId, examDate, startTime, endTime, examType || 'Final Examination']
        );
        res.status(201).json({ id: result.insertId, message: 'Exam scheduled successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE /api/examinations/:id
exports.deleteExamination = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.query('DELETE FROM examinations WHERE examination_id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `Examination with ID ${id} not found.` });
        }

        return res.status(200).json({ success: true, message: `Examination #${id} deleted successfully.` });
    } catch (err) {
        if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.code === 'ER_ROW_IS_REFERENCED') {
            return res.status(409).json({
                error: 'Cannot delete examination because related result records exist in the database.'
            });
        }
        return res.status(500).json({ error: err.message });
    }
};
