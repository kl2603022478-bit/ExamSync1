const { pool } = require('../config/db');

// Converts numeric marks into a grade + pass/fail status.
function calculateGrade(marks) {
    if (marks >= 80) return { grade: 'A', status: 'PASS' };
    if (marks >= 75) return { grade: 'A-', status: 'PASS' };
    if (marks >= 70) return { grade: 'B+', status: 'PASS' };
    if (marks >= 65) return { grade: 'B', status: 'PASS' };
    if (marks >= 60) return { grade: 'B-', status: 'PASS' };
    if (marks >= 55) return { grade: 'C+', status: 'PASS' };
    if (marks >= 50) return { grade: 'C', status: 'PASS' };
    return { grade: 'F', status: 'FAIL' };
}

// GET /api/results
exports.getResults = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                r.result_id AS id, 
                r.student_id AS studentUserId, 
                u.full_name AS studentName, 
                u.student_id AS studentMatricNo, 
                r.examination_id AS examinationId, 
                c.course_code AS courseCode, 
                c.course_name AS courseName, 
                r.marks, 
                r.grade, 
                r.status 
            FROM results r 
            LEFT JOIN users u ON r.student_id = u.user_id 
            LEFT JOIN examinations e ON r.examination_id = e.examination_id 
            LEFT JOIN courses c ON e.course_id = c.course_id
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /api/results
exports.createResult = async (req, res) => {
    const { studentId, examinationId, marks } = req.body;
if (!studentId || !examinationId || marks === undefined || marks === '' || isNaN(marks) || marks < 0 || marks > 100) {
    return res.status(400).json({ error: 'Student, examination and marks (0-100) are required.' });
}

    const numMarks = parseFloat(marks);
    const { grade, status } = calculateGrade(numMarks);

    try {
        const [result] = await pool.query(
            'INSERT INTO results (student_id, examination_id, marks, grade, status) VALUES (?, ?, ?, ?, ?)',
            [studentId, examinationId, numMarks, grade, status]
        );
        res.status(201).json({ id: result.insertId, studentId, examinationId, marks: numMarks, grade, status });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
