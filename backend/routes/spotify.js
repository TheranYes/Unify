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
  console.log("trying refresh")
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
    console.log(response.status)
    const { access_token, refresh_token, expires_in } = await response.data;
    console.log('Refreshed Spotify token', access_token, refresh_token, expires_in);
    return { access_token, refresh_token, expires_in };
  } catch (error) {
    throw new Error('Failed use refresh Spotify token');
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

// Get spotify user profile by id/username
async function getSpotifyProfile(token, userId) {
  try {
    const response = await axios.get(`https://api.spotify.com/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }
  catch (error) {
    throw new Error('Failed to get Spotify profile');
  }
}

async function getCurrentTrack(token) {
  try {
    const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.data.item) {
      return { images: [], name: 'No track playing' };
    }

    const images = response.data.item.album.images;
    const name = response.data.item.name;

    return { images, name };
  } catch (error) {
    throw new Error('Failed to get current track');
  }
}

async function getLastPlayed(token) {
  try {
    const response = await axios.get('https://api.spotify.com/v1/me/player/recently-played', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Reponse data', response.data);

    if (!response.data.items) {
      return { images: [], name: 'No track played' };
    }

    const images = response.data.items[0].track.album.images;
    const name = response.data.items[0].track.name;

    return { images, name };
  } catch (error) {
    throw new Error('Failed to get last played track');
  }
}

async function activateDevice(user) {
  const body = await fetch("https://api.spotify.com/v1/me/player/devices", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${user.spotify_token}`,
    },
  });

  if (!body.ok) {
    return { code: 500, message: "Failed to get devices" };
  }

  let device_data = await body.json();
  if (!device_data || device_data.devices.length === 0) {
    return { code: 404, message: "No devices found" };
  }

  let device_id = device_data.devices[0].id;
  for (let device of device_data.devices) {
    if (device.is_active) {
      return { code: 200, message: "Device active" };
    }
  }

  const body_activate = await fetch(`https://api.spotify.com/v1/me/player`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${user.spotify_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      device_ids: [device_id],
      play: true,
    }),
  });
  if (!body_activate.ok) {
    return { code: 500, message: "Failed to activate device" };
  }

  return { code: 200, message: "Device activated" };
}

module.exports = { verifySpotifyToken, refreshSpotifyToken, getSpotifyUserId, getSpotifyProfile, getCurrentTrack, getLastPlayed, activateDevice };