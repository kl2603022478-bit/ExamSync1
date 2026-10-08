const express = require('express');
const router = express.Router();

const { getVenues, createVenue, deleteVenue } = require('../controllers/venueController');
const validateId = require('../middleware/validateId');

router.get('/', getVenues);
router.post('/', createVenue);
router.delete('/:id', validateId('venue'), deleteVenue);

module.exports = router;
