const TOKEN_COOKIE_NAME = "PlantPalToken";

const jwt = require("jsonwebtoken");

// Create your own secret key for the token here.
// const API_SECRET = "RisingPandas2024";
// In a real application, you will never hard-code this secret and you will
// definitely never commit it to version control, ever

exports.TokenMiddleware = (req, res, next) => {
  // We will look for the token in two places:
  // 1. A cookie in case of a browser
  // 2. The Authorization header in case of a different client
  let token = null;
  if (req.cookies && req.cookies[TOKEN_COOKIE_NAME]) {
    token = req.cookies[TOKEN_COOKIE_NAME];
  } else {
    const authHeader = req.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      //Format should be "Bearer token" but we only need the token
      token = authHeader.split(" ")[1].trim();
    }
  }
  if (token == null) {
    return res.status(401).json({ error: "Not Authenticated" });
  }
  try {
    const payload = jwt.verify(token, process.env.API_SECRET_KEY);
    req.user = payload.user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Not Authenticated" });
  }
};

exports.generateToken = (req, res, user) => {
  const payload = {
    user: {
      id: user.id,
      username: user.username,
    },
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  };

  const token = jwt.sign(payload, process.env.API_SECRET_KEY);

  res.cookie(TOKEN_COOKIE_NAME, token, {
    httpOnly: true, // Prevent client-side access to the cookie
    // secure: process.env.NODE_ENV === "production", // Use secure cookies only in production
    secure: true,
    maxAge: 60 * 60 * 1000, // Cookie expires in 60 minutes
  });
};

exports.removeToken = (req, res) => {
  res.cookie(TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    maxAge: -10000,
  });
};
