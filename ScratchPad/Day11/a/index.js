const express = require('express');
const app = express();
app.use(express.static('public'));
const multer = require('multer');

const path = require('path');
const templatesPath = path.join(__dirname, 'templates');
const PORT = 3000;
const upload = multer({ dest: 'uploads/' });

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(templatesPath, 'form.html'));
});

app.get('/submit/get', (req, res) => {
    console.log(req.query);
    res.sendFile(path.join(templatesPath, 'received.html'));
});

app.post('/submit/post/url', (req, res) => {
    console.log(req.body);
    res.sendFile(path.join(templatesPath, 'received.html'));
});

app.post('/submit/post/multipart', upload.none(), (req, res) => {
    console.log(req.body);
    res.sendFile(path.join(templatesPath, 'received.html'));
});

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));