const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const {
  authenticateToken,
  authorizeRoles,
} = require('../middleware/authMiddleware');

router.get(
  '/',
  authenticateToken,
  authorizeRoles('designer', 'artisan', 'admin'), // Semua bisa melihat daftar proyek
  projectController.getAll
);

router.post(
  '/',
  authenticateToken,
  authorizeRoles('artisan'), // Hanya artisan yang bisa membuat proyek
  projectController.create
);

router.get('/:id', authenticateToken, projectController.getById);

router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('artisan', 'admin'), // Artisan pemilik atau Admin bisa update
  projectController.update
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('artisan', 'admin'), // Artisan pemilik atau Admin bisa delete
  projectController.delete
);

module.exports = router;
