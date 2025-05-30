const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');
const uploadUserMiddleware = require('../middleware/uploadUserMiddleware');
const { registerValidation, updateProfileValidation } = require('../validators/userValidator');
const { validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// Registrasi user dengan upload profile picture dan validasi input
router.post(
  '/register',
  uploadUserMiddleware.single('profilePic'),
  registerValidation,
  validateRequest,
  userController.registerWithProfilePic
);

// Login user
router.post('/login', userController.login);

// Mendapatkan profil user yang sedang login (dilindungi middleware auth)
router.get('/profile', protect, userController.getProfile);

// Update profil user yang sedang login
router.put(
  '/profile',
  protect,
  updateProfileValidation,
  validateRequest,
  userController.updateProfile
);

// Update profile picture user yang sedang login
router.put(
  '/profile-pic',
  protect,
  uploadUserMiddleware.single('profilePic'),
  userController.updateProfilePic
);

// Mendapatkan daftar semua user (bisa tanpa proteksi, sesuaikan kebutuhan)
router.get('/', userController.getAllUsers);

// Mendapatkan detail user berdasarkan ID
router.get('/:id', userController.getUserById);

// Menghapus user berdasarkan ID (dilindungi middleware auth)
router.delete('/:id', protect, userController.deleteUser);

module.exports = router;
