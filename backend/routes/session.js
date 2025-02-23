const express = require("express");
const jwt = require("jsonwebtoken");
const Session = require("../models/session.js");
const User = require("../models/user.js");
const verifySpotifyTokenMiddleware = require("../middleware/verifySpotifyToken");
const { activateDevice } = require("../routes/spotify");
const router = express.Router();

router.post("/", verifySpotifyTokenMiddleware, async (req, res) => {
  const access_token = req.header("Authorization").replace("Bearer ", "");
  let userId;
  try {
    const decoded = jwt.verify(access_token, process.env.JWT_SECRET);
    userId = decoded.id;
  } catch (error) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).send({ error: "User not found" });
    }

    if (user.listening_to !== null) {
      // Remove user from list of listeners
      const session = await Session.findOne({ host: user.listening_to });
      console.log(user.username);
      session.listening = session.listening.filter(
        (listener) => listener !== user.username
      );
      user.listening_to = null;
      await session.save();
    }

    const { tagline } = req.body;
    if (tagline) user.tagline = tagline;
    await user.save();
    const username = user.username;
    let session = await Session.findOne({ host: user.username });
    if (session) {
      return res.status(400).send({ error: "User is already hosting" });
    }

    const { code, msg } = await activateDevice(user);
    if (code !== 200) {
      return res.status(code).json({ message: msg });
    }
    const body = await fetch("https://api.spotify.com/v1/me/player", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${user.spotify_token}`,
      },
    });

    if (body.status !== 200) {
      return res.status(400).json({ message: "Cannot host" });
    }

    const response = await body.json();
    const last_changed = response.timestamp;

    session = new Session({ host: username, last_changed, listeners: [] });
    await session.save();
    return res.status(200).json({ message: "Started hosting" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.delete("/", verifySpotifyTokenMiddleware, async (req, res) => {
  const access_token = req.header("Authorization").replace("Bearer ", "");
  let userId;
  try {
    const decoded = jwt.verify(access_token, process.env.JWT_SECRET);
    userId = decoded.id;
  } catch (error) {
    return res.status(401).send("Unauthorized");
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).send({ error: "User not found" });
    }

    const session = await Session.findOne({ host: user.username });
    if (!session) {
      return res.status(400).send({ error: "User is not hosting" });
    }

    await Session.deleteOne({ host: user.username });
    res.status(200).json({ message: "Stopped hosting" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.get("/", verifySpotifyTokenMiddleware, async (req, res) => {
  const access_token = req.header("Authorization").replace("Bearer ", "");
  let userId;
  try {
    const decoded = jwt.verify(access_token, process.env.JWT_SECRET);
    userId = decoded.id;
  } catch (error) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).send({ error: "User not found" });
    }

    const session = await Session.findOne({ host: user.username });
    if (!session) {
      return res.status(200).json({ isBroadcasting: false });
    }

    return res.status(200).json({ isBroadcasting: true });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
