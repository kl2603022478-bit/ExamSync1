const express = require('express');
const router = express.Router();

const { getCourses, createCourse, deleteCourse } = require('../controllers/courseController');
const validateId = require('../middleware/validateId');

router.get('/', getCourses);
router.post('/', createCourse);
router.delete('/:id', validateId('course'), deleteCourse);

module.exports = router;
