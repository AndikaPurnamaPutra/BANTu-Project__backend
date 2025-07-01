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

const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const {
  authenticateToken,
  authorizeRoles,
} = require('../middleware/authMiddleware');
const optionalAuth = require('../middleware/optionalAuth');
const upload = require('../middleware/uploadMiddleware'); // Instance Multer yang sudah dikonfigurasi
const {
  createPortfolioValidation,
} = require('../validators/portfolioValidator');
const { validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('--- EXPRESS-VALIDATOR ERRORS ---');
    console.error(errors.array());
    console.error('--- REQUEST BODY ---', req.body);
    console.error('--- REQUEST FILE ---', req.file);
    console.error('--- REQUEST FILES ---', req.files);
    console.error('--------------------------------');
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Rute publik untuk mendapatkan semua portofolio (dengan optionalAuth)
router.get('/', optionalAuth, portfolioController.getAll);

// Rute untuk membuat portofolio
router.post(
  '/',
  authenticateToken,
  authorizeRoles('designer', 'artisan', 'admin'), // Admin juga bisa membuat
  upload.array('media', 10), // Middleware Multer untuk upload banyak file
  createPortfolioValidation,
  validateRequest,
  portfolioController.create
);

// Rute publik untuk mendapatkan portofolio berdasarkan ID
router.get('/:id', optionalAuth, portfolioController.getById);

// Rute untuk mengupdate portofolio
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('designer', 'artisan', 'admin'), // Admin juga bisa mengupdate
  upload.array('media', 10), // Middleware Multer untuk update file (jika ada)
  portfolioController.update
);

// Rute untuk menghapus portofolio
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('designer', 'artisan', 'admin'), // Admin juga bisa menghapus
  portfolioController.delete
);

// Rute untuk toggle like/unlike portofolio
router.put('/:id/like', authenticateToken, portfolioController.toggleLike);

module.exports = router;
