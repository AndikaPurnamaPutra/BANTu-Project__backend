const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const protect = require('../middleware/authMiddleware');

// Semua route ini perlu autentikasi, misalnya
router.get('/', protect, projectController.getAll);
router.post('/', protect, projectController.create);
router.get('/:id', protect, projectController.getById);
router.put('/:id', protect, projectController.update);
router.delete('/:id', protect, projectController.delete);

module.exports = router;
