const { verifySpotifyToken, refreshSpotifyToken } = require('../routes/spotify');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

async function verifySpotifyTokenMiddleware(req, res, next) {
  // Get token from request header
  const access_token = req.header('Authorization').replace('Bearer ', '');
  if (!access_token) {
    return res.status(400).send({ error: 'Access token not found' });
  }

  try {
    const decoded = jwt.verify(access_token, process.env.JWT_SECRET);
    userId = decoded.id;
    req.userId = userId;
  } catch (error) {
    res.status(401).send('Unauthorized');
  }

  const user = await User
    .findById(userId)
    .select('spotify_token spotify_refresh_token spotify_expires_in');

  if (!user) {
    return res.status(400).send({ error: 'User not found' });
  }

  const isTokenValid = await verifySpotifyToken(user.spotify_token);
  if (!isTokenValid) {
    if (Date.now() >= user.spotify_expires_in) {
      try {
        const { spotify_token, refresh_token, expires_in } = await refreshSpotifyToken(user.spotify_refresh_token);
        user.spotify_token = spotify_token;
        user.spotify_refresh_token = refresh_token;
        user.spotify_expires_in = Date.now() + expires_in * 1000;
        await user.save();
        req.body.spotify_token = spotify_token;
      } catch (error) {
        return res.status(400).send({ error: 'Failed to refresh Spotify token' });
      }
    } else {
      return res.status(400).send({ error: 'Invalid Spotify token' });
    }
  }

  next();
}

module.exports = verifySpotifyTokenMiddleware;