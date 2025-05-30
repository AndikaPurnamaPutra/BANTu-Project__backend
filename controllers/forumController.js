const Forum = require('../models/Forum');
const CommentForum = require('../models/CommentForum');

exports.create = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userID = req.user;

    const forum = new Forum({ title, description, userID });
    await forum.save();

    res.status(201).json(forum);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const forums = await Forum.find()
      .populate('userID', '-password')
      .sort({ creationDate: -1 });
    res.json(forums);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const forum = await Forum.findById(req.params.id).populate(
      'userID',
      '-password'
    );
    if (!forum) return res.status(404).json({ message: 'Forum not found' });
    res.json(forum);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const forum = await Forum.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!forum) return res.status(404).json({ message: 'Forum not found' });
    res.json(forum);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const forum = await Forum.findByIdAndDelete(req.params.id);
    if (!forum) return res.status(404).json({ message: 'Forum not found' });

    // Hapus semua komentar yang terkait forum ini
    await CommentForum.deleteMany({ forumID: req.params.id });

    res.json({ message: 'Forum and its comments deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
