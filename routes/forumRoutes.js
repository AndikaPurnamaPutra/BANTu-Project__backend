// const express = require('express');
// const router = express.Router();
// const forumController = require('../controllers/forumController');
// const protect = require('../middleware/authMiddleware');

// router.post('/', protect, forumController.create);
// router.get('/', forumController.getAll);
// router.get('/:id', forumController.getById);
// router.put('/:id', protect, forumController.update);
// router.delete('/:id', protect, forumController.delete);

// module.exports = router;

// routes/forumRoutes.js
const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
// **PERUBAHAN PENTING DI SINI:** Destructuring untuk mengimpor fungsi spesifik
const {
  authenticateToken,
  authorizeRoles,
} = require('../middleware/authMiddleware');

// Rute untuk membuat forum (sesuai dengan yang Anda berikan)
router.post(
  '/',
  authenticateToken, // Gunakan authenticateToken di sini
  // Tambahkan otorisasi peran jika diperlukan, misalnya:
  // authorizeRoles('designer', 'artisan', 'admin'), // Siapa saja yang bisa membuat forum?
  forumController.create // Pastikan 'create' adalah fungsi yang diekspor dari controller
);

// Rute untuk mendapatkan semua forum (sesuai yang Anda berikan - tanpa proteksi)
router.get('/', forumController.getAll);

// Rute untuk mendapatkan forum berdasarkan ID (sesuai yang Anda berikan - tanpa proteksi)
router.get('/:id', forumController.getById);

// Rute untuk memperbarui forum
router.put(
  '/:id',
  authenticateToken, // Gunakan authenticateToken di sini
  // Tambahkan otorisasi peran jika diperlukan, misalnya:
  // authorizeRoles('designer', 'admin'), // Hanya pembuat atau admin
  forumController.update
);

// Rute untuk menghapus forum
router.delete(
  '/:id',
  authenticateToken, // Gunakan authenticateToken di sini
  // Tambahkan otorisasi peran jika diperlukan, misalnya:
  // authorizeRoles('designer', 'admin'), // Hanya pembuat atau admin
  forumController.delete
);

module.exports = router;
