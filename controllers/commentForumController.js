const CommentForum = require('../models/CommentForum');
const Forum = require('../models/Forum');

exports.create = async (req, res) => {
  try {
    const { forumID, content } = req.body;
    const userID = req.user.userId; // PERBAIKAN: Mengambil userID dari token yang diautentikasi

    if (!userID) {
      return res
        .status(401)
        .json({
          message: 'Tidak terautentikasi. ID pengguna tidak ditemukan.',
        });
    }

    const newComment = new CommentForum({ forumID, content, userID });
    await newComment.save();

    // Update count komentar di forum
    await Forum.findByIdAndUpdate(forumID, { $inc: { commentCount: 1 } });

    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res
      .status(500)
      .json({ message: error.message || 'Gagal menambahkan komentar.' });
  }
};

exports.getByForum = async (req, res) => {
  try {
    const comments = await CommentForum.find({ forumID: req.params.forumID })
      .populate('userID', 'firstName username profilePic') // PERBAIKAN: Memilih field profil user yang relevan
      .sort({ creationDate: 1 });
    res.json(comments);
  } catch (error) {
    console.error('Error in getByForum comments:', error);
    res
      .status(500)
      .json({ message: error.message || 'Gagal mengambil komentar forum.' });
  }
};

exports.update = async (req, res) => {
  try {
    const commentId = req.params.id;
    const { content } = req.body;
    const currentUserId = req.user.userId; // ID user yang sedang login

    const commentToUpdate = await CommentForum.findById(commentId);
    if (!commentToUpdate) {
      return res.status(404).json({ message: 'Komentar tidak ditemukan.' });
    }

    // Otorisasi: Hanya pemilik komentar atau admin yang bisa update
    if (
      commentToUpdate.userID.toString() !== currentUserId.toString() &&
      req.user.role !== 'admin'
    ) {
      return res
        .status(403)
        .json({
          message: 'Anda tidak memiliki izin untuk mengupdate komentar ini.',
        });
    }

    const updatedComment = await CommentForum.findByIdAndUpdate(
      commentId,
      { content }, // Hanya update content
      { new: true, runValidators: true }
    );

    res.json(updatedComment);
  } catch (error) {
    console.error('Error updating comment:', error);
    res
      .status(500)
      .json({ message: error.message || 'Gagal mengupdate komentar.' });
  }
};

exports.delete = async (req, res) => {
  try {
    const commentId = req.params.id;
    const currentUserId = req.user.userId; // ID user yang sedang login

    const commentToDelete = await CommentForum.findById(commentId);
    if (!commentToDelete) {
      return res.status(404).json({ message: 'Komentar tidak ditemukan.' });
    }

    // Otorisasi: Hanya pemilik komentar atau admin yang bisa delete
    if (
      commentToDelete.userID.toString() !== currentUserId.toString() &&
      req.user.role !== 'admin'
    ) {
      return res
        .status(403)
        .json({
          message: 'Anda tidak memiliki izin untuk menghapus komentar ini.',
        });
    }

    await CommentForum.findByIdAndDelete(commentId);

    // Kurangi commentCount di forum terkait
    await Forum.findByIdAndUpdate(commentToDelete.forumID, {
      $inc: { commentCount: -1 },
    });

    res.json({ message: 'Komentar berhasil dihapus.' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res
      .status(500)
      .json({ message: error.message || 'Gagal menghapus komentar.' });
  }
};
