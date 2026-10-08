const express = require('express');
const router = express.Router();

router.use('/', require('./authRoutes'));                     // /api/login
router.use('/users', require('./userRoutes'));                // /api/users
router.use('/courses', require('./courseRoutes'));            // /api/courses
router.use('/venues', require('./venueRoutes'));              // /api/venues
router.use('/examinations', require('./examinationRoutes'));  // /api/examinations
router.use('/results', require('./resultRoutes'));            // /api/results
router.use('/registrations', require('./registrationRoutes'));// /api/registrations

module.exports = router;
