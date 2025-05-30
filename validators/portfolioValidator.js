const { body } = require('express-validator');

exports.createPortfolioValidation = [
  body('title')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Title minimal 3 karakter')
    .notEmpty()
    .withMessage('Title wajib diisi'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category wajib diisi'),
  // validasi media dilakukan di controller karena multer handle file
];
