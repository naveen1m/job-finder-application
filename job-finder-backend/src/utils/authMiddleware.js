const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');
require('dotenv').config();

const authMiddleware = context => {
	const authHeader = context.req.headers.authorization;
	if (authHeader) {
		// Check if the token exists in the header
		const token = authHeader.split('JWT ')[1];
		if (token) {
			try {
				// Verify the token
				const user = jwt.verify(token, process.env.JWT_SECRET);
				return user;
			} catch (err) {
				throw new AuthenticationError('Invalid/Expired token');
			}
		}
		throw new Error("Authentication token must be 'JWT [token]'");
	}
	throw new Error('Authorization header must be provided');
};
module.exports = authMiddleware;
