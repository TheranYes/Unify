const mongoose = require('mongoose');

const GeoLocationSchema = new mongoose.Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

const NearbyUserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  timestamp: { type: Number, default: Date.now },
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, maxLength: 100 },
  spotify_token: { type: String, required: true, unique: true},
  spotify_refresh_token: { type: String, required: true },
  spotify_expires_in: { type: Number, required: true },
  last_login: { type: Date, default: Date.now },
  locations: { type: [GeoLocationSchema], default: [] },
  social_instagram: { type: String, maxLength: 200, default: null },
  listening_to: { type: String, maxLength: 100, default: null },
  nearby_users: { type: [NearbyUserSchema], default: [] },
  old_nearby_users: { type: [NearbyUserSchema], default: [] },
}, {collection: 'users'});

module.exports = mongoose.model('User', UserSchema);