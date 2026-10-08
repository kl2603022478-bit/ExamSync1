const express = require('express');
const router = express.Router();

const { login } = require('../controllers/authController');
const requireFields = require('../middleware/requireFields');

// POST /api/login
router.post('/login', requireFields(['email', 'password'], 'Email and password are required.'), login);

module.exports = router;
