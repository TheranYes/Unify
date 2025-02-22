const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, maxLength: 100 },
  spotify_token: { type: String, required: true, unique: true},
  spotify_refresh_token: { type: String, required: true },
  spotify_expires_in: { type: Number, required: true },
  last_login: { type: Date, default: Date.now },
  social_instagram: { type: String, maxLength: 200, default: null },
  listening_to: { type: String, maxLength: 100, default: null },
}, {collection: 'users'});

module.exports = mongoose.model('User', UserSchema);