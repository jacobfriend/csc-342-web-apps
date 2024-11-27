const darkModeToggle = document.querySelector('.menu input');

const DARK_MODE_KEY = 'darkMode';

// Handle dark mode toggle
darkModeToggle.addEventListener('change', e => {
  if(e.target.checked) {
    document.body.classList.add('dark');
    localStorage.setItem(DARK_MODE_KEY, 1);
  }
  else {
    document.body.classList.remove('dark');
    localStorage.setItem(DARK_MODE_KEY, 0);
  }

});

// Restore dark mode setting
if(localStorage.getItem(DARK_MODE_KEY) === "1") {
  darkModeToggle.checked = true;
  document.body.classList.add('dark');
}



// import api from './APIClient.js';

// api.getCurrentUser().then(user => {
//   let link = document.createElement('a');
//   link.href = '#';
//   link.innerHTML = "Log Out";
//   link.addEventListener("click", e => {
//     e.preventDefault();
//     api.logOut().then(() => {
//       document.location = "./login";
//     });
//   })

//   document.getElementById('user').innerHTML = `${user.first_name} ${user.last_name} (${user.username}) `;
//   document.getElementById('user').appendChild(document.createElement('br'));
//   document.getElementById('user').appendChild(link);
// })
// .catch(error => {
//   if(error.status === 401) {
//     console.log("We are not logged in");
//     document.location = './login';
//   }
//   else {
//     console.log(`${error.status}`, error);
//   }
// });
