const express = require('express');
const router = express.Router();

const {
    getRegistrations,
    createRegistration,
    deleteRegistration
} = require('../controllers/registrationController');
const validateId = require('../middleware/validateId');

router.get('/', getRegistrations);
router.post('/', createRegistration);
router.delete('/:id', validateId('registration'), deleteRegistration);

module.exports = router;
