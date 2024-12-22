const validator = require('validator');

const validateSignUpInput = (username, email, password, age, number, type) => {
	const errors = {};
	if (validator.isEmpty(username)) {
		errors.name = 'Name must not be empty';
	}
	// Validate other fields similarly...
	return {
		errors,
		valid: Object.keys(errors).length < 1
	};
};
const validateLoginInput = (email, password) => {
	const errors = {};
	if (!validator.isEmail(email)) {
		errors.email = 'Email must be a valid email address';
	}
	// Validate other fields similarly...
	return {
		errors,
		valid: Object.keys(errors).length < 1
	};
};
module.exports = { validateSignUpInput, validateLoginInput };
