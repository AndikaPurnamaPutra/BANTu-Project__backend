const express = require('express');
const router = express.Router();
const commentForumController = require('../controllers/commentForumController');
const protect = require('../middleware/authMiddleware');

router.post('/', protect, commentForumController.create);
router.get('/forum/:forumID', commentForumController.getByForum);
router.put('/:id', protect, commentForumController.update);
router.delete('/:id', protect, commentForumController.delete);

module.exports = router;
