const jwt = require('jsonwebtoken');
const TOKEN_COOKIE_NAME = "NCParksToken";
const API_SECRET = "secret";

// Create your own secret key for the token here.
// In a real application, you will never hard-code this secret and you will
// definitely never commit it to version control, ever

exports.TokenMiddleware = (req, res, next) => {
  // We will look for the token in two places:
  // 1. A cookie in case of a browser
  // 2. The Authorization header in case of a different client
  let token = null;
  if(req.cookies[TOKEN_COOKIE_NAME]) { //We do have a cookie with a token
    token = req.cookies[TOKEN_COOKIE_NAME]; //Get token from cookie
  }
  else { //No cookie, so let's check Authorization header
    const authHeader = req.get('Authorization');
      if(authHeader && authHeader.startsWith("Bearer ")) {
      //Format should be "Bearer token" but we only need the token
      token = authHeader.split(" ")[1].trim();
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const payload = jwt.verify(token, API_SECRET);
    req.user = payload.user;
    next();
  } catch(error) { // Token is invalid
    return res.status(401).json({error: 'Not Authenticated'});
  }
}


exports.generateToken = (req, res, user) => {
  let payload = {
    // Convert current time to seconds as whole integer
    exp: Math.floor(Date.now() / 1000) + (60 * 60),
    user: user
  }

  const token = jwt.sign(payload, API_SECRET);

  res.cookie(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    maxAge: 2 * 60 * 1000
  });
};


exports.removeToken = (req, res) => {
  res.cookie(TOKEN_COOKIE_NAME, '', {
    httpOnly: true,
    secure: true,
    maxAge: -1
  });
};

