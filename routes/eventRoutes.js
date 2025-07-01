// const express = require('express');
// const router = express.Router();
// const eventController = require('../controllers/eventController');
// const protect = require('../middleware/authMiddleware');
// const uploadEventMiddleware = require('../middleware/uploadEventMiddleware');

// router.post('/', protect, uploadEventMiddleware, eventController.create);
// router.put('/:id', protect, uploadEventMiddleware, eventController.update);
// router.get('/', eventController.getAll);
// router.get('/:id', eventController.getById);
// router.delete('/:id', protect, eventController.delete);

// module.exports = router;

// routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
// **PERUBAHAN:** Destructuring untuk mengimpor fungsi spesifik
const {
  authenticateToken,
  authorizeRoles,
} = require('../middleware/authMiddleware');
const uploadEventMiddleware = require('../middleware/uploadEventMiddleware');

// Buat event (biasanya hanya admin yang bisa)
router.post(
  '/',
  authenticateToken,
  authorizeRoles('admin'), // Hanya admin yang bisa membuat event
  uploadEventMiddleware, // Pastikan ini middleware multer yang benar
  eventController.create
);

// Perbarui event (hanya admin yang bisa)
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('admin'), // Hanya admin yang bisa memperbarui event
  uploadEventMiddleware, // Pastikan ini middleware multer yang benar
  eventController.update
);

// Dapatkan semua event (biasanya publik)
router.get('/', eventController.getAll);

// Dapatkan event berdasarkan ID (biasanya publik)
router.get('/:id', eventController.getById);

// Hapus event (hanya admin yang bisa)
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('admin'), // Hanya admin yang bisa menghapus event
  eventController.delete
);

module.exports = router;
