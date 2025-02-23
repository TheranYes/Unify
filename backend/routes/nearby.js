const express = require('express');
const verifyUserToken = require('../middleware/verifyUserToken');
const Session = require('../models/session');
const User = require('../models/user');
const { getSpotifyProfile, getCurrentTrack } = require('./spotify');

const router = express.Router();

const RADIUS_MILES = 5;

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 3963; // Radius of the Earth in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

router.get('/', verifyUserToken, async (req, res) => {
  const user = await User.findById(req.userId);
  if (user.locations.length === 0) {
    return res.status(400).json({ message: 'User has no locations' });
  }

  const lat = user.locations[0].latitude;
  const long = user.locations[0].longitude;

  console.log('User location', lat, long);

  try {
    const sessions = await Session.find({});

    // Add previous nearby users to old_nearby_users (remove duplicates)
    for (const nearby_user of user.nearby_users) {
      if (!user.old_nearby_users.includes(nearby_user)) {
        user.old_nearby_users.push(nearby_user);
      }
    }

    // Clear nearby_users
    user.nearby_users = [];

    console.log('Old nearby users', user.old_nearby_users);
    const hosts = [];

    for (const session of sessions) {
      const hostUser = await User.findOne({ username: session.host });
      if (hostUser && hostUser.locations.length > 0) {
        const hostLat = hostUser.locations[0].latitude;
        const hostLong = hostUser.locations[0].longitude;
        const distance = calculateDistance(lat, long, hostLat, hostLong);

        if (distance <= RADIUS_MILES) {
          // Remove session.host from old_nearby_users
          const index = user.old_nearby_users.indexOf(session.host);
          if (index > -1) {
            user.old_nearby_users.splice(index, 1);
          }

          // Add session.host to nearby_users
          if (!user.nearby_users.includes(session.host)) {
            user.nearby_users.push(session.host);
          }

          const spotifyProfile = await getSpotifyProfile(user.spotify_token, session.host);
          const curSong = await getCurrentTrack(hostUser.spotify_token);
          spotifyProfile.currentSong = curSong.name;
          spotifyProfile.currentSongImg = curSong.images;

          const listeners = [];
          for (const listener of session.listening) {
            const listenerUser = await getSpotifyProfile(user.spotify_token, listener);
            listeners.push(listenerUser);
          }

          spotifyProfile.listeners = listeners;
          hosts.push(spotifyProfile);
        }
      }
    }

    await user.save();

    res.json(hosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;