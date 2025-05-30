const mongoose = require('mongoose');

const forumSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  commentCount: { type: Number, default: 0 },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: { createdAt: 'creationDate', updatedAt: 'updatedAt' } });

module.exports = mongoose.model('Forum', forumSchema);
