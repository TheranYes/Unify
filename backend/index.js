const express = require('express');
const Session = require('../models/session.js');
const User = require('../models/user.js');
const mongoose = require('mongoose');
require('dotenv').config();

const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

const sessionRouter = require('./routes/session.js');
app.use('/session', sessionRouter);

const app = express();
const PORT = 5000;

const dbUser = process.env.MONGODB_USER;
const dbPassword = process.env.MONGODB_PASSWORD;

const uri = `mongodb+srv://${dbUser}:${dbPassword}@unify.nr15b.mongodb.net/?retryWrites=true&w=majority&appName=Unify`
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
mongoose.connect(uri, clientOptions).then(
  () => { console.log('Database connection established'); },
  err => { console.error(`Database connection error: ${err.message}`); }
);

function logger(req, res, next) {
  console.log(`Called: ${req.orginalUrl}`);
  next();
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});