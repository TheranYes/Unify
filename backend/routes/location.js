const verifyUserToken = require("../middleware/verifyUserToken");
const express = require('express');
const User = require('../models/user');

const router = express.Router();

const LOCATION_LIMIT = 6;

router.post('/update', verifyUserToken, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    const newLocation = {
      latitude,
      longitude,
      timestamp: new Date(),
    };

    user.locations.unshift(newLocation);
    if (user.locations.length > LOCATION_LIMIT) {
      user.locations.pop();
    }

    user.save();
    res.status(200).send({ message: 'Location updated' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
