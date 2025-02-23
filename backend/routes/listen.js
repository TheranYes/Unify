const express = require('express');
const jwt = require('jsonwebtoken');
const Session = require('../models/session.js');
const User = require('../models/user.js');
const verifySpotifyTokenMiddleware = require('../middleware/verifySpotifyToken');
const { activateDevice } = require("../routes/spotify");
const router = express.Router();

async function syncToSession(user, session) {
  const host = await User.findOne({ username: session.host });
  const body = await fetch("https://api.spotify.com/v1/me/player", {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${host.spotify_token}`
      }
  });

  if (body.status !== 200) {
    throw new Error('Could not sync to session');
  }

  const playbackState = await body.json();
  console.log(playbackState.item.uri)
  const body_start = await fetch("https://api.spotify.com/v1/me/player/play", {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${user.spotify_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      uris: [playbackState.item.uri],
      position_ms: playbackState.progress_ms
    })
  });
  console.log(body_start.status)
  if (!body_start.ok) {
    throw new Error('Failed to sync to session');
  }

  if (!playbackState.is_playing) {
    await (new Promise(resolve => setTimeout(resolve, 2000)));
    const body_pause = await fetch("https://api.spotify.com/v1/me/player/pause", {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${user.spotify_token}`
      }
    });
    
    // if (body_pause.status !== 204) {
    //   throw new Error('Failed to pause session');
    // }
  }
}
router.post('/', verifySpotifyTokenMiddleware, async (req, res) => {
  const access_token = req.header('Authorization').replace('Bearer ', '');
  let userId;
  try {
      const decoded = jwt.verify(access_token, process.env.JWT_SECRET);
      userId = decoded.id;
  } catch (error) {
      return res.status(401).send('Unauthorized');
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
        return res.status(400).send({ error: 'User not found' });
    }

    const { code, msg } = await activateDevice(user);
    if (code !== 200) {
      return res.status(code).json({ message: msg });
    }
    
    const { host_username } = req.body;
    const session = await Session.findOne({ host: host_username });
    if (!session) {
        return res.status(400).send({ error: 'Invalid host' });
    }

    if (user.username === host_username) {
      return res.status(400).send({ error: 'Cannot listen to self' });
    }

    if (user.listening_to === host_username) {
      return res.status(400).send({ error: 'User is already listening' });
    }

    session.listening.push(user.username);
    await session.save();
    if (user.listening_to !== null) {
      const session = await Session.findOne({ host: user.listening_to });
      session.listening = session.listening.filter(listener => listener !== user.username);
      await session.save();
    }
    user.listening_to = host_username;
    await user.save();

    await syncToSession(user, session);
    return res.status(200).json({ message: 'Started listening' });
  } catch (err) {
      return res.status(500).json({ message: err.message });
  }
});
  
router.delete('/', verifySpotifyTokenMiddleware, async (req, res) => {
  const access_token = req.header('Authorization').replace('Bearer ', '');
  let userId;
  try {
      const decoded = jwt.verify(access_token, process.env.JWT_SECRET);
      userId = decoded.id;
  } catch (error) {
      return res.status(401).send('Unauthorized');
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).send({ error: 'User not found' });
    }

    if (user.listening_to === null) {
      return res.status(400).send({ error: 'User is not listening' });
    }

    const session = await Session.findOne({ host: user.listening_to });
    session.listening = session.listening.filter(listener => listener !== user.username);
    user.listening_to = null;
    await session.save();
    await user.save();
    return res.status(200).json({ message: 'Stopped listening' });
  } catch (err) {
      return res.status(500).json({ message: err.message });
  }
});

router.get('/', verifySpotifyTokenMiddleware, async (req, res) => {
  const access_token = req.header('Authorization').replace('Bearer ', '');
  let userId;
  try {
    const decoded = jwt.verify(access_token, process.env.JWT_SECRET);
    userId = decoded.id;
  } catch (error) {
    return res.status(401).send('Unauthorized');
  }

  console.log(userId);
  try {
    const user = await User.findById(userId);
    if (!user) {
    return res.status(400).send({ error: 'User not found' });
    }

    if (user.listening_to === null) {
    return res.status(200).send({ listening_to: null });
    }

    return res.status(200).json({ listening_to: user.listening_to });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});
module.exports = router;