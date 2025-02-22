const { verifySpotifyToken, refreshSpotifyToken } = require('../routes/spotify');
const User = require('../models/user');

async function verifySpotifyTokenMiddleware(req, res, next) {
  const { spotify_token, username } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).send({ error: 'User not found' });
  }

  const isTokenValid = await verifySpotifyToken(spotify_token);
  if (!isTokenValid) {
    if (Date.now() >= user.spotify_expires_in) {
      try {
        const { access_token, refresh_token, expires_in } = await refreshSpotifyToken(user.spotify_refresh_token);
        user.spotify_token = access_token;
        user.spotify_refresh_token = refresh_token;
        user.spotify_expires_in = Date.now() + expires_in * 1000;
        await user.save();
        req.body.spotify_token = access_token;
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