const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();

const port = process.env.PORT || 3001;

settings = {
  "SERVER_URL": `http://localhost:${port}`,
  "REDIRECT_URI": `http://localhost:${port}/callback`,
  "CLIENT_SECRET": process.env.CLIENT_SECRET,
  "CLIENT_ID": process.env.CLIENT_ID,
  "SCOPES": "user-read-playback-state user-modify-playback-state user-read-currently-playing streaming",
  "AUTH_ENDPOINT": "https://accounts.spotify.com/authorize",
  "TOKEN_ENDPOINT": "https://accounts.spotify.com/api/token",
  "API_BASE": "https://api.spotify.com/v1",
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const DIST_DIR = path.join(__dirname, "dist");
const HTML_FILE = path.join(DIST_DIR, "index.html");

app.use(express.json());
app.use(express.static("public"));
app.use(express.static("dist"));

app.get("/", (req, res) => {
  res.sendFile(HTML_FILE, function(err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});


app.post("/", (req, res) => {
  const authUrl = new URL(settings.AUTH_ENDPOINT);
  const params = {
    response_type: 'code',
    client_id: settings.CLIENT_ID,
    scope: settings.SCOPES,
    redirect_uri: settings.REDIRECT_URI,
  };

  authUrl.search = new URLSearchParams(params).toString();
  res.redirect(authUrl.toString());
});

app.get("/callback", async (req, res) => {
  const code = req.query.code;

  const response = await fetch(settings.TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: settings.CLIENT_ID,
      client_secret: settings.CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: settings.REDIRECT_URI,
    }),
  });

  const data = await response.json();
  const token = data.access_token;
  const refresh = data.refresh_token;
  const expires_in = data.expires_in;

  res.redirect(`/?access_token=${token}&refresh=${refresh}&expires_in=${expires_in}`);
});