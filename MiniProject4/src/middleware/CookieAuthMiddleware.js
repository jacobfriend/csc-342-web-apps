const crypto = require('crypto');

const sessions = {};
const SESSION_COOKIE_NAME = "HowlerSession";

module.exports.initializeSession = (req, res, user) => {
  const sessionId = crypto.randomBytes(64).toString('hex');
  const sessionData = {
    user: user,
    createdAt: new Date(),
  };
  sessions[sessionId] = sessionData;
  res.cookie(SESSION_COOKIE_NAME, sessionId, { 
    httpOnly: true,
    secure: true,
    maxAge: 120000 
  });
};


module.exports.removeSession = (req, res) => {
  const sessionId = req.cookies[SESSION_COOKIE_NAME];
  if (sessionId) {
    delete sessions[sessionId];
  }
  res.cookie(SESSION_COOKIE_NAME, '', { 
    httpOnly: true,
    secure: true,
    maxAge: -1 
  });
};


module.exports.CookieAuthMiddleware = (req, res, next) => {
  if (!req.cookies[SESSION_COOKIE_NAME]) {
    res.status(401).json({error: 'Not Authenticated'});
    return;
  }
  else {
    const sessionId = req.cookies[SESSION_COOKIE_NAME];
    if (sessions[sessionId]) {
      req.session = sessions[sessionId];
      next();
    }
    else {
      this.removeSession(req, res);
      res.status(401).json({error: 'Not Authenticated'});
      return;
    }
  }
};
