const User = require('../models/User')

// @desc GET all users
// @route GET /api/v1/users
exports.getUsers = async (req, res, next) => {
	try {
		const users = await User.find();
		return res.status(200).json({
			success: true,
			count: users.length,
			data: users
		});
	} catch (err) {
		return res.status(500).json({
			success: false,
			error: 'Server error'
		});
	}
}

// @desc ADD user
// @route POST /api/v1/users
exports.addUser = async (req, res, next) => {
	try {
		const { username, password } = req.body;
		const user = await User.create(req.body);
		return res.status(201).json({
			success: true,
			data: user
		});
		
	} catch (err) {
		if(err.name === 'ValidationError'){
			const messages = Object.values(err.errors).map(val => val.message)
			return res.status(400).json({
				success: false,
				error: "messages"
			})
		} else {
			return res.status(404).json({
				success: false,
				error: ''
			})
		}
	}
}