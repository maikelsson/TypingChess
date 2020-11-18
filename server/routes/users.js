const express = require('express');
const router = express.Router();
const { getUsers, addUser, getUserById } = require('../controllers/usersController')

router
	.route('/')
	.get(getUsers)
	.post(addUser);

router
	.route('/:id')
	.get(getUserById);

module.exports = router;