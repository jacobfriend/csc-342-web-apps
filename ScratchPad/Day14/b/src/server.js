const path = require('path');
// Import our Express dependency
const express = require('express');
// Create a new server instance
const app = express();
// Import our Howl Data Access Object
const HowlDAO = require('./db/HowlDAO');

app.use(express.static('public'));
app.use(express.json());

const templateFolder = path.join(__dirname, '..', 'templates');

app.get('/', (req, res) => {
  res.sendFile(path.join(templateFolder, 'index.html'));
});

app.get('/howls', (req, res) => {
  HowlDAO.getHowls()
    .then(howls => {
      res.json(howls);
    });
});

app.post('/howls', (req, res) => {
  HowlDAO.createHowl(req.body.message)
    .then(howl => {
      res.json(howl);
    });
});

// Port number we want to use on this server
const PORT = 3000;
// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));