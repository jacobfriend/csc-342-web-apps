// Import path module
const path = require('path');
const templatesPath = path.join(__dirname, 'templates');

// Import our Express dependency
const express = require('express');
// Create a new server instance
const app = express();
// Port number we want to use on this server
const PORT = 3000;

// Add your code here
app.use(express.static('static'));

// Custom logger middleware
const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
};

// Attach the logger middleware
app.use(logger);


// Attaches a route to the Express app that
// serves the index.html file when a GET request is made to '/' route
app.get('/', (req, res) => {
    res.sendFile(path.join(templatesPath, 'index.html'));
});

// Serves the about.html file when a GET request is made to the /company/about path
app.get('/company/about', (req, res) => {
    res.sendFile(path.join(templatesPath, 'about.html'));
});

app.all('*', (req, res) => {
    res.status(404).sendFile(path.join(templatesPath, '404.html'));
});

// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));