const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();
const verifySpotifyTokenMiddleware = require('../middleware/verifySpotifyToken');

const router = express.Router();

router.post('/register', verifySpotifyTokenMiddleware, async (req, res) => {
  try {
    const { access_token, refresh_token, expires_in } = req.body;

    const user = new User();
    // Set user last_login to current date
    user.last_login = Date.now();

    // Hash the access_token and refresh_token before saving
    const salt = await bcrypt.genSalt(10);
    user.spotify_token = await bcrypt.hash(access_token, salt);
    user.spotify_refresh_token = await bcrypt.hash(refresh_token, salt);

    user.spotify_expires_in = Date.now() + expires_in * 1000;
    user.username = getSpotifyUserId(access_token);

    await user.save();
    res.status(201).send({ message: `User ${user.username} created` });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

//TODO: rewrite this
router.post('/login', async (req, res) => {
  try {
    const { username, spotify_token } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).send({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(spotify_token, user.spotify_token);
    if (!isMatch) {
      return res.status(400).send({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.send({ token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;

