import api from './APIClient.js';

const followingContainer = document.getElementById("followingList");
const howlList = document.getElementById('userHowlList');
const howlTemplate = document.getElementById('howlTemplate');
const headerUsername = document.getElementById('header-username');
const followBtn = document.getElementById('follow-btn');

function renderProfileData(userData) {
	const bigProfileImage = document.querySelector('.big-profile-pic img');
	bigProfileImage.src = userData.avatar;

	const fullName = document.getElementById('profile-full-name');
	fullName.textContent = userData.first_name + " " + userData.last_name;

	const profileUsername = document.getElementById('profile-username');
	profileUsername.textContent = "@" + userData.username;
	renderUserHowls(userData.username);

	// Hide follow button, if looking at personal profile
	if (profileUsername.textContent.slice(1) == headerUsername.textContent.slice(1)) {
		followBtn.style.display = 'none';
	}
	else if (followingList.includes(profileUsername.textContent.slice(1))) {
		// If following, show 'Unfollow'
		followBtn.textContent = 'Unfollow';
	}
	else {
		// If not following, show 'Follow'
		console.log(profileUsername.textContent.slice(1));
		followBtn.textContent = 'Follow';
	}
}

function renderFollowingUser(userData) {
	const template = document.getElementById("profileTemplate");
  const userItem = template.content.cloneNode(true);

	userItem.querySelector('.profile-link').href = `/profile?username=${userData.username}`;
  userItem.querySelector("img").src = userData.avatar;
  userItem.querySelector(".following-full-name").textContent = userData.first_name + " " + userData.last_name;
  userItem.querySelector(".following-username").textContent = `@${userData.username}`;

	followingContainer.appendChild(userItem);
}

function renderHowl(howl) {
	const howlInstance = howlTemplate.content.cloneNode(true);
	const howlElement = howlInstance.querySelector('.howl.container');

	howlElement.querySelector('.profile-link').href = `/profile?username=${howl.username}`;
	howlElement.querySelector('.howl-full-name').innerHTML = howl.fullName;
	howlElement.querySelector('.howl-username').innerHTML = "@" + howl.username;
	howlElement.querySelector('.howl-content').innerHTML = howl.message;
	howlElement.querySelector('.howl-profile-pic img').src = howl.avatar;
	howlElement.querySelector('.howl-date').innerHTML = howl.date;
	howlElement.querySelector('.profile-link').href = `/profile?username=${howl.username}`;

	howlList.prepend(howlElement);
}


function renderUserHowls(username) {
	api.getUserHowls(username)
	.then(howls => {
		howls.forEach((howl) => {
			renderHowl(howl);
		});
	})
	.catch(error => {
		console.error("Error retrieving howls:", error);
	})
}

function getUrlParam(name) {
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get(name);
}

let followingList = [];
api.getCurrentUser()
.then(user => {
		return api.getFollowingList(user.username);
})
.then(list => {
		followingList = list.map(user => user.username); // Extracts usernames into an array
		console.log(followingList);
}).then(() => {

	const username = getUrlParam('username');
	
	if (username) {
		// If username is specified, fetch their profile
		api.getUserProfile(username)
		.then(user => {
			renderProfileData(user);
		})
		.catch(error => {
				console.error("Error retrieving user profile:", error);
		});
	
		api.getFollowingList(username)
		.then(users => {
			users.forEach(user => renderFollowingUser(user));
		})
		.catch(error => {
			console.error("Error retrieving following list:", error);
		});
	
	} else {
		// Otherwise, load the logged-in user's profile
		api.getCurrentUser().then(user => {
			
			renderProfileData(user);
	
			api.getFollowingList(user.username)
			.then(users => {
				users.forEach(user => renderFollowingUser(user));
			})
			.catch(error => {
				console.error("Error retrieving following list:", error);
			});
	
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
	}

});

// Following and Unfollowing behavior
// followBtn.addEventListener('click', () => {
//     const isFollowing = followBtn.textContent.trim() === 'Unfollow';
//     const profileUsername = document.getElementById('profile-username').textContent.slice(1);
//     if (isFollowing) {
//         // If currently following, call unfollow API
//         api.unfollowUser(profileUsername)
//             .then(response => {
//                 followBtn.textContent = 'Follow';
//                 console.log("Unfollowed user:", profileUsername);
// 								followingList.remove...
//             })
//             .catch(error => {
//                 console.error("Error unfollowing user:", error);
//             });
//     } else {
//         // If currently not following, call follow API
//         api.followUser(profileUsername)
//             .then(response => {
//                 followBtn.textContent = 'Unfollow';
//                 console.log("Followed user:", profileUsername);
// 								followingList.push(profileUsername);
//             })
//             .catch(error => {
//                 console.error("Error following user:", error);
//             });
//     }
// });


