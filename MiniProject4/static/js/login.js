import api from './APIClient.js';

const loginForm = document.querySelector('#loginForm');
const username = document.querySelector('#username');

const errorBox = document.querySelector('#errorbox');

function showError(error) {
  errorBox.classList.remove("hidden");
  if(error.status === 401) {
    errorBox.textContent = "Invalid username";
  }
  else {
    errorBox.textContent = error;
  }
}

loginForm.addEventListener('submit', e => {
  e.preventDefault();
  errorBox.classList.add("hidden");

	console.log('Attempting to login - Login.js');
	console.log('Username: ' + username.value);
	
  api.logIn(username.value).then(userData => {
    document.location = "./";
  }).catch((error) => {
    showError(error)
  });
});
