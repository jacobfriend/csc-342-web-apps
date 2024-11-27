// Preview Image
const imageInput = document.getElementById('file-upload');
const previewImage = document.querySelector('.image-preview');

imageInput.addEventListener('change', (event) => {
	var input = event.target;
	if (input.files && input.files[0]) {
		var reader = new FileReader();
		reader.onload = function(e) {
			previewImage.src = e.target.result;
		}
		reader.readAsDataURL(input.files[0]);
	}
	else {
		previewImage.src = 'images/placeholder.png'; // Reset to placeholder if no file
	}
});

const form = document.querySelector('form');

// SENDER DETAILS
const senderFirstNameInput = form.querySelector('input[name="sender-first-name"]');
const senderLastNameInput = form.querySelector('input[name="sender-last-name"]');
const fileInput = form.querySelector('input[name="file-upload"]');

// RECIPIENT DETAILS
const recipientFirstNameInput = form.querySelector('input[name="recipient-first-name"]');
const recipientLastNameInput = form.querySelector('input[name="recipient-last-name"]');
const messageInput = form.querySelector('textarea[name="message"]');
const notifyRecipientRadios = form.querySelectorAll('input[name="notify"]');
const emailInput = form.querySelector('input[name="recipient-email"]');
const phoneInput = form.querySelector('input[name="recipient-phone"]');

// PAYMENT DETAILS
const cardNumberInput = form.querySelector('input[name="card-number"]');
const expirationInput = form.querySelector('input[name="expiration"]');
const cvvInput = form.querySelector('input[name="cvv"]');
const amountInput = form.querySelector('input[name="amount"]');
const termsCheckbox = form.querySelector('input[name="agree-terms"]');

cardNumberInput.addEventListener('keydown', (e) => {
	let val = cardNumberInput.value;
	const len = val.length;

	// Allow navigation and control keys
	if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
			// Remove preceding hyphen
			if ( e.key === 'Backspace' && [6, 11, 16].includes(len) ) {
				e.preventDefault();	
				cardNumberInput.value = val.slice(0, -2);
			}
			return;
	}

	// Prevent non-numeric input
	if (isNaN(e.key) || e.key === ' ') {
			e.preventDefault();
			return;
	}

	// Prevent entering more than 16 digits (+3 hyphens)
	if (len >= 19) {
			e.preventDefault();
			return;
	}

	// Add hyphen after every group of 4 digits
	if ([4, 9, 14].includes(len)) {
		e.preventDefault();	
		cardNumberInput.value += '-';
		cardNumberInput.value += e.key;
	}
});


// Function to validate first and last names
const validateName = (input) => {
	if (!input.value.trim()) {
		input.setCustomValidity("This field is required.");
	} else {
		input.setCustomValidity("");
	}
};

// Function to validate file input
const validateFile = () => {
	fileInput.setCustomValidity(""); // Reset custom validity
	if (fileInput.files.length === 0 || !fileInput.files[0].type.startsWith('image/')) {
		fileInput.setCustomValidity("A valid image is required.");
		previewImage.src = 'images/placeholder.png'; // Reset preview image
	} else if (fileInput.files[0].size > 200 * 1024) { // Check if file size is greater than 200 KB
		fileInput.setCustomValidity("File size must be less than 200 KB.");
		previewImage.src = 'images/placeholder.png'; // Reset preview image
	} else {
		previewImage.src = URL.createObjectURL(fileInput.files[0]); // Display preview of the uploaded image
	}
};

// Function to validate recipient details
const validateRecipientDetails = () => {
	if (!recipientFirstNameInput.value.trim()) {
		recipientFirstNameInput.setCustomValidity("This field is required.");
	} else {
		recipientFirstNameInput.setCustomValidity("");
	}

	if (!recipientLastNameInput.value.trim()) {
		recipientLastNameInput.setCustomValidity("This field is required.");
	} else {
		recipientLastNameInput.setCustomValidity("");
	}

	if ((messageInput.value !== '') && messageInput.value.length < 10) {
		messageInput.setCustomValidity("A message must be at least 10 characters.");
	} else {
		messageInput.setCustomValidity("");
	}

	phoneInput.setCustomValidity("");
	emailInput.setCustomValidity("");
	const notifyValue = Array.from(notifyRecipientRadios).find(radio => radio.checked)?.value;
	if (notifyValue === 'email' && (emailInput.value == '')) {
		emailInput.setCustomValidity("Email is required if you are notifying the recipient by email.");
	} else {
		emailInput.setCustomValidity("");
	}

	if (notifyValue === 'sms' && (phoneInput.value == '')) {
		phoneInput.setCustomValidity("Phone number is required if you are notifying the recipient by SMS.");
	} else {
		phoneInput.setCustomValidity("");
	}
};

// Function to validate payment details
const validatePaymentDetails = () => {
	if (!cardNumberInput.value.match(/^\d{4}-\d{4}-\d{4}-\d{4}$/)) {
		cardNumberInput.setCustomValidity("Card number must be in the format XXXX-XXXX-XXXX-XXXX.");
	} else {
		cardNumberInput.setCustomValidity("");
	}

	const currentDate = new Date();
	const expirationDate = new Date(expirationInput.value);
	if (!expirationInput.value || expirationDate < currentDate) {
		expirationInput.setCustomValidity("The card must not be expired.");
	} else {
		expirationInput.setCustomValidity("");
	}

	if (!cvvInput.value.match(/^\d{3,4}$/)) {
		cvvInput.setCustomValidity("CVV must be 3 or 4 digits.");
	} else {
		cvvInput.setCustomValidity("");
	}

	if (!amountInput.value || isNaN(amountInput.value) || parseFloat(amountInput.value) <= 0) {
		amountInput.setCustomValidity("Amount must be a valid positive number.");
	} else {
		amountInput.setCustomValidity("");
	}

	if (!termsCheckbox.checked) {
		termsCheckbox.setCustomValidity("You must agree to the terms and conditions.");
	} else {
		termsCheckbox.setCustomValidity("");
	}
};

// Sender Validation Event Listeners
senderFirstNameInput.addEventListener('input', () => validateName(senderFirstNameInput));
senderLastNameInput.addEventListener('input', () => validateName(senderLastNameInput));
fileInput.addEventListener('change', validateFile);

// Recipient Validation Event Listeners
recipientFirstNameInput.addEventListener('input', validateRecipientDetails);
recipientLastNameInput.addEventListener('input', validateRecipientDetails);
messageInput.addEventListener('input', validateRecipientDetails);
emailInput.addEventListener('input', validateRecipientDetails);
notifyRecipientRadios.forEach((radio) => {
	radio.addEventListener('change', validateRecipientDetails);
});
phoneInput.addEventListener('input', validateRecipientDetails);

// Payment Validation Event Listeners
expirationInput.addEventListener('input', validatePaymentDetails);
cvvInput.addEventListener('input', validatePaymentDetails);
amountInput.addEventListener('input', validatePaymentDetails);
termsCheckbox.addEventListener('change', validatePaymentDetails);

// Form submission validation
form.addEventListener('submit', (event) => {
	validateName(senderFirstNameInput);
	validateName(senderLastNameInput);
	validateName(recipientFirstNameInput);
	validateName(recipientLastNameInput);
	validateFile();
	validateRecipientDetails();
	validatePaymentDetails();
	validateCardDetails();

	const valid = form.checkValidity();
	if (!valid) {
		event.preventDefault();
		form.reportValidity();
	}
});
