const express = require('express');
const cookieParser = require('cookie-parser');
const SessionCookieMiddleware = require('./middleware/SessionCookieMiddleware');
const routes = require('./routes');

const app = express();
app.use(cookieParser());
app.use(SessionCookieMiddleware);
app.use(routes);

const PORT = 3000;
// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));