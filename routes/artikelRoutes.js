// const express = require('express');
// const router = express.Router();
// const artikelController = require('../controllers/artikelController');
// const protect = require('../middleware/authMiddleware');
// const uploadArtikelMiddleware = require('../middleware/uploadArtikelMiddleware');

// router.post('/', protect, uploadArtikelMiddleware.single('coverImage'), artikelController.create);
// router.put('/:id', protect, uploadArtikelMiddleware.single('coverImage'), artikelController.update);
// router.get('/', artikelController.getAll);
// router.get('/:id', artikelController.getById);
// router.delete('/:id', protect, artikelController.delete);

// module.exports = router;

// routes/artikelRoutes.js
const express = require('express');
const router = express.Router();
const artikelController = require('../controllers/artikelController');
// **PERUBAHAN:** Destructuring untuk mengimpor fungsi spesifik
const {
  authenticateToken,
  authorizeRoles,
} = require('../middleware/authMiddleware');
const uploadArtikelMiddleware = require('../middleware/uploadArtikelMiddleware');

// Buat artikel (biasanya hanya admin atau editor yang bisa)
router.post(
  '/',
  authenticateToken,
  authorizeRoles('admin'), // Hanya admin yang bisa membuat artikel
  uploadArtikelMiddleware.single('coverImage'),
  artikelController.create
);

// Perbarui artikel (hanya admin atau editor yang bisa)
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('admin'), // Hanya admin yang bisa memperbarui artikel
  uploadArtikelMiddleware.single('coverImage'),
  artikelController.update
);

// Dapatkan semua artikel (biasanya publik)
router.get('/', artikelController.getAll);

// Dapatkan artikel berdasarkan ID (biasanya publik)
router.get('/:id', artikelController.getById);

// Hapus artikel (hanya admin yang bisa)
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('admin'), // Hanya admin yang bisa menghapus artikel
  artikelController.delete
);

module.exports = router;
