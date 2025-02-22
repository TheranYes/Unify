const express = require('express');
const Session = require('../models/session.js');
const User = require('../models/user.js');
const app = express();
const PORT = 5000;

const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

const sessionRouter = require('./routes/session.js');
app.use('/session', sessionRouter);

function logger(req, res, next) {
  console.log(`Called: ${req.orginalUrl}`);
  next();
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});