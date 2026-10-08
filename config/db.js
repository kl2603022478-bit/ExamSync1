const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'exam_management',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// The pool is created once and shared by every controller.
const pool = mysql.createPool(dbConfig);

// Called once at startup to confirm the database is reachable.
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log(`Successfully connected to MySQL database: "${dbConfig.database}"`);
        connection.release();

        const [users] = await pool.query('SELECT COUNT(*) as count FROM users');
        console.log(`Connected! Found ${users[0].count} existing user records in "users" table.`);
    } catch (err) {
        console.error('Database Connection Error:', err.message);
        console.error('Please verify DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME in .env file.');
    }
}

module.exports = { pool, testConnection };
