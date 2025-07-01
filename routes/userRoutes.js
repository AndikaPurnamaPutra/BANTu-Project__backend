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

// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {
  authenticateToken,
  authorizeRoles,
} = require('../middleware/authMiddleware');
const uploadUserMiddleware = require('../middleware/uploadUserMiddleware');
const {
  registerValidation,
  updateProfileValidation,
} = require('../validators/userValidator');
const { validationResult } = require('express-validator');
const portfolioController = require('../controllers/portfolioController');

// Middleware untuk menangani hasil validasi dari express-validator
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Logging detail untuk debugging validasi
    console.error('--- EXPRESS-VALIDATOR ERRORS ---');
    console.error(errors.array());
    console.error('--- REQUEST BODY ---', req.body);
    console.error('--- REQUEST FILE ---', req.file);
    console.error('--------------------------------');
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// --- Rute Publik (Tidak Memerlukan Autentikasi) ---

// Registrasi pengguna (untuk semua peran: admin, designer, artisan)
router.post(
  '/register',
  uploadUserMiddleware.single('profilePic'),
  registerValidation,
  validateRequest,
  userController.register
);

// Login pengguna (untuk semua peran: admin, designer, artisan)
router.post('/login', userController.login);

// --- Rute yang Memerlukan Autentikasi (Untuk Pengguna Biasa & Admin yang Login) ---

// Mendapatkan profil user yang sedang login
router.get('/profile', authenticateToken, userController.getProfile);

// Update profil user yang sedang login
router.put(
  '/profile',
  authenticateToken,
  updateProfileValidation,
  validateRequest,
  userController.updateProfile
);

// Update profile picture user yang sedang login
router.put(
  '/profile-pic',
  authenticateToken,
  uploadUserMiddleware.single('profilePic'),
  userController.updateProfilePic
);

// --- Rute Admin-Spesifik (Memerlukan Autentikasi DAN Otorisasi 'admin') ---

// Admin profile
router.get(
  '/admin/profile',
  authenticateToken,
  authorizeRoles('admin'),
  userController.getAdminProfile
);

// Admin dashboard stats
router.get(
  '/admin/stats',
  authenticateToken,
  authorizeRoles('admin'),
  userController.getAdminStats
);

// Users management (admin only)
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

// Admin Portfolios Management
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
  portfolioController.create
);
router.put(
  '/admin/portfolios/:id',
  authenticateToken,
  authorizeRoles('admin'),
  portfolioController.update
);
router.delete(
  '/admin/portfolios/:id',
  authenticateToken,
  authorizeRoles('admin'),
  portfolioController.delete
);

// --- Rute Umum (Mengambil detail user berdasarkan ID) ---
// Rute dinamis ini harus diletakkan PALING AKHIR di antara semua rute GET yang diawali dengan `/`
router.get('/:id', userController.getUserById);

module.exports = router;
