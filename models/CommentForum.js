const mongoose = require('mongoose');

const commentForumSchema = new mongoose.Schema({
  forumID: { type: mongoose.Schema.Types.ObjectId, ref: 'Forum', required: true },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
}, { timestamps: { createdAt: 'creationDate', updatedAt: 'updatedAt' } });

module.exports = mongoose.model('CommentForum', commentForumSchema);
