const express = require('express');
const router = express.Router();
const userLokerController = require('../controllers/userLokerController');
const protect = require('../middleware/authMiddleware');

router.post('/apply', protect, userLokerController.apply);
router.get('/user/:userID', userLokerController.getApplicationsByUser);
router.get('/loker/:lokerID', userLokerController.getApplicantsByLoker);
router.delete('/:id', protect, userLokerController.cancelApplication);

module.exports = router;
