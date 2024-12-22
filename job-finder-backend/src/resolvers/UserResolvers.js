const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server-express');
const { validateSignUpInput, validateLoginInput } = require('../utils/auth');
const User = require('../models/User');
require('dotenv').config();

const authMiddleware = require('./../utils/authMiddleware');

// Function to generate a JWT token
const generateToken = user => {
	return jwt.sign(
		{
			id: user.id,
			email: user.email,
			username: user.username,
			role: user.role
		},
		process.env.JWT_SECRET,
		{ expiresIn: '1h' }
	);
};

module.exports = {
	Query: {
		async getUsers(_, { role }, context) {
			const users = role ? await User.find({ role }) : await User.find();
			return users;
		},

		// Fetch a user by their ID
		async getUserById(_, { id }, context) {
			const user = await User.findById(id);
			if (!user) {
				throw new UserInputError('User not found');
			}
			return user;
		}
	},
	Mutation: {
		// Sign up new user
		async signUp(_, { signUpInput: { username, email, password, role } }) {
			const { valid, errors } = validateSignUpInput(username, email, password, role);
			if (!valid) {
				throw new UserInputError('Validation errors', { errors });
			}

			const existingUser = await User.findOne({ email });
			if (existingUser) {
				errors.email = 'Email already in use';
				throw new UserInputError('Email already in use', { errors });
			}

			password = await bcrypt.hash(password, 12);

			const newUser = new User({
				username,
				email,
				password,
				role
			});

			const res = await newUser.save().catch(error => {
				console.error('Error saving user:', error);
				throw new Error('User creation failed');
			});

			const token = generateToken(res);

			return {
				...res._doc,
				id: res._id,
				token
			};
		},

		async login(_, { email, password }) {
			const { valid, errors } = validateLoginInput(email, password);
			if (!valid) {
				throw new UserInputError('Errors', { errors });
			}

			const user = await User.findOne({ email });
			if (!user) {
				errors.general = 'User not found';
				throw new UserInputError('User not found', { errors });
			}

			const match = await bcrypt.compare(password, user.password);
			if (!match) {
				errors.general = 'Wrong credentials';
				throw new UserInputError('Wrong credentials', { errors });
			}

			const token = generateToken(user);
			return {
				...user._doc,
				id: user._id,
				token
			};
		},

		async updateUserProfile(_, { id, username, email }, context) {
			const user = authMiddleware(context);
			if (!user) {
				throw new UserInputError('User not found');
			}

			if (user.id !== id) {
				throw new UserInputError("You cannot update someone else's profile");
			}

			try {
				const userDetails = await User.findOneAndUpdate({ _id: id }, { username, email }, { new: true });

				return {
					id: userDetails.id,
					username: userDetails.username,
					email: userDetails.email
				};
			} catch (error) {
				throw new Error('Failed to update user details');
			}
		}
	}
};
