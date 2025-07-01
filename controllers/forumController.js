const Forum = require('../models/Forum');
const CommentForum = require('../models/CommentForum');

exports.create = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userID = req.user.userId; // Mengambil userID dari token yang diautentikasi

    if (!userID) {
      return res
        .status(401)
        .json({
          message: 'Tidak terautentikasi. ID pengguna tidak ditemukan.',
        });
    }

    const forum = new Forum({ title, description, userID });
    await forum.save();

    res.status(201).json(forum);
  } catch (error) {
    console.error('Error creating forum:', error);
    res.status(500).json({ message: error.message || 'Gagal membuat forum.' });
  }
};

exports.getAll = async (req, res) => {
  try {
    const forums = await Forum.find()
      .populate('userID', 'firstName username profilePic') // Memilih field profil user yang relevan
      .sort({ creationDate: -1 });
    res.json(forums);
  } catch (error) {
    console.error('Error in getAll forums:', error);
    res
      .status(500)
      .json({ message: error.message || 'Gagal mengambil forum.' });
  }
};

exports.getById = async (req, res) => {
  try {
    const forum = await Forum.findById(req.params.id).populate(
      'userID',
      'firstName username profilePic'
    );
    if (!forum) {
      return res.status(404).json({ message: 'Forum tidak ditemukan.' });
    }
    res.json(forum);
  } catch (error) {
    console.error('Error in getById forum:', error);
    res
      .status(500)
      .json({ message: error.message || 'Gagal mengambil detail forum.' });
  }
};

exports.update = async (req, res) => {
  try {
    const forumId = req.params.id;
    const { title, description } = req.body;
    const currentUserId = req.user.userId; // ID user yang sedang login

    const forumToUpdate = await Forum.findById(forumId);
    if (!forumToUpdate) {
      return res.status(404).json({ message: 'Forum tidak ditemukan.' });
    }

    // Otorisasi: Hanya pemilik forum atau admin yang bisa update
    if (
      forumToUpdate.userID.toString() !== currentUserId.toString() &&
      req.user.role !== 'admin'
    ) {
      return res
        .status(403)
        .json({
          message: 'Anda tidak memiliki izin untuk mengupdate forum ini.',
        });
    }

    const updatedForum = await Forum.findByIdAndUpdate(
      forumId,
      { title, description },
      { new: true, runValidators: true }
    );

    res.json(updatedForum);
  } catch (error) {
    console.error('Error updating forum:', error);
    res
      .status(500)
      .json({ message: error.message || 'Gagal mengupdate forum.' });
  }
};

exports.delete = async (req, res) => {
  try {
    const forumId = req.params.id;
    const currentUserId = req.user.userId; // ID user yang sedang login

    const forumToDelete = await Forum.findById(forumId);
    if (!forumToDelete) {
      return res.status(404).json({ message: 'Forum tidak ditemukan.' });
    }

    // Otorisasi: Hanya pemilik forum atau admin yang bisa delete
    if (
      forumToDelete.userID.toString() !== currentUserId.toString() &&
      req.user.role !== 'admin'
    ) {
      return res
        .status(403)
        .json({
          message: 'Anda tidak memiliki izin untuk menghapus forum ini.',
        });
    }

    await Forum.findByIdAndDelete(forumId);

    // Hapus semua komentar yang terkait forum ini
    await CommentForum.deleteMany({ forumID: forumId });

    res.json({ message: 'Forum dan komentarnya berhasil dihapus.' });
  } catch (error) {
    console.error('Error deleting forum:', error);
    res
      .status(500)
      .json({ message: error.message || 'Gagal menghapus forum.' });
  }
};
