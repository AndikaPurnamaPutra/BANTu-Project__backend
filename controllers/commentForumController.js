const CommentForum = require('../models/CommentForum');
const Forum = require('../models/Forum');

exports.create = async (req, res) => {
  try {
    const { forumID, content } = req.body;
    const userID = req.user;

    const newComment = new CommentForum({ forumID, content, userID });
    await newComment.save();

    // Update count komentar di forum
    await Forum.findByIdAndUpdate(forumID, { $inc: { commentCount: 1 } });

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getByForum = async (req, res) => {
  try {
    const comments = await CommentForum.find({ forumID: req.params.forumID })
      .populate('userID', '-password')
      .sort({ creationDate: 1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const comment = await CommentForum.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const comment = await CommentForum.findByIdAndDelete(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    // Kurangi commentCount di forum terkait
    await Forum.findByIdAndUpdate(comment.forumID, { $inc: { commentCount: -1 } });

    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
