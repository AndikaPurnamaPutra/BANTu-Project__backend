// const express = require('express');
// const router = express.Router();
// const projectController = require('../controllers/projectController');
// const protect = require('../middleware/authMiddleware');

// // Semua route ini perlu autentikasi, misalnya
// router.get('/', protect, projectController.getAll);
// router.post('/', protect, projectController.create);
// router.get('/:id', protect, projectController.getById);
// router.put('/:id', protect, projectController.update);
// router.delete('/:id', protect, projectController.delete);

// module.exports = router;

// routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
// **PERUBAHAN PENTING DI SINI:** Destructuring untuk mengimpor fungsi spesifik
const {
  authenticateToken,
  authorizeRoles,
} = require('../middleware/authMiddleware');

// Semua route ini perlu autentikasi. Tambahkan juga otorisasi jika diperlukan.
// Rute GET /
router.get(
  '/',
  authenticateToken, // Gunakan authenticateToken di sini
  // Opsional: authorizeRoles jika hanya peran tertentu yang bisa melihat semua proyek
  projectController.getAll // Pastikan ini adalah fungsi yang diekspor dari projectController
);

// Rute POST /
router.post(
  '/',
  authenticateToken,
  authorizeRoles('designer', 'artisan'), // Hanya artisan yang bisa membuat proyek
  projectController.create
);

// Rute GET /:id
router.get(
  '/:id',
  authenticateToken, // Biasanya getById bisa publik, tapi jika dilindungi, gunakan authenticateToken
  projectController.getById
);

// Rute PUT /:id
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('designer', 'admin'), // Desainer yang buat atau Admin bisa update
  projectController.update
);

// Rute DELETE /:id
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('designer', 'admin'), // Desainer yang buat atau Admin bisa delete
  projectController.delete
);

module.exports = router;
