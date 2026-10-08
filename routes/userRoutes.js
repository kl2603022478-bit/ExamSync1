const express = require('express');
const router = express.Router();

const { getUsers, createUser, deleteUser } = require('../controllers/userController');
const validateId = require('../middleware/validateId');
const requireFields = require('../middleware/requireFields');

router.get('/', getUsers);
router.post(
    '/',
    requireFields(['fullName', 'email', 'password', 'role'], 'Full name, email, password, and role are required.'),
    createUser
);
router.delete('/:id', validateId('user'), deleteUser);

module.exports = router;
