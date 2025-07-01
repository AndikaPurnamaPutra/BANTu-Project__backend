// const express = require('express');
// const router = express.Router();
// const commentForumController = require('../controllers/commentForumController');
// const protect = require('../middleware/authMiddleware');

// router.post('/', protect, commentForumController.create);
// router.get('/forum/:forumID', commentForumController.getByForum);
// router.put('/:id', protect, commentForumController.update);
// router.delete('/:id', protect, commentForumController.delete);

// module.exports = router;

// routes/commentForumRoutes.js
const express = require('express');
const router = express.Router();
const commentForumController = require('../controllers/commentForumController');
// **PERUBAHAN PENTING DI SINI:** Destructuring untuk mengimpor fungsi spesifik
const {
  authenticateToken,
  authorizeRoles,
} = require('../middleware/authMiddleware');

// Rute untuk membuat komentar di forum
router.post(
  '/',
  authenticateToken, // Gunakan authenticateToken di sini
  // Tambahkan otorisasi peran jika diperlukan. Siapa yang bisa membuat komentar?
  // Biasanya semua pengguna yang terautentikasi (designer/artisan/admin)
  // authorizeRoles('designer', 'artisan', 'admin'),
  commentForumController.create // Pastikan 'create' adalah fungsi yang diekspor dari controller
);

// Rute untuk mendapatkan komentar berdasarkan ID forum (biasanya publik)
router.get('/forum/:forumID', commentForumController.getByForum);

// Rute untuk memperbarui komentar
router.put(
  '/:id',
  authenticateToken, // Gunakan authenticateToken di sini
  // Tambahkan otorisasi peran jika diperlukan, misalnya:
  // authorizeRoles('designer', 'artisan', 'admin'), // Hanya pembuat komentar atau admin
  commentForumController.update
);

// Rute untuk menghapus komentar
router.delete(
  '/:id',
  authenticateToken, // Gunakan authenticateToken di sini
  // Tambahkan otorisasi peran jika diperlukan, misalnya:
  // authorizeRoles('designer', 'artisan', 'admin'), // Hanya pembuat komentar atau admin
  commentForumController.delete
);

module.exports = router;
