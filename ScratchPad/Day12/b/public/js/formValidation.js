export default function validateForm(event) {
    const form = document.querySelector('form');
    const usernameInput = form.querySelector('#username');
    const passwordInput = form.querySelector('#password');
    const confirmPasswordInput = form.querySelector('#confirm-password');
    const languageSelect = form.querySelector('#language');
    const termsCheckbox = form.querySelector('#terms');
  
    let valid = true;
    let errors = [];
    
    // Username validation (required, at least 5 characters, lowercase only)
    usernameInput.setCustomValidity("");
    if (!usernameInput.checkValidity()) {
      errors.push("Username must be at least 5 characters long and consist only of lowercase letters.");
      usernameInput.setCustomValidity("Username must be at least 5 characters long and consist only of lowercase letters.");
      valid = false;
    }
  
    // Password validation (required, at least 8 characters)
    passwordInput.setCustomValidity("");
    if (!passwordInput.checkValidity()) {
      errors.push("Password must be at least 8 characters long.");
      passwordInput.setCustomValidity("Password must be at least 8 characters long.");
      valid = false;
    }
  
    // Confirm password validation (must match password)
    confirmPasswordInput.setCustomValidity("");
    if (confirmPasswordInput.value !== passwordInput.value) {
      errors.push("Passwords do not match.");
      confirmPasswordInput.setCustomValidity("Passwords do not match.");
      valid = false;
    }
  
    
    // Language validation (required)
    languageSelect.setCustomValidity("");
    if (!languageSelect.checkValidity()) {
      errors.push("Please select a preferred language.");
      languageSelect.setCustomValidity("Please select a preferred language.");
      valid = false;
    }
  
  
    // Terms and conditions validation (required)
    termsCheckbox.setCustomValidity("");
    if (!termsCheckbox.checkValidity()) {
      errors.push("You must accept the terms and conditions.");
      termsCheckbox.setCustomValidity("You must accept the terms and conditions.");
      valid = false;
    }
  
    // If any validation failed, prevent form submission
    if (!valid) {
      console.log(errors);
      form.reportValidity();
      event.preventDefault();
    }
  }