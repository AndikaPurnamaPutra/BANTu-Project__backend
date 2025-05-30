const mongoose = require('mongoose');

const userLokerSchema = new mongoose.Schema({
  lokerID: { type: mongoose.Schema.Types.ObjectId, ref: 'Loker', required: true },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  appliedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
});

module.exports = mongoose.model('UserLoker', userLokerSchema);
