// const express = require('express');
// const router = express.Router();
// const lokerController = require('../controllers/lokerController');
// const protect = require('../middleware/authMiddleware');
// const uploadLokerMiddleware = require('../middleware/uploadLokerMiddleware');

// router.post('/', protect, uploadLokerMiddleware.single('thumbnail'), lokerController.create);
// router.put('/:id', protect, uploadLokerMiddleware.single('thumbnail'), lokerController.update);
// router.get('/', lokerController.getAll);
// router.get('/:id', lokerController.getById);
// router.delete('/:id', protect, lokerController.delete);

// module.exports = router;

// routes/lokerRoutes.js
const express = require('express');
const router = express.Router();
const lokerController = require('../controllers/lokerController');
// **PERUBAHAN:** Destructuring untuk mengimpor fungsi spesifik
const {
  authenticateToken,
  authorizeRoles,
} = require('../middleware/authMiddleware');
const uploadLokerMiddleware = require('../middleware/uploadLokerMiddleware');

// Buat loker (biasanya hanya admin atau perusahaan yang terdaftar yang bisa)
router.post(
  '/',
  authenticateToken,
  authorizeRoles('admin'), // Asumsi hanya admin yang bisa membuat loker
  uploadLokerMiddleware.single('thumbnail'),
  lokerController.create
);

// Perbarui loker (hanya admin atau pemilik loker yang bisa)
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('admin'), // Asumsi hanya admin yang bisa memperbarui loker
  uploadLokerMiddleware.single('thumbnail'),
  lokerController.update
);

// Dapatkan semua loker (biasanya publik)
router.get('/', lokerController.getAll);

// Dapatkan loker berdasarkan ID (biasanya publik)
router.get('/:id', lokerController.getById);

// Hapus loker (hanya admin atau pemilik loker yang bisa)
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('admin'), // Asumsi hanya admin yang bisa menghapus loker
  lokerController.delete
);

module.exports = router;
