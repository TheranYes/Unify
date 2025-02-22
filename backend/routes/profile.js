const verifySpotifyTokenMiddleware = require("../middleware/verifySpotifyToken");

const router = express.Router();

router.get('/profile/:id', verifySpotifyTokenMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    const data = await getSpotifyProfile(user.spotify_token, user.spotify_id);
    res.send(data);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});