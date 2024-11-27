import {} from './darkMode.js';
import HTTPClient from './HTTPClient.js';

//Task a.4: Displaying Howls on the Frontend
const howlList = document.getElementById('howlList');
const howlTemplate = document.getElementById('howlTemplate');

function renderHowl(howl) {
	const howlInstance = howlTemplate.content.cloneNode(true);
	const howlElement = howlInstance.querySelector('.howl.container');

	howlElement.querySelector('.user').innerHTML = howl.user;
	howlElement.querySelector('.content').innerHTML = howl.message;

	howlList.prepend(howlElement);
}

// returns a promise that resolves with the parsed JSON object from 
// the response.
HTTPClient.get('/howls').then((howls) => {
	howls.forEach((howl) => {
		renderHowl(howl);
	});
});

//Task b.1: Posting New Howls