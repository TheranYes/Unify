const jwt = require('jsonwebtoken');
const { verifySpotifyToken, refreshSpotifyToken } = require('../routes/spotify');
const User = require('../models/user');

async function verifyUserToken(req, res, next) {
  // Get token from request header
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) {
    return res.status(400).send({ error: 'Access token not found' });
  }

  let userId;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.id;
    req.userId = userId;
  } catch (error) {
    return res.status(401).send('Unauthorized');
  }

  const user = await User
    .findById(userId)
    .select('spotify_token spotify_refresh_token spotify_expires_in');
  
  if (!user) {
    return res.status(400).send({ error: 'User not found' });
  }

  console.log('User found:', user);

  const isTokenValid = await verifySpotifyToken(user.spotify_token);
  console.log('isTokenValid', isTokenValid);
  if (!isTokenValid) {
    if (Date.now() >= user.spotify_expires_in) {
      console.log('Token expired: ', Date.now() - user.spotify_expires_in);
      try {
        const { access_token, refresh_token, expires_in } = await refreshSpotifyToken(user.spotify_refresh_token);
        console.log('Refreshed Spotify token');
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

module.exports = verifyUserToken;