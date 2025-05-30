const express = require('express');
const router = express.Router();
const artikelController = require('../controllers/artikelController');
const protect = require('../middleware/authMiddleware');
const uploadArtikelMiddleware = require('../middleware/uploadArtikelMiddleware');

router.post('/', protect, uploadArtikelMiddleware.single('coverImage'), artikelController.create);
router.put('/:id', protect, uploadArtikelMiddleware.single('coverImage'), artikelController.update);
router.get('/', artikelController.getAll);
router.get('/:id', artikelController.getById);
router.delete('/:id', protect, artikelController.delete);

module.exports = router;
