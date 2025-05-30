const { body } = require('express-validator');

exports.registerValidation = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['designer', 'artisan']).withMessage('Role must be designer or artisan'),
];

exports.updateProfileValidation = [
  body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
  body('bio').optional().isString(),
  body('contactInfo').optional().custom(value => {
    if (typeof value === 'string') {
      try {
        JSON.parse(value);
      } catch {
        throw new Error('contactInfo must be valid JSON');
      }
    }
    return true;
  }),
  body('subCategory').optional().custom(value => {
    if (typeof value === 'string') {
      try {
        const arr = JSON.parse(value);
        if (!Array.isArray(arr)) throw new Error();
      } catch {
        throw new Error('subCategory must be a JSON array');
      }
    }
    return true;
  }),
];
