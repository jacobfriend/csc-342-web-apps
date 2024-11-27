const express = require('express');
const cookieParser = require('cookie-parser');

const apiRouter = express.Router();

apiRouter.use(cookieParser());
apiRouter.use(express.json());

const { generateToken, removeToken, TokenMiddleware } = require('../middleware/TokenMiddleware');

const UserDAO = require('../data/UserDAO');
const HowlDAO = require('../data/HowlDAO');

let follows = require('../data/follows');
let users = require('../data/users');
let howls = require('../data/howls');

// Receives an email and password and sets a JWT in a cookie
apiRouter.post('/users/login', (req,  res) => {
  if (req.body.username && req.body.password) {
    UserDAO.getUserByCredentials(req.body.username, req.body.password).then((user) => {
      generateToken(req, res, user);
      res.json({user: user});
    }).catch(error => {
      res.status(error.code || 500).json({error: error.message});
    });
  }
  else {
    res.status(400).json({error: 'Credentials not provided'});
  }
});

// Retrieves the currently authenticated user (from the JWT)
apiRouter.get('/users/current', TokenMiddleware, (req,  res) => {
  res.json(req.user);
});

// Clears the cookie with the JWT
apiRouter.post('/users/logout', (req,  res) => {
  removeToken(req, res);
  res.json({success: true});
});

// Getting howls posted by all users followed by the "authenticated" user
apiRouter.get('/following/howls', TokenMiddleware, (req, res) => {
  const userId = req.user.id;

  let followedUsers = follows[userId].following;
  // followedUsers.push(req.session.user.id);
  const followHowls = howls.filter(howl => followedUsers.includes(howl.userId));
  const userHowls = howls.filter(howl => howl.userId === userId);
  const allHowls = [...followHowls, ...userHowls];
  res.json(formatHowls(allHowls));
});

// Getting the list of users the "authenticated" user is following
apiRouter.get('/:username/following', TokenMiddleware, (req,  res) => {
  UserDAO.getUserByUsername(req.params.username).then((user) => {
    const followedUserIds = follows[user.id].following;
    const followedUsers = followedUserIds.map(userId => users[userId]);
    res.json(followedUsers);
  }).catch((err) => {
    res.status(404).json({ error: "User not found" });
  });
});

// Getting howls posted by a specific user
apiRouter.get('/:username/howls', TokenMiddleware, (req, res) => {
  UserDAO.getUserByUsername(req.params.username).then((user) => {
    HowlDAO.getHowlsByUserId(user.id).then((howls) => {
      res.json(formatHowls(howls));
    }).catch((err) => {
      res.status(404).json({ error: "Howls not found" });
    });
  }).catch((err) => {
    res.status(404).json({ error: "User not found" });
  });
});

// Creating a new howl.
apiRouter.post('/howls', TokenMiddleware, (req, res) => {
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString();
  const user = req.user;
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
apiRouter.get('/users/:username', TokenMiddleware, (req,  res) => {
  UserDAO.getUserByUsername(req.params.username).then((user) => {
    res.json(user);
  }).catch((err) => {
    res.status(404).json({ error: "User not found" });
  });
});


// Following a user
apiRouter.post('/:userId/following', TokenMiddleware, (req,  res) => {
  res.json(req.user);
});

// Unfollowing a user
apiRouter.delete('/:userId/following', TokenMiddleware, (req,  res) => {
  res.json(req.user);
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