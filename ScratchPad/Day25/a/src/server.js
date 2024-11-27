const express = require('express');
const app = express();

//TODO: WebSockets
const expressWs = require('express-ws')(app);

const routes = require('./routes');
app.use(routes);

// As our server to listen for incoming connections
const PORT = 3000;
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));