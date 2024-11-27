// express server
const fs = require('fs');
const path = require('path');
// Import our Express dependency
const express = require('express');
// Create a new server instance
const app = express();
// node.js middleware for handling multipart/form-data
const multer = require('multer');
// this middleware parses the encoded file data and populates
// the req.body object with key-value pairs.
app.use(express.urlencoded({ extended: true }));
// Directory with static files
app.use(express.static('static'));

const uploadDir = 'static/uploads/';

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const templateFolder = path.join(__dirname, 'templates');
const validateSend = require('./validation');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'static/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
})

var upload = multer({ storage: storage });

app.get('/', (req, res) => {
  res.sendFile(path.join(templateFolder, 'form.html'));
});

app.post('/send', upload.single('file-upload'), (req, res, next) => {
	if (!validateSend(req)) { 
    res.status(400).sendFile(path.join(templateFolder, 'error.html'));
  }
  else {
    res.status(200).sendFile(path.join(templateFolder, 'success.html'));
  }
});

// Port number we want to use on this server
const PORT = 80;
// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));