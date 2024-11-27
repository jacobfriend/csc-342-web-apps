import {} from './DarkMode.js';
import api from './APIClient.js';

// Displaying Howls on the Frontend
const howlList = document.getElementById('howlList');
const howlTemplate = document.getElementById('howlTemplate');

function renderHowls(howls) {
  // Sort howls by date in descending order
  const sortedHowls = howls.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Render each howl in the sorted order
  sortedHowls.forEach(howl => renderHowl(howl));
}

function renderHowl(howl) {
	const howlInstance = howlTemplate.content.cloneNode(true);
	const howlElement = howlInstance.querySelector('.howl.container');

	howlElement.querySelector('.profile-link').href = `profile?username=${howl.username}`;
	howlElement.querySelector('.howl-full-name').innerHTML = howl.fullName;
	howlElement.querySelector('.howl-username').innerHTML = "@" + howl.username;
	howlElement.querySelector('.howl-content').innerHTML = howl.message;
	howlElement.querySelector('.howl-profile-pic img').src = howl.avatar;
	howlElement.querySelector('.howl-date').innerHTML = howl.date;

	howlList.prepend(howlElement);
}

api.getHowlsFromFollowedUsers()
	.then(howls => {
		renderHowls(howls);
	})
	.catch(error => {
		console.error("Error retrieving howls:", error);
});

// Posting New Howls
const howlInput = document.getElementById('howlInput');
const howlContents = howlInput.querySelector('textarea');
const howlButton = document.getElementById('howlButton');

howlButton.addEventListener('click', (event) => {
	if (howlContents.value == '') {
		return;
	}
	else {
		const data = {
			message: howlContents.value
		};
		api.createHowl(data).then((newHowl) => {
			// method that returns a promise that resolves with the 
			// parsed JSON object from the response.
			renderHowl(newHowl);
			howlContents.value = '';
		});
	}
});
