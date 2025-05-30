const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const protect = require('../middleware/authMiddleware');
const uploadEventMiddleware = require('../middleware/uploadEventMiddleware');

router.post('/', protect, uploadEventMiddleware, eventController.create);
router.put('/:id', protect, uploadEventMiddleware, eventController.update);
router.get('/', eventController.getAll);
router.get('/:id', eventController.getById);
router.delete('/:id', protect, eventController.delete);

module.exports = router;
