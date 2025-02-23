const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
    host: { type: String, required: true, maxLength: 100 },
    last_changed: { type: Number, required: true },
    listening: { type: [String], required: true },
}, { collection: 'sessions' });

module.exports = mongoose.model('Session', SessionSchema);