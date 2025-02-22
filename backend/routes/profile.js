const express = require('express');
const verifySpotifyTokenMiddleware = require("../middleware/verifySpotifyToken");
const User = require('../models/user');
const { getSpotifyProfile } = require('../routes/spotify');
const verifyUserToken = require('../middleware/verifyUserToken');

const router = express.Router();

// Probably wont be using this.

router.get('/:id', verifyUserToken, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.id });

    const data = await getSpotifyProfile(user.spotify_token, req.params.id);
    res.send(data);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;