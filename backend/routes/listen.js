const express = require('express');
const Session = require('../models/session.js');
const User = require('../models/user.js');
const router = express.Router();
const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

router.post('/listen', async (req, res) => {
    try {
      const token = req.header('Authorization').replace('Bearer ', '');
      const user = await User.findOne( { token });
      if (!user) {
          return res.status(400).json({ message: 'User not found' });
      }
  
      const userId = user.uid;
      const userSession = await Session.findOne({ host: userId });
      if (userSession) {
          return res.status(400).json({ message: 'User is hosting' });
      }
  
      const { hostId } = req.body;
      const session = await Session.findOne({ host: hostId });
      if (!session) {
          return res.status(400).json({ message: 'Invalid host' });
      }
  
      if (user.isListeningTo === hostId) {
          return res.status(400).json({ message: 'User is already listening' });
      }
  
      session.listeners.push(userId);
      user.isListeningTo = hostId;
      await user.save();
      await session.save();
  
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  router.delete('/listen', async (req, res) => {
    try {
      const token = req.header('Authorization').replace('Bearer ', '');
      const user = await User.findOne( { token });
      if (!user) {
          return res.status(400).json({ message: 'User not found' });
      }

      if (user.listeningTo == null) {
          return res.status(400).json({ message: 'User is not listening' });
      }
  
      const hostId = user.listeningTo;
      const session = await Session.findOne({ host: hostId });
      session.listeners = session.listeners.filter(listener => listener !== user.uid);
      user.listeningTo = null;
      await user.save();
      await session.save();    
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  export default router;