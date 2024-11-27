import api from './APIClient.js';

function displayUserInHeader(user) {	
	const username = document.getElementById('header-username');
	username.textContent = "@" + user.username;
  document.getElementById('header-username').appendChild(document.createElement('br'));
	
	const smallProfileImage = document.querySelector('.small-profile-pic img');
	if (user.avatar) {
		smallProfileImage.src = user.avatar;
	} else {
		profileImage.src = 'img/profile-pic.jpg';
	}
}

document.getElementById('logout-btn').addEventListener("click", e => {
	api.logOut().then(() => {
		document.location = "./login";
	});
});

api.getCurrentUser().then(user => {
	displayUserInHeader(user);
})
.catch(error => {
  if(error.status === 401) {
    console.log("We are not logged in");
    document.location = './login';
  }
  else {
    console.log(`${error.status}`, error);
  }
});
