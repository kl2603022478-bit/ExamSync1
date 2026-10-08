const express = require('express');
const router = express.Router();

const { getResults, createResult } = require('../controllers/resultController');

router.get('/', getResults);
router.post('/', createResult);

module.exports = router;
