const axios = require('axios');

async function verifySpotifyToken(token) {
  try {
    const response = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

module.exports = { verifySpotifyToken };