const express = require('express');
const router = express.Router();
const commentForumController = require('../controllers/commentForumController');
const {
  authenticateToken,
  authorizeRoles,
} = require('../middleware/authMiddleware');

// Rute untuk membuat komentar di forum
router.post(
  '/',
  authenticateToken,
  // Semua pengguna yang terautentikasi (designer, artisan, admin) bisa membuat komentar
  authorizeRoles('designer', 'artisan', 'admin'),
  commentForumController.create
);

// Rute untuk mendapatkan komentar berdasarkan ID forum (biasanya publik)
router.get('/forum/:forumID', commentForumController.getByForum);

// Rute untuk memperbarui komentar
router.put(
  '/:id',
  authenticateToken,
  // Hanya pemilik komentar atau admin yang bisa mengupdate.
  // Otorisasi detail ada di controller.
  authorizeRoles('designer', 'artisan', 'admin'),
  commentForumController.update
);

// Rute untuk menghapus komentar
router.delete(
  '/:id',
  authenticateToken,
  // Hanya pemilik komentar atau admin yang bisa menghapus.
  // Otorisasi detail ada di controller.
  authorizeRoles('designer', 'artisan', 'admin'),
  commentForumController.delete
);

module.exports = router;
