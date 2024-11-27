module.exports = function validateAddPlant(req) {
	let valid = true;
	let errors = [];

	// PLANTS DETAILS VALIDATION
	if (!req.body['plantType']?.trim()) {
		errors.push("Plant's type is required.");
		valid = false;
	}

	// ...

	// FILE VALIDATION

	// ...

	// If any validation failed, log errors and return false
	if (!valid) {
		console.log(errors);
		return false;
	}
	return true;
};
