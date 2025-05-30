const express = require('express');
const router = express.Router();
const {
  registerAdmin,
  getAdminStats,
  loginAdmin,
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  getAdminProfile, // optional: jika ingin menampilkan profil admin sendiri
} = require('../controllers/adminController');
const protectAdmin = require('../middleware/adminMiddleware');
const portfolioController = require('../controllers/portfolioController');

// Register & login admin
router.post('/register-admin', registerAdmin);
router.post('/login', loginAdmin);

// Admin profile (optional)
router.get('/profile', protectAdmin, getAdminProfile);

// Admin dashboard stats
router.get('/stats', protectAdmin, getAdminStats);

// Users management (admin only)
router.get('/users', protectAdmin, getUsers);
router.post('/users', protectAdmin, addUser);
router.put('/users/:id', protectAdmin, updateUser);
router.delete('/users/:id', protectAdmin, deleteUser);

// Tambahkan route admin portfolios CRUD:
router.get('/portfolios', protectAdmin, portfolioController.getAll);
router.post(
  '/portfolios',
  protectAdmin,
  // middleware upload file jika ada
  portfolioController.create
);
router.put('/portfolios/:id', protectAdmin, portfolioController.update);
router.delete('/portfolios/:id', protectAdmin, portfolioController.delete);

module.exports = router;
