// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/userController');
// const protect = require('../middleware/authMiddleware');
// const uploadUserMiddleware = require('../middleware/uploadUserMiddleware');
// const { registerValidation, updateProfileValidation } = require('../validators/userValidator');
// const { validationResult } = require('express-validator');

// const validateRequest = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
//   next();
// };

// // Registrasi user dengan upload profile picture dan validasi input
// router.post(
//   '/register',
//   uploadUserMiddleware.single('profilePic'),
//   registerValidation,
//   validateRequest,
//   userController.registerWithProfilePic
// );

// // Login user
// router.post('/login', userController.login);

// // Mendapatkan profil user yang sedang login (dilindungi middleware auth)
// router.get('/profile', protect, userController.getProfile);

// // Update profil user yang sedang login
// router.put(
//   '/profile',
//   protect,
//   updateProfileValidation,
//   validateRequest,
//   userController.updateProfile
// );

// // Update profile picture user yang sedang login
// router.put(
//   '/profile-pic',
//   protect,
//   uploadUserMiddleware.single('profilePic'),
//   userController.updateProfilePic
// );

// // Mendapatkan daftar semua user (bisa tanpa proteksi, sesuaikan kebutuhan)
// router.get('/', userController.getAllUsers);

// // Mendapatkan detail user berdasarkan ID
// router.get('/:id', userController.getUserById);

// // Menghapus user berdasarkan ID (dilindungi middleware auth)
// router.delete('/:id', protect, userController.deleteUser);

// module.exports = router;

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {
  authenticateToken,
  authorizeRoles,
} = require('../middleware/authMiddleware');
const uploadUserMiddleware = require('../middleware/uploadUserMiddleware');
const uploadPortfolioMiddleware = require('../middleware/uploadMiddleware'); // Pastikan ini diimpor dengan benar
const {
  registerValidation,
  updateProfileValidation,
} = require('../validators/userValidator');
const { validationResult } = require('express-validator');
const portfolioController = require('../controllers/portfolioController');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('--- EXPRESS-VALIDATOR ERRORS ---');
    console.error(errors.array());
    console.error('--- REQUEST BODY ---', req.body);
    console.error('--- REQUEST FILE ---', req.file);
    console.error('--------------------------------');
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// --- Rute Publik ---

router.post(
  '/register',
  uploadUserMiddleware.single('profilePic'),
  registerValidation,
  validateRequest,
  userController.register
);

router.post('/login', userController.login);

// --- Rute yang Memerlukan Autentikasi ---

router.get('/profile', authenticateToken, userController.getProfile);

router.put(
  '/profile',
  authenticateToken,
  updateProfileValidation,
  validateRequest,
  userController.updateProfile
);

router.put(
  '/profile-pic',
  authenticateToken,
  uploadUserMiddleware.single('profilePic'),
  userController.updateProfilePic
);

// --- Rute Admin-Spesifik ---

router.get(
  '/admin/profile',
  authenticateToken,
  authorizeRoles('admin'),
  userController.getAdminProfile
);

router.get(
  '/admin/stats',
  authenticateToken,
  authorizeRoles('admin'),
  userController.getAdminStats
);

router.get(
  '/admin/users',
  authenticateToken,
  authorizeRoles('admin'),
  userController.getAllUsers
);
router.post(
  '/admin/users',
  authenticateToken,
  authorizeRoles('admin'),
  userController.addUser
);
router.put(
  '/admin/users/:id',
  authenticateToken,
  authorizeRoles('admin'),
  userController.updateUser
);
router.delete(
  '/admin/users/:id',
  authenticateToken,
  authorizeRoles('admin'),
  userController.deleteUser
);

// Admin Portfolios Management (dengan Multer)
router.get(
  '/admin/portfolios',
  authenticateToken,
  authorizeRoles('admin'),
  portfolioController.getAll
);
router.post(
  '/admin/portfolios',
  authenticateToken,
  authorizeRoles('admin'),
  uploadPortfolioMiddleware.array('media', 10), // Middleware Multer untuk upload
  portfolioController.create
);
router.put(
  '/admin/portfolios/:id',
  authenticateToken,
  authorizeRoles('admin'),
  uploadPortfolioMiddleware.array('media', 10), // Middleware Multer untuk update
  portfolioController.update
);
router.delete(
  '/admin/portfolios/:id',
  authenticateToken,
  authorizeRoles('admin'),
  portfolioController.delete
);

// --- Rute Umum ---
router.get('/:id', userController.getUserById);

module.exports = router;
