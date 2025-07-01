// const express = require('express');
// const router = express.Router();
// const userEventController = require('../controllers/userEventController');
// const protect = require('../middleware/authMiddleware');

// router.post('/join', protect, userEventController.joinEvent);
// router.get('/user/:userID', userEventController.getEventsByUser);
// router.get('/event/:eventID', userEventController.getUsersByEvent);
// router.delete('/:id', protect, userEventController.leaveEvent);

// module.exports = router;

// routes/userEventRoutes.js
const express = require('express');
const router = express.Router();
const userEventController = require('../controllers/userEventController');
// **PERUBAHAN:** Destructuring untuk mengimpor fungsi spesifik
const {
  authenticateToken,
  authorizeRoles,
} = require('../middleware/authMiddleware');

// Gabung event (oleh user biasa)
router.post(
  '/join',
  authenticateToken,
  authorizeRoles('designer', 'artisan'), // Hanya designer/artisan yang bisa bergabung
  userEventController.joinEvent
);

// Dapatkan event yang diikuti oleh user tertentu (bisa publik untuk melihat partisipasi, atau dilindungi)
router.get('/user/:userID', userEventController.getEventsByUser);

// Dapatkan user yang bergabung dengan event tertentu (bisa publik, atau dilindungi admin)
router.get('/event/:eventID', userEventController.getUsersByEvent);

// Tinggalkan event (oleh user biasa)
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('designer', 'artisan'), // Hanya designer/artisan yang bisa meninggalkan event
  userEventController.leaveEvent
);

module.exports = router;
