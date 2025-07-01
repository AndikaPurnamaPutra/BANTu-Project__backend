// const { body } = require('express-validator');

// exports.registerValidation = [
//   body('firstName').notEmpty().withMessage('First name is required'),
//   body('username').notEmpty().withMessage('Username is required'),
//   body('email').isEmail().withMessage('Valid email is required'),
//   body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
//   body('role').isIn(['designer', 'artisan']).withMessage('Role must be designer or artisan'),
// ];

// exports.updateProfileValidation = [
//   body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
//   body('bio').optional().isString(),
//   body('contactInfo').optional().custom(value => {
//     if (typeof value === 'string') {
//       try {
//         JSON.parse(value);
//       } catch {
//         throw new Error('contactInfo must be valid JSON');
//       }
//     }
//     return true;
//   }),
//   body('subCategory').optional().custom(value => {
//     if (typeof value === 'string') {
//       try {
//         const arr = JSON.parse(value);
//         if (!Array.isArray(arr)) throw new Error();
//       } catch {
//         throw new Error('subCategory must be a JSON array');
//       }
//     }
//     return true;
//   }),
// ];

// validators/userValidator.js
const { body } = require('express-validator');

exports.registerValidation = [
  body('username').notEmpty().withMessage('Nama pengguna wajib diisi.'),
  body('email').isEmail().withMessage('Email tidak valid.'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Kata sandi harus minimal 6 karakter.'),
  body('role')
    .isIn(['admin', 'designer', 'artisan'])
    .withMessage('Peran tidak valid.'),

  // Validasi bersyarat untuk field non-admin (firstName, bio, categories, profilePic)
  // Cara 1: Menggunakan array validator untuk kondisi OR
  body('firstName')
    .if(
      (value, { req }) =>
        req.body.role === 'designer' || req.body.role === 'artisan'
    )
    .notEmpty()
    .withMessage('Nama depan wajib diisi untuk peran ini.'),

  body('bio')
    .if(
      (value, { req }) =>
        req.body.role === 'designer' || req.body.role === 'artisan'
    )
    .notEmpty()
    .withMessage('Deskripsi wajib diisi untuk peran ini.'),

  body('subCategory')
    .if(body('role').equals('designer')) // Hanya designer yang punya kategori
    .custom((value, { req }) => {
      // Periksa juga apakah role adalah designer di sini untuk validasi yang lebih kuat
      if (req.body.role === 'designer') {
        if (typeof value === 'string') {
          try {
            const arr = JSON.parse(value);
            if (!Array.isArray(arr) || arr.length === 0) {
              throw new Error('Kategori wajib diisi dan harus berupa array.');
            }
          } catch {
            throw new Error('Kategori harus berupa array JSON yang valid.');
          }
        } else if (!Array.isArray(value) || value.length === 0) {
          throw new Error('Kategori wajib diisi dan harus berupa array.');
        }
      }
      return true;
    }),
];

exports.updateProfileValidation = [
  body('firstName')
    .optional()
    .notEmpty()
    .withMessage('Nama depan tidak boleh kosong.'),
  body('bio').optional().isString(),
  body('contactInfo')
    .optional()
    .custom((value) => {
      if (typeof value === 'string') {
        try {
          JSON.parse(value);
        } catch {
          throw new Error('contactInfo harus berupa JSON yang valid.');
        }
      }
      return true;
    }),
  body('subCategory')
    .optional()
    .custom((value) => {
      if (typeof value === 'string') {
        try {
          const arr = JSON.parse(value);
          if (!Array.isArray(arr)) throw new Error();
        } catch {
          throw new Error('subCategory harus berupa array JSON yang valid.');
        }
      }
      return true;
    }),
];
