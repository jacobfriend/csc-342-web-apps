const fs = require('fs');

// SERVER SIDE VALIDATION
module.exports = function validateSend(req) {
	let valid = true;
	let errors = [];

	// FRAUDULENT USER CHECK
	const recipientFirstName = req.body['recipient-first-name']?.toLowerCase();
	const recipientLastName = req.body['recipient-last-name']?.toLowerCase();
	if (
		(recipientFirstName === 'stuart' && recipientLastName === 'dent') ||
		(recipientFirstName === 'stu' && recipientLastName === 'dent')
	) {
		errors.push("Payments to Stuart Dent or Stu Dent are not allowed.");
		valid = false;

		// If the banned user uploaded a file, delete it
		if (req.file) {
			fs.unlink(req.file.path, (err) => {
				if (err) {
					console.error(`Error deleting file: ${file.path}`, err);
				}
			});
		}
	}

	// SENDER DETAILS VALIDATION
	if (!req.body['sender-first-name']?.trim()) {
		errors.push("Sender's first name is required.");
		valid = false;
	}

	if (!req.body['sender-last-name']?.trim()) {
		errors.push("Sender's last name is required.");
		valid = false;
	}

	// FILE VALIDATION
	if (!req.file) {
		errors.push("A valid image is required.");
		valid = false;
	} else if (!req.file.mimetype.startsWith('image/')) {
		errors.push("The file must be a valid image.");
		valid = false;
	} else if (req.file.size > 200 * 1024) {
		errors.push("The image file cannot be larger than 200 KB.");
		valid = false;
	}

	// RECIPIENT DETAILS VALIDATION
	if (!req.body['recipient-first-name']?.trim()) {
		errors.push("Recipient's first name is required.");
		valid = false;
	}

	if (!req.body['recipient-last-name']?.trim()) {
		errors.push("Recipient's last name is required.");
		valid = false;
	}

	if (req.body.message && req.body.message.length < 10) {
		errors.push("A message must be at least 10 characters.");
		valid = false;
	}

	const notifyValue = req.body.notify;
	if (notifyValue === 'email' && !req.body['recipient-email']?.trim()) {
		errors.push("Email is required if you are notifying the recipient by email.");
		valid = false;
	}

	if (notifyValue === 'sms' && !req.body['recipient-phone']?.trim()) {
		errors.push("Phone number is required if you are notifying the recipient by SMS.");
		valid = false;
	}

	// PAYMENT DETAILS VALIDATION
	if (!/^\d{4}-\d{4}-\d{4}-\d{4}$/.test(req.body['card-number'])) {
		errors.push("Card number must be in the format XXXX-XXXX-XXXX-XXXX.");
		valid = false;
	}

	const currentDate = new Date();
	const expirationDate = new Date(req.body.expiration);
	if (!req.body.expiration || expirationDate < currentDate) {
		errors.push("The card must not be expired.");
		valid = false;
	}

	if (!/^\d{3,4}$/.test(req.body.cvv)) {
		errors.push("CVV must be 3 or 4 digits.");
		valid = false;
	}

	if (!req.body.amount || isNaN(req.body.amount) || parseFloat(req.body.amount) <= 0) {
		errors.push("Amount must be a valid positive number.");
		valid = false;
	}

	if (req.body['agree-terms'] !== "on") {
		errors.push("You must agree to the terms and conditions.");
		valid = false;
	}

	// If any validation failed, log errors and return false
	if (!valid) {
		console.log(errors);
		return false;
	}
	return true;
};
