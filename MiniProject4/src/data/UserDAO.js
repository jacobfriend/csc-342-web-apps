let users = require('./users.json');

function getFilteredUser(user) {
  return {
    "id": user.id,
    "first_name": user.first_name,
    "last_name": user.last_name,
    "username": user.username,
    "avatar": user.avatar
  }
}

// Mimicking making asynchronous request to a database
module.exports = {
  getUserByCredentials: (username) => {
    return new Promise((resolve, reject) => {
      const user = Object.values(users).find(user => user.username == username);
      if(!user) {
        reject({code: 401, message: "No such user"});
        return;
      }
      //We have a user with that username
			resolve(getFilteredUser(user));
    });
  },
};
