const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();
const verifySpotifyTokenMiddleware = require('../middleware/verifySpotifyToken');

const router = express.Router();

router.post('/register', verifySpotifyTokenMiddleware, async (req, res) => {
  try {
    const { username, spotify_token, spotify_refresh_token, spotify_expires_in, social_instagram } = req.body;

    const user = new User({ username, spotify_token, spotify_refresh_token, spotify_expires_in, social_instagram });
    await user.save();
    res.status(201).send({ message: `User ${username} created` });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.post('/login', verifySpotifyTokenMiddleware, async (req, res) => {
  const { identifier } = req.body;
  const user = await User.findOne({ spotify_token: identifier });

  if (!user) {
    return res.status(401).send({ error: 'Invalid credentials' });
  }
  const isMatch = await bcrypt.compare(identifier, user.spotify_token);
  if (!isMatch) {
    return res.status(401).send({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  res.send({ token });
});