const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();
const verifySpotifyTokenMiddleware = require('../middleware/verifySpotifyToken');
const { getSpotifyUserId } = require('../routes/spotify');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { access_token, refresh_token, expires_in } = req.body;

    const username = await getSpotifyUserId(access_token);

    let user = await User.findOne({ username });
    let newUser = false;

    // Make new user if not found
    if (!user) {
      newUser = true;
      user = new User({ username });
    }

    // Set user last_login to current date
    user.last_login = Date.now();

    // security is my passion
    user.spotify_token = access_token
    user.spotify_refresh_token = refresh_token;

    user.spotify_expires_in = Date.now() + expires_in * 1000;
    user.username = username;

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    if (newUser) {
      console.log(`New user ${user.username} created`);
    }
    console.log(`User ${user.username} logged in`);

    res.status(201).send({ token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;

