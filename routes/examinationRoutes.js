const express = require('express');
const router = express.Router();

const {
    getExaminations,
    createExamination,
    deleteExamination
} = require('../controllers/examinationController');
const validateId = require('../middleware/validateId');

router.get('/', getExaminations);
router.post('/', createExamination);
router.delete('/:id', validateId('examination'), deleteExamination);

module.exports = router;
