const express = require('express');
const router = express.Router();
const lokerController = require('../controllers/lokerController');
const protect = require('../middleware/authMiddleware');
const uploadLokerMiddleware = require('../middleware/uploadLokerMiddleware');

router.post('/', protect, uploadLokerMiddleware.single('thumbnail'), lokerController.create);
router.put('/:id', protect, uploadLokerMiddleware.single('thumbnail'), lokerController.update);
router.get('/', lokerController.getAll);
router.get('/:id', lokerController.getById);
router.delete('/:id', protect, lokerController.delete);

module.exports = router;
