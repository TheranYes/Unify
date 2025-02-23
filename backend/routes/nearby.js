const express = require('express');
const Session = require('../models/session.js');
const User = require('../models/user.js');
const router = express.Router();

const RADIUS_MILES = 5;

const milesToRadians = (mi) => {
    return mi / 3963;
}

router.get('/nearby', async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const { lat, long } = req.body;
        
        if (!lat || !long) {
            return res.status(400).json({ message: 'Missing required parameters' });
        }

        const query = {
            location: {
            $geoWithin: {
                $centerSphere: [[long, lat], milesToRadians(RADIUS_MILES)]
            }
            }
        };

        const sessions = await Session.find(query).sort({
            location: {
            $geoNear: {
                $geometry: { type: "Point", coordinates: [long, lat] },
                $maxDistance: milesToRadians(RADIUS_MILES),
                $spherical: true
            }
            }
        });
        
        const nearbyHosts = [];
        for (const session of sessions) {
            const host = await User.findOne({ uid: session.host });
            const playbackState = await fetch(`${SPOTIFY_API_URL}/me/player`, {
                headers: {
                    Authorization: `Bearer ${host.token}`
                }
            });

            if (!playbackState.ok) {
                // TODO: Log error
                continue;
            }

            const playbackStateJson = await playbackState.json();
            nearbyHosts.push({
                hostId: host.uid,
                hostName: host.name,
                nowPlaying: playbackStateJson.item.name,
                nowPlayingImg: playbackStateJson.item.album.images.uri,
            });
        }
        res.json(nearbyHosts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

export default router;