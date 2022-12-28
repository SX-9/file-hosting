"use strict";

const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const { pass, port } = require('./config.json');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use('/files', express.static(__dirname + '/files'));
app.use(express.json());
app.use(fileUpload());

app.post('/upload', (req, res) => {
  if (req.body.pass !== pass) return res.status(401).send('Incorrect Password');
  let file;
  let uploadPath;
  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send('No Files');
    return;
  }
  file = req.files.file;
  console.log("File Uploaded: " + file.name);
  uploadPath = __dirname + '/files/' + file.name;
  file.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send('File Uploaded ' + uploadPath);
  });
});

app.listen(port, () => console.log('Online At ' + port));
