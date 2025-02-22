const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, maxLength: 100 },
  spotify_token: { type: String, required: true, unique: true},
  spotify_refresh_token: { type: String, required: true },
  spotify_expires_in: { type: Number, required: true },
  social_instagram: { type: String, maxLength: 200 },
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('spotify_token')) return next();
  const salt = await bcrypt.genSalt(10);
  this.spotify_token = await bcrypt.hash(this.spotify_token, salt);
  next();
});

module.exports = mongoose.model('User', UserSchema);