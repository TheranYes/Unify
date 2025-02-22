const express = require('express');
const Session = require('../models/session.js');
const router = express.Router();

router.post('/host', authMiddleware, async (req, res) => {
    try {
        const { userId } = req.body;
        let session = await Session.findOne({ host: userId });
        if (session) {
            return res.status(400).json({ message: 'User is already hosting' });
        }

        session = new Session({ host: userId });
        await session.save();
        res.status(200);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/host', authMiddleware, async (req, res) => {
    try {
        const { userId } = req.body;
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