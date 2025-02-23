const express = require('express');
const cors = require('cors');
// const Session = require('../models/session.js');
// const User = require('../models/user.js');
const mongoose = require('mongoose');
require('dotenv').config();

const sessionRouter = require('./routes/session.js');
const authRouter = require('./routes/auth.js');
const listenRouter = require('./routes/listen.js');
const profileRouter = require('./routes/profile.js');
const locationRouter = require('./routes/location.js');
const nearbyRouter = require('./routes/nearby.js');

const app = express();
const PORT = process.env.SERVER_PORT || 3001;

app.use(express.json());
app.use(cors());

app.use(logger);

app.use('/auth', authRouter);
app.use('/host', sessionRouter);
app.use('/listen', listenRouter);
app.use('/profile', profileRouter);
app.use('/location', locationRouter);
app.use('/nearby', nearbyRouter);

const dbUser = process.env.MONGODB_USER;
const dbPassword = process.env.MONGODB_PASSWORD;

const uri = `mongodb+srv://${dbUser}:${dbPassword}@unify.nr15b.mongodb.net/Unify?retryWrites=true&w=majority&appName=Unify`
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
mongoose.connect(uri, clientOptions).then(
  () => { console.log('Database connection established'); },
  err => { console.error(`Database connection error: ${err.message}`); }
);

function logger(req, res, next) {
  console.log(`Called: ${req.originalUrl}`);
  next();
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});