const mongoose = require('mongoose');

const userEventSchema = new mongoose.Schema({
  eventID: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  joinedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending',
  },
  role: {
    type: String,
    enum: ['participant', 'speaker', 'organizer'],
    default: 'participant',
  },
  notes: { type: String },
});

// Index unik supaya user tidak bisa mendaftar lebih dari sekali di event yang sama
userEventSchema.index({ userID: 1, eventID: 1 }, { unique: true });

module.exports = mongoose.model('UserEvent', userEventSchema);
