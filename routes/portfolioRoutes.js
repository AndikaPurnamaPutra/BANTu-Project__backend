// const express = require('express');
// const router = express.Router();
// const portfolioController = require('../controllers/portfolioController');
// const protect = require('../middleware/authMiddleware');
// const optionalAuth = require('../middleware/optionalAuth');
// const upload = require('../middleware/uploadMiddleware');
// const {
//   createPortfolioValidation,
// } = require('../validators/portfolioValidator');
// const { validationResult } = require('express-validator');

// const validateRequest = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty())
//     return res.status(400).json({ errors: errors.array() });
//   next();
// };

// // Gunakan optionalAuth supaya bisa akses tanpa login, tapi jika token ada bisa dipakai
// router.get('/', optionalAuth, portfolioController.getAll);

// router.post(
//   '/',
//   protect,
//   (req, res, next) => {
//     upload.array('media', 10)(req, res, (err) => {
//       if (err) {
//         return res.status(400).json({ message: err.message });
//       }
//       next();
//     });
//   },
//   createPortfolioValidation,
//   validateRequest,
//   portfolioController.create
// );

// router.get('/:id', portfolioController.getById);
// router.put('/:id', protect, portfolioController.update);
// router.delete('/:id', protect, portfolioController.delete);
// router.put('/:id/like', protect, portfolioController.toggleLike);

// module.exports = router;

// routes/portfolioRoutes.js
const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
// **Perubahan di sini:** Destructuring untuk mengimpor fungsi spesifik
const {
  authenticateToken,
  authorizeRoles,
} = require('../middleware/authMiddleware');
const optionalAuth = require('../middleware/optionalAuth'); // Pastikan ini juga diimpor dengan benar
const upload = require('../middleware/uploadMiddleware'); // Middleware untuk upload file portfolio
const {
  createPortfolioValidation,
} = require('../validators/portfolioValidator');
const { validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  next();
};

// Gunakan optionalAuth supaya bisa akses tanpa login, tapi jika token ada bisa dipakai
router.get('/', optionalAuth, portfolioController.getAll); // Asumsi optionalAuth adalah fungsi middleware

// Rute untuk membuat portfolio
router.post(
  '/',
  authenticateToken, // Gunakan authenticateToken di sini
  authorizeRoles('designer', 'artisan'), // Tambahkan otorisasi untuk yang bisa membuat portfolio
  (req, res, next) => {
    // Middleware upload file media untuk portfolio
    upload.array('media', 10)(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  createPortfolioValidation,
  validateRequest,
  portfolioController.create
);

router.get('/:id', portfolioController.getById);
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('designer', 'artisan'),
  portfolioController.update
); // Perbaiki di sini
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('designer', 'artisan'),
  portfolioController.delete
); // Perbaiki di sini
router.put('/:id/like', authenticateToken, portfolioController.toggleLike); // Perbaiki di sini

module.exports = router;
