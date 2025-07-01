// const express = require('express');
// const router = express.Router();
// const projectDesignerController = require('../controllers/projectDesignerController');
// const protect = require('../middleware/authMiddleware');

// router.post('/assign', protect, projectDesignerController.assignDesigner);

// router.get(
//   '/project/:projectID',
//   projectDesignerController.getDesignersByProject
// );
// router.get(
//   '/designer/:designerID',
//   projectDesignerController.getProjectsByDesigner
// );

// router.delete('/:id', protect, projectDesignerController.removeAssignment);

// module.exports = router;

// routes/projectDesignerRoutes.js
const express = require('express');
const router = express.Router();
const projectDesignerController = require('../controllers/projectDesignerController');
// **PERUBAHAN PENTING DI SINI:** Destructuring untuk mengimpor fungsi spesifik
const {
  authenticateToken,
  authorizeRoles,
} = require('../middleware/authMiddleware');

// Rute untuk menetapkan desainer ke proyek
router.post(
  '/assign',
  authenticateToken, // Gunakan authenticateToken di sini
  authorizeRoles('admin'), // Biasanya hanya admin yang bisa menetapkan desainer ke proyek
  projectDesignerController.assignDesigner
);

// Rute untuk mendapatkan desainer berdasarkan ID proyek
// Ini mungkin rute publik, atau bisa dilindungi jika informasi proyek sensitif
router.get(
  '/project/:projectID',
  // authenticateToken, // Opsional: tambahkan jika perlu login
  projectDesignerController.getDesignersByProject
);

// Rute untuk mendapatkan proyek berdasarkan ID desainer
// Ini juga bisa rute publik (untuk portofolio), atau dilindungi
router.get(
  '/designer/:designerID',
  // authenticateToken, // Opsional: tambahkan jika perlu login
  projectDesignerController.getProjectsByDesigner
);

// Rute untuk menghapus penugasan desainer dari proyek
router.delete(
  '/:id',
  authenticateToken, // Gunakan authenticateToken di sini
  authorizeRoles('admin'), // Biasanya hanya admin yang bisa menghapus penugasan
  projectDesignerController.removeAssignment
);

module.exports = router;
