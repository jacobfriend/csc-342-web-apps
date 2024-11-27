const express = require('express');
const cookieParser = require('cookie-parser');

const apiRouter = express.Router();

apiRouter.use(cookieParser());
apiRouter.use(express.json());

const { initializeSession, removeSession, CookieAuthMiddleware } = require('../middleware/CookieAuthMiddleware');

const UserDAO = require('../data/UserDAO');
const HowlDAO = require('../data/HowlDAO');

let follows = require('../data/follows');
let users = require('../data/users');
let howls = require('../data/howls');

// "Authenticating" a user. Just receive a username and
// verify that it corresponds to one of the existing users to grant access.
apiRouter.post('/users/login', (req,  res) => {
	if (req.body.username) {
    UserDAO.getUserByCredentials(req.body.username).then((user) => {
      initializeSession(req, res, user);
      res.json({user: user});
    }).catch(error => {
      res.status(error.code || 500).json({error: error.message});
    });
  }
  else {
    res.status(400).json({error: 'Credentials not provided'});
  }
});

// Getting the currently "authenticated" user's object.
apiRouter.get('/users/current', CookieAuthMiddleware, (req,  res) => {
  res.json(req.session.user);
});

apiRouter.post('/users/logout', (req,  res) => {
  removeSession(req, res);
  res.json({success: true});
});

// Getting howls posted by all users followed by the "authenticated" user
apiRouter.get('/following/howls', CookieAuthMiddleware, (req, res) => {
  const userId = req.session.user.id;

  let followedUsers = follows[userId].following;
  // followedUsers.push(req.session.user.id);
  const followHowls = howls.filter(howl => followedUsers.includes(howl.userId));
  const userHowls = howls.filter(howl => howl.userId === userId);
  const allHowls = [...followHowls, ...userHowls];
  res.json(formatHowls(allHowls));
});

// Getting the list of users the "authenticated" user is following
apiRouter.get('/:username/following', CookieAuthMiddleware, (req,  res) => {
  const username = req.params.username;
  UserDAO.getUserByCredentials(username).then((user) => {
    const followedUserIds = follows[user.id].following;
    const followedUsers = followedUserIds.map(userId => users[userId]);
    res.json(followedUsers);
  }).catch((error) => {
    return res.status(404).json({ error: error.message });
  });

});

// Getting howls posted by a specific user
apiRouter.get('/:username/howls', CookieAuthMiddleware, (req, res) => {
  const username = req.params.username;
  UserDAO.getUserByCredentials(username).then((user) => {
  
    HowlDAO.getHowlsByUserId(user.id).then((howls) => {
      res.json(formatHowls(howls));
    }).catch((err) => {
      res.status(404).json({ error: "Howls not found" });
    });

  }).catch((error) => {
    return res.status(404).json({ error: error.message });
  });
});

// Creating a new howl.
apiRouter.post('/howls', CookieAuthMiddleware, (req, res) => {
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString();
  const user = req.session.user;
  HowlDAO.createHowl(req.body.message, user.id, formattedDate)
  .then(howl => {
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
      const dateString = new Date(howl.datetime);
      const date = dateString.toLocaleString('en-US', options).replace(',', '');
      const data = {
        fullName: `${user.first_name} ${user.last_name}`,
        username: user.username,
        avatar: user.avatar,
        date: date,
        message: howl.text
      }
      res.json(data);
    });
});


// Getting a specific user's profile
apiRouter.get('/users/:username', CookieAuthMiddleware, (req,  res) => {
  const username = req.params.username;
  UserDAO.getUserByCredentials(username).then((user) => {
    res.json(user);
  }).catch((error) => {
    return res.status(404).json({ error: error.message });
  });
});


// Following a user
apiRouter.post('/following', CookieAuthMiddleware, (req,  res) => {
  const currentUser = req.session.user.username;
  const targetUser = req.body.username;
  // Fetch target user's ID
  UserDAO.getUserByCredentials(targetUser)
    .then((targetUser) => {
      if (!targetUser) {
        throw new Error("Target user does not exist.");
      }

      const targetUserId = targetUser.id;

      // Fetch current user and update following list
      return UserDAO.getUserByCredentials(currentUser).then((user) => {
        if (!user) {
          throw new Error("Current user does not exist.");
        }

        // Update the following list
        const currentUserId = user.id;

        if (!follows[currentUserId]) {
          follows[currentUserId] = { userId: currentUserId, following: [] };
        }

        const followingList = follows[currentUserId].following;

        // Check if targetUser is already followed
        if (!followingList.includes(targetUserId)) {
          followingList.push(targetUserId);
        }

        // Save the updated following list
        follows[currentUserId].following = followingList;

        // Map IDs to user data and respond with the updated list
        const followedUsers = followingList.map((userId) => users[userId]);
        res.json(followedUsers);
      });
    })
    .catch((error) => {
      console.error(error.message);
      res.status(404).json({ error: error.message });
    });
});

// Unfollowing a user
apiRouter.post('/unfollow', CookieAuthMiddleware, (req, res) => {
  const currentUser = req.session.user.username;
  const targetUser = req.body.username;
  // Fetch target user's ID
  UserDAO.getUserByCredentials(targetUser)
    .then((targetUser) => {
      if (!targetUser) {
        throw new Error("Target user does not exist.");
      }

      const targetUserId = targetUser.id;

      // Fetch current user and update following list
      return UserDAO.getUserByCredentials(currentUser).then((user) => {
        if (!user) {
          throw new Error("Current user does not exist.");
        }

        const currentUserId = user.id;

        if (!follows[currentUserId]) {
          follows[currentUserId] = { userId: currentUserId, following: [] };
        }

        const followingList = follows[currentUserId].following;

        // Remove the target user from the following list
        const index = followingList.indexOf(targetUserId);
        if (index > -1) {
          followingList.splice(index, 1);
        }

        // Save the updated following list
        follows[currentUserId].following = followingList;

        // Respond with the updated list
        const followedUsers = followingList.map((userId) => users[userId]);
        res.json(followedUsers);
      });
    })
    .catch((error) => {
      console.error(error.message);
      res.status(404).json({ error: error.message });
    });
});


function formatHowls(howls) {
  return howls.map(howl => {
    const user = users[howl.userId];
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    const dateString = new Date(howl.datetime);
    const date = dateString.toLocaleString('en-US', options).replace(',', '');
    return {
      fullName: `${user.first_name} ${user.last_name}`,
      username: user.username,
      avatar: user.avatar,
      date: date,
      message: howl.text
    };
  });
}

module.exports = apiRouter;