const crypto = require('crypto');

function generateSessionId() {
  return crypto.randomBytes(6).toString('hex');
}

const sessions = {};
const SESSION_COOKIE_NAME = 'NCParks';

function generateEmptySession() {
  return {
    visitedParks: [],
    createdAt: new Date(),
  };
}

function SessionCookieMiddleware(req, res, next) {	
	// if the reqeust doesn't have a session cookie
	if (!req.cookies[SESSION_COOKIE_NAME]) {
		let sessionId = generateSessionId();
		sessions[sessionId] = generateEmptySession();
		// store new session for future requests
		req.session = sessions[sessionId];
		// send session ID in cookie to client
		res.cookie(SESSION_COOKIE_NAME, sessionId, { httpOnly: true, maxAge: 120000 });
		console.log('We have a new visitor!', sessionId, req.session);
	}
	// the reqeust does have a session cookie
	else {
		let sessionId = req.cookies[SESSION_COOKIE_NAME];
		if (!sessions[sessionId]) {
			sessions[sessionId] = generateEmptySession();
		}
		req.session = sessions[sessionId];
		console.log('Oh look,', sessionId, 'is back!', req.session);
	}
	next();
}

module.exports = SessionCookieMiddleware;