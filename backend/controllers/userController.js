import asyncHandler from 'express-async-handler'
import {generateToken, generateResetToken, verifyResetToken} from '../utils/generateToken.js'
import User from '../models/userModel.js'
import _ from 'lodash';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body

	const user = await User.findOne({ email })

	if (user && (await user.matchPassword(password))) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			token: generateToken(user._id),
		})
	} else {
		res.status(401)
		throw new Error('Invalid email or password')
	}
})
// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body

	const userExists = await User.findOne({ email })

	if (userExists) {
		res.status(400)
		throw new Error('User already exists')
	}

	const user = await User.create({
		name,
		email,
		password,
	})

	if (user) {
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			token: generateToken(user._id),
		})
	} else {
		res.status(400)
		throw new Error('Invalid user data')
	}
})
// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id)
	if (user) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
		})
	} else {
		res.status(404)
		throw new Error('User Not Found')
	}
})
// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id)
	if (user) {
		user.name = req.body.name || user.name
		user.email = req.body.email || user.email
		if (req.body.password) {
			user.password = req.body.password
		}

		const updatedUser = await user.save()

		res.json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			isAdmin: updatedUser.isAdmin,
			token: generateToken(user._id),
		})
	} else {
		res.status(404)
		throw new Error('User Not Found')
	}
})
// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
	const users = await User.find()
	res.json(users)
})
// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id)
	if (user) {
		await user.remove()
		res.json({ message: 'User removed' })
	} else {
		res.status(404)
		throw new Error('User not found')
	}
})
// @desc    Get user bu ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id).select('-password')
	if (user) {
		res.json(user)
	} else {
		res.status(404)
		throw new Error('User not found')
	}
})
// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id)

	if (user) {
		user.name = req.body.name || user.name
		user.email = req.body.email || user.email
		user.isAdmin = req.body.isAdmin

		const updatedUser = await user.save()

		res.json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			isAdmin: updatedUser.isAdmin,
		})
	} else {
		res.status(404)
		throw new Error('User Not Found')
	}
})
// @desc    Forgot password email
// @route   PUT /api/users/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
	const { email } = req.body;
	const user = await User.findOne({email});
	if (user) {
		const token = generateResetToken(user._id);
		var currentDate = new Date();
		const url = `http://localhost:3000/reset-password/${token}`;
		console.log({ url });
		const data = {
		from: "me@samples.mailgun.org",
		to: email,
		subject: "password reset",
		html: ` <p>Hey we have received request for reset your account password </p>
			<h3> <a href="http://localhost:3000/reset-password/${token}">click here</a></h3>
			${url}
			`,
		};
		
		user.resetLink  = token;
		const updatedUser = await user.save()

		res.json({
			message:
			"Email has been send successfully kindly follow the instructions",
			url: { url },
		})
	} else {
		console.log('no user found with email', email);
		return res.status(400).json({
			error: "User with this email does not found in DB",
		});
	}
})

// @desc    Reset password 
// @route   PUT /api/users/reset-password
// @access  Public
const resetPassword = (req, res) => {
	const { resetLink, newPass } = req.body;
	if (resetLink) {
		try {
		const resetToken = verifyResetToken(resetLink);
		
		User.findOne({ resetLink }, (err, user) => {
			if (err || !user) {
			return res
				.status(400)
				.json({ error: "User with this token does not exist" });
			}
			const obj = {
			password: newPass,
			resetLink: "",
			};

			user = _.extend(user, obj);
			user.save((err, result) => {
			if (err) {
				return res.status(400).json({
				error: "reset password  error",
				});
			} else {
				return res.json({
				message: "Your password has been changed",
				});
			}
			});
		});
	} catch (e) {
		res.status(400).json({ error: e });
	}
	} else {
	  return res.status(401).json({ error: "Authentication error" });
	}
  };

export {
	authUser,
	registerUser,
	getUserProfile,
	updateUserProfile,
	getUsers,
	deleteUser,
	getUserById,
	updateUser,
	forgotPassword,
	resetPassword
}
