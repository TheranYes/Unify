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

async function refreshSpotifyToken(refreshToken) {
  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', null, {
      params: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: process.env.SPOTIFY_CLIENT_ID,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const { access_token, refresh_token, expires_in } = response.data;
    return { access_token, refresh_token, expires_in };
  } catch (error) {
    throw new Error('Failed to refresh Spotify token');
  }
}

// Get spotify user id from token
async function getSpotifyUserId(token) {
  try {
    const response = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.id;
  } catch (error) {
    throw new Error('Failed to get Spotify user ID');
  }
}

module.exports = { verifySpotifyToken, refreshSpotifyToken, getSpotifyUserId };