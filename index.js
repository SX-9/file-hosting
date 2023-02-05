#! /bin/node
"use strict";

const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const app = express();
const { show_port, pass, port } = fs.existsSync('./config.json') ? JSON.stringify(fs.readFileSync('./config.json', 'UTF-8')) : process.env;

console.log('Starting With Configs:', show_port, pass, port)

if (!fs.existsSync('./files')){
  fs.mkdirSync('./files');
}

app.use(express.json());
app.use(fileUpload());
app.use('/files', express.static(__dirname + '/files'));

app.get('/styles.css', (req, res) => res.sendFile(__dirname + '/style.css'));
app.get('/browse', (req, res) => res.sendFile(__dirname + '/browse.html'));
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));
app.get('/files', (req, res) => {
	if (req.query.p !== pass) return res.json(['Access Denied']);
	res.json(fs.readdirSync('./files'));
});

app.post('/upload', (req, res) => {
  if (req.body.pass !== pass) return res.status(401).send('Incorrect Password');
  let file;
  let uploadPath;
  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send('No Files');
    return;
  }
  file = req.files.file;
  console.log("File Uploaded: " + fs.readdirSync('./files').length + '_' + file.name);
  uploadPath = __dirname + '/files/' + fs.readdirSync('./files').length + '_' + file.name;
  file.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send('File Uploaded To ' + req.hostname + ( show_port ? ':' + port : '' ) + '/files/' + ( fs.readdirSync('./files').length - 1 ) + '_' + file.name);
  });
});

app.listen(port, () => console.log('Online At ' + port));
