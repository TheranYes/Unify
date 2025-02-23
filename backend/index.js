const express = require('express');
const cors = require('cors');
const Session = require('./models/session.js');
const User = require('./models/user.js');
const mongoose = require('mongoose');
const {verifySpotifyToken, refreshSpotifyToken } = require('./routes/spotify.js');
require('dotenv').config();

const sessionRouter = require('./routes/session.js');
const authRouter = require('./routes/auth.js');
const listenRouter = require('./routes/listen.js');
const profileRouter = require('./routes/profile.js');
const locationRouter = require('./routes/location.js');
const nearbyRouter = require('./routes/nearby.js');

const app = express();
const PORT = process.env.SERVER_PORT || 3001;

app.use(express.json());
app.use(cors());

app.use(logger);

app.use('/auth', authRouter);
app.use('/host', sessionRouter);
app.use('/listen', listenRouter);
app.use('/profile', profileRouter);
app.use('/location', locationRouter);
app.use('/nearby', nearbyRouter);

const dbUser = process.env.MONGODB_USER;
const dbPassword = process.env.MONGODB_PASSWORD;

const uri = `mongodb+srv://${dbUser}:${dbPassword}@unify.nr15b.mongodb.net/Unify?retryWrites=true&w=majority&appName=Unify`
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
mongoose.connect(uri, clientOptions).then(
  () => { console.log('Database connection established'); },
  err => { console.error(`Database connection error: ${err.message}`); }
);

async function pingSession(session) {
  const host = await User.findOne({ username: session.host });
  const isValidToken = await verifySpotifyToken(host.spotify_token);
  if (!isValidToken) {
    const { access_token, refresh_token, expires_in } = await refreshSpotifyToken(user.spotify_refresh_token);
    host.spotify_token = access_token;
    host.spotify_refresh_token = refresh_token;
    host.spotify_expires_in = Date.now() + expires_in * 1000;
    await host.save();
  }
  const body_host = await fetch("https://api.spotify.com/v1/me/player", {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${host.spotify_token}`
    }
  });

  if (body_host.status !== 200) {
    for (let listener of session.listening) {
      const listenerUser = await User.findOne({ username: listener });
      listenerUser.listening_to = null;
      await listenerUser.save();
    }
    await Session.deleteOne({ host: session.host });
    return;
  }

  if (!session.listening || session.listening.length === 0) {
    return;
  }
  const playbackState = await body_host.json(); 
  if (playbackState.timestamp !== session.last_changed) {
    console.log("update listeners")
    for (let listener of session.listening) {
      // start listening to same song
      const listenerUser = await User.findOne({ username: listener });
      const body_listener = await fetch("https://api.spotify.com/v1/me/player/play", {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${listenerUser.spotify_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uris: [playbackState.item.uri],
        position_ms: playbackState.progress_ms
      })});
      if (body_listener.status !== 204) {
        throw new Error('Failed to sync to session');
      }
    

      // pause if not playing
      if (!playbackState.is_playing) {
        await (() => new Promise(resolve => setTimeout(resolve, 2000)))();
        const body_pause = await fetch("https://api.spotify.com/v1/me/player/pause", {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${listenerUser.spotify_token}`,
          }
        });
      }
    }
    session.last_changed = playbackState.timestamp;
    await session.save();
  }
}

let isPinging = false;
setInterval(async () => {
  if (isPinging) return;
  isPinging = true;
  try {
    const sessions = await Session.find();
    for (let session of sessions) {
      await pingSession(session);
    }
  } catch (error) {
    console.error(`Error during session ping: ${error.message}`);
  } finally {
    isPinging = false;
  }
}, 1000);

function logger(req, res, next) {
  console.log(`Called: ${req.originalUrl}`);
  next();
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});