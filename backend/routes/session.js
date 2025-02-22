const express = require('express');
const Session = require('../models/session.js');
const User = require('../models/user.js');
const router = express.Router();
const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

router.post('/host', authMiddleware, async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const user = await User.findOne( { token });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        if (user.listeningTo !== null) {
            return res.status(400).json({ message: 'User is already listening' });
        }

        const userId = user.uid;
        let session = await Session.findOne({ host: userId });
        if (session) {
            return res.status(400).json({ message: 'User is already hosting' });
        }

        // TODO: refresh spotify token if expired

        const response = await fetch('https://api.spotify.com/v1/me/player', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${ user.spotify_token }`
            }
        });
        if (response.status !== 200) {
            return res.status(400).json({ message: 'Cannot host' });
        }

        const lastChanged = response.json().timestamp;
        session = new Session({ host: userId, lastChanged, listeners: [] });
        await session.save();
        res.status(200);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/host', authMiddleware, async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const user = await User.findOne( { token } )
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        
        const userId = user.uid;
        const session = await Session.findOne({ host: userId });
        if (!session) {
            return res.status(400).json({ message: 'User is not hosting' });
        }

        await session.deleteOne();
        res.status(200);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;