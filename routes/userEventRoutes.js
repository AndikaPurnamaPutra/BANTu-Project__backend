const express = require('express');
const router = express.Router();
const userEventController = require('../controllers/userEventController');
const protect = require('../middleware/authMiddleware');

router.post('/join', protect, userEventController.joinEvent);
router.get('/user/:userID', userEventController.getEventsByUser);
router.get('/event/:eventID', userEventController.getUsersByEvent);
router.delete('/:id', protect, userEventController.leaveEvent);

module.exports = router;
