const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const protect = require('../middleware/authMiddleware');

router.post('/', protect, forumController.create);
router.get('/', forumController.getAll);
router.get('/:id', forumController.getById);
router.put('/:id', protect, forumController.update);
router.delete('/:id', protect, forumController.delete);

module.exports = router;
