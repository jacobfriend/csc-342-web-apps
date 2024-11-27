const express = require('express');
const app = express();

const routes = require('./src/routes');
app.use(routes);

const PORT = 80;
// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));