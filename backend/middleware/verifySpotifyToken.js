const { verifySpotifyToken } = require('../routes/spotify');

async function verifySpotifyTokenMiddleware(req, res, next) {
  const { spotify_token } = req.body;

  const isTokenValid = await verifySpotifyToken(spotify_token);
  if (!isTokenValid) {
    return res.status(400).send({ error: 'Invalid Spotify token' });
  }

  next();
}

module.exports = verifySpotifyTokenMiddleware;