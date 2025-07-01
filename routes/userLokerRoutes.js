// const express = require('express');
// const router = express.Router();
// const userLokerController = require('../controllers/userLokerController');
// const protect = require('../middleware/authMiddleware');

// router.post('/apply', protect, userLokerController.apply);
// router.get('/user/:userID', userLokerController.getApplicationsByUser);
// router.get('/loker/:lokerID', userLokerController.getApplicantsByLoker);
// router.delete('/:id', protect, userLokerController.cancelApplication);

// module.exports = router;

// routes/userLokerRoutes.js
const express = require('express');
const router = express.Router();
const userLokerController = require('../controllers/userLokerController');
// **PERUBAHAN:** Destructuring untuk mengimpor fungsi spesifik
const {
  authenticateToken,
  authorizeRoles,
} = require('../middleware/authMiddleware');

// Apply loker (oleh user biasa)
router.post(
  '/apply',
  authenticateToken,
  authorizeRoles('designer', 'artisan'), // Hanya designer/artisan yang bisa melamar loker
  userLokerController.apply
);

// Dapatkan lamaran oleh user tertentu (biasanya hanya user itu sendiri atau admin)
router.get(
  '/user/:userID',
  authenticateToken, // Harusnya dilindungi, hanya user tsb atau admin yang bisa melihat
  authorizeRoles('designer', 'artisan', 'admin'), // Hanya user tsb atau admin
  userLokerController.getApplicationsByUser
);

// Dapatkan pelamar untuk loker tertentu (biasanya hanya pembuat loker atau admin)
router.get(
  '/loker/:lokerID',
  authenticateToken,
  authorizeRoles('admin'), // Hanya admin yang bisa melihat pelamar
  userLokerController.getApplicantsByLoker
);

// Batalkan lamaran (oleh user biasa)
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('designer', 'artisan'), // Hanya designer/artisan yang bisa membatalkan lamaran
  userLokerController.cancelApplication
);

module.exports = router;
