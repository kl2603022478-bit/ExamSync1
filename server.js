require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { testConnection } = require('./config/db');
const apiRoutes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Global middleware
app.use(cors());
app.use(express.json());

// Root Health Check
app.get('/', (req, res) => {
    res.json({ status: 'Online', message: 'ExamSync SWC3633 API Engine Connected to Database' });
});

// All API routes live under /api
app.use('/api', apiRoutes);

// Must come AFTER the routes
app.use(notFound);
app.use(errorHandler);

// Start Express Server
app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    await testConnection();
});
